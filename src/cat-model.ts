import * as THREE from 'three';
import { ConvexGeometry } from 'three/addons/geometries/ConvexGeometry.js';
import { createLegSurface } from './cat-leg-surface';
import { LEG_UPPER, LEG_LOWER, HIP_HEIGHT } from './cat-walk-cycle';

type Ring = { x: number; bottom: number; top: number; width: number; bevel: number; baseWidth?: number };
export type CatLeg = { pivot: THREE.Group; upper: THREE.Group; lower: THREE.Group; foot: THREE.Group; surface: THREE.Mesh; front: boolean; side: number };

/** Eight-sided cross sections keep broad sculpted planes, rather than a sphere or stacked boxes. */
function loft(rings: Ring[]) {
  const points: THREE.Vector3[][] = rings.map(({x,bottom,top,width,bevel:b,baseWidth=width}) => [
    new THREE.Vector3(x,top,-width+b),new THREE.Vector3(x,top,width-b),
    new THREE.Vector3(x,top-b,width),new THREE.Vector3(x,bottom+b,baseWidth),
    new THREE.Vector3(x,bottom,baseWidth-b),new THREE.Vector3(x,bottom,-baseWidth+b),
    new THREE.Vector3(x,bottom+b,-baseWidth),new THREE.Vector3(x,top-b,-width),
  ]);
  const positions:number[]=[];
  const triangle=(a:THREE.Vector3,b:THREE.Vector3,c:THREE.Vector3)=>positions.push(...a.toArray(),...b.toArray(),...c.toArray());
  // The loop faces outward along +x; side winding is reversed from the end cap.
  for(let r=0;r<points.length-1;r++) for(let j=0;j<8;j++) {
    const a=points[r][j],b=points[r][(j+1)%8],c=points[r+1][(j+1)%8],d=points[r+1][j];
    triangle(a,b,c);triangle(a,c,d);
  }
  for(const [r,reverse] of [[0,true],[points.length-1,false]] as const){
    const p=points[r],center=new THREE.Vector3(rings[r].x,(rings[r].top+rings[r].bottom)/2,0);
    for(let j=0;j<8;j++) reverse?triangle(center,p[(j+1)%8],p[j]):triangle(center,p[j],p[(j+1)%8]);
  }
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));g.computeVertexNormals();return g;
}

function earGeometry(side:number) {
  // A true triangular prism: the camera-facing plane is broad, not a thin spike.
  const v=[
    [-.21,.22,side*.27],[.08,.25,side*.29],[-.055,.53,side*.26],
    [-.17,.20,side*.13],[.065,.23,side*.14],[-.075,.47,side*.12],
  ];
  const faces=[[0,1,2],[3,5,4],[0,3,4],[0,4,1],[1,4,5],[1,5,2],[2,5,3],[2,3,0]];
  const p:number[]=[];
  for(const face of faces)for(const i of face)p.push(...v[i]);
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(p,3));g.computeVertexNormals();return g;
}

export function createCatModel() {
  const root=new THREE.Group();root.name='Xiaohei';
  const body=new THREE.Group();body.name='Body';root.add(body);
  // Neutral stone-charcoal keeps the cat distinct without turning green under the garden lights.
  const charcoal=new THREE.MeshStandardMaterial({color:0x343e40,roughness:.94,metalness:0,flatShading:true,side:THREE.DoubleSide});
  const ivory=new THREE.MeshStandardMaterial({color:0xe7dcba,roughness:.8,metalness:0});
  const pupilMaterial=new THREE.MeshStandardMaterial({color:0x111a19,roughness:1});
  const mesh=(geometry:THREE.BufferGeometry,material:THREE.Material=charcoal)=>{
    const m=new THREE.Mesh(geometry,material);m.castShadow=true;m.receiveShadow=true;return m;
  };
  // New compact silhouette: a faceted ribcage with a rising chest, not a long box.
  const torso=mesh(new THREE.IcosahedronGeometry(1,1));
  torso.scale.set(.82,.375,.36);torso.position.set(-.16,.875,0);
  torso.name='Faceted ribcage';body.add(torso);
  const chest=mesh(loft([
    {x:.08,bottom:.55,top:1.14,width:.30,baseWidth:.24,bevel:.09},
    {x:.39,bottom:.60,top:1.39,width:.31,baseWidth:.235,bevel:.10},
    {x:.63,bottom:.91,top:1.43,width:.265,bevel:.08},
  ]));chest.name='Rising chest';
  // Weld the ribcage and chest into a single silhouette, removing overlapping facets.
  const hullPoints: THREE.Vector3[]=[];
  for(const part of [torso,chest]) {
    part.updateMatrix();
    const positions=part.geometry.getAttribute('position');
    for(let i=0;i<positions.count;i++)hullPoints.push(new THREE.Vector3().fromBufferAttribute(positions,i).applyMatrix4(part.matrix));
    part.geometry.dispose();
  }
  body.remove(torso);
  const shell=mesh(new ConvexGeometry(hullPoints));shell.name='Unified sculpted chest and ribcage';body.add(shell);
  const head=new THREE.Group();head.name='Head';head.position.set(.62,1.32,0);body.add(head);
  const skull=mesh(new THREE.IcosahedronGeometry(1,1));
  skull.scale.set(.40,.345,.34);skull.position.set(.015,.015,0);head.add(skull);
  head.add(mesh(earGeometry(1)),mesh(earGeometry(-1)));
  for(const side of [-1,1]) {
    const eye=new THREE.Group();eye.name='eye';
    eye.position.set(.22,.005,side*.28);eye.rotation.y=side*.12;
    const iris=mesh(new THREE.SphereGeometry(1,16,10),ivory);iris.scale.set(.052,.065,.012);eye.add(iris);
    const pupil=mesh(new THREE.SphereGeometry(1,12,8),pupilMaterial);pupil.scale.set(.012,.048,.006);pupil.position.set(.005,0,side*.009);eye.add(pupil);
    head.add(eye);
  }
  const tail=new THREE.Group();tail.name='Tail';tail.position.set(-.83,1.02,0);body.add(tail);
  const curve=new THREE.CatmullRomCurve3([
    new THREE.Vector3(0,0,0),new THREE.Vector3(-.27,.16,0),new THREE.Vector3(-.43,.45,.01),
    new THREE.Vector3(-.42,.78,.025),new THREE.Vector3(-.23,1.00,.04),
  ]);
  // A substantial hexagonal sweep and flat end match the carved, ribbon-like tail.
  const tailArt=mesh(new THREE.TubeGeometry(curve,16,.12,6,false));tail.add(tailArt);
  const tip=mesh(new THREE.CircleGeometry(.12,6));tip.position.copy(curve.getPoint(1));tip.quaternion.setFromUnitVectors(new THREE.Vector3(0,0,1),curve.getTangent(1));tail.add(tip);
  const legs:CatLeg[]=[];
  for(const front of [false,true])for(const side of [-1,1]) {
    const pivot=new THREE.Group();pivot.name=`${front?'Front':'Hind'} ${side>0?'near':'far'}`;
    pivot.position.set(front?.42:-.62,HIP_HEIGHT,side*.215);root.add(pivot);
    const upper=new THREE.Group(),lower=new THREE.Group(),foot=new THREE.Group();pivot.add(upper);upper.add(lower);lower.position.y=-LEG_UPPER;lower.add(foot);foot.position.y=-LEG_LOWER;
    const surface=createLegSurface(charcoal,front);pivot.add(surface);
    const paw=mesh(loft([
      {x:-.07,bottom:-.08,top:.01,width:.08,bevel:.02},
      {x:.055,bottom:-.08,top:.005,width:.095,bevel:.022},
      {x:.10,bottom:-.08,top:-.03,width:.075,bevel:.02},
    ]));foot.add(paw);
    legs.push({pivot,upper,lower,foot,surface,front,side});
  }
  root.userData.model='Compact faceted cat, rebuilt ribcage, chest and skull';
  return {root,body,head,tail,legs};
}
