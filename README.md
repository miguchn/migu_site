# 咪咕看见小黑 · 个人网站

探索 AI 科技，分享无限乐趣。

一座关于 AI、代码与奇思妙想的数字小岛。纯前端，使用 Vite、TypeScript、CSS 与 SVG 实现。无需后端、数据库、API 密钥或外部字体服务。

网站品牌为「咪咕看见小黑」，主理人自称「小黑」。页面中的黑猫是小黑在数字世界里的化身。

## 本地运行

需要 Node.js 22.12+ 与 npm。

```sh
npm ci
npm run dev
```

## 构建与检查

```sh
npm run build
npm run preview
```

构建会先运行 TypeScript 检查，再输出静态文件到 `dist/`。本地 `preview` 用于验证生产产物。

## Cloudflare Pages 部署

在 Cloudflare 的 Workers & Pages 中创建 **Pages** 项目，连接公开 GitHub 仓库 [miguchn/migu_site](https://github.com/miguchn/migu_site)，使用以下设置：

| 设置                   | 值                   |
| ---------------------- | -------------------- |
| Framework preset       | None                 |
| Production branch      | main                 |
| Build command          | npm run build        |
| Build output directory | dist                 |
| Root directory         | 留空，使用仓库根目录 |
| NODE_VERSION           | 22                   |

无需额外部署命令，无需配置服务端运行时。成功后 Cloudflare 分配 `pages.dev` 地址；之后推送会自动构建。也可将本地构建后的 `dist/` 上传到 Pages 的 Direct Upload 项目。

部署完成后，在 Pages 项目的 **Custom domains** 中添加 `miguchn.com`，按控制台提示绑定域名与 DNS，并等待证书激活。正式入口为 **https://miguchn.com/**。Cloudflare 部署及域名绑定由站点所有者自行执行。

站内菜单通过滚动定位，不向地址栏添加 `#`、路径或查询参数。页面的 canonical、Open Graph 地址与站点地图均使用根域名。

`public/_headers` 为 Cloudflare Pages 提供安全响应头与带内容哈希的资源缓存设置。若改用 Workers Static Assets，需按对应部署方式重新配置响应头。

参考：[Cloudflare Pages 静态站点部署](https://developers.cloudflare.com/pages/framework-guides/deploy-anything/)、[Vite 静态部署](https://vite.dev/guide/static-deploy.html)。

## 内容与交互

- 首页、探索方向、三个真实开源作品、关于与商务联系。
- 下拉页面驱动小岛建筑拼接、桥梁转动与场景变化，让探索过程成为一段连续的空间旅程。
- 三幕滚动旅程：道路先就位，小黑以四条独立运动的腿逐阶上楼、过桥、到达屋顶；向上滚动会转身返回，停止滚动会完成当前一步并落稳，章节按钮可跳转。
- 小岛昼夜切换、黑猫化身的眨眼/摇尾/招呼、邮箱复制、移动端折叠菜单。
- 首屏标题逐行入场、台阶引路光、首屏下滑提示与拱门形回到顶部入口。
- 作品插画轻微上移入场、关于区轨道旋转、联系区拱门打开。
- 支持键盘导航、跳过导航链接、交互状态播报与减少动态效果系统偏好。
- SVG 采用原创几何插画，没有使用《纪念碑谷》的原画、角色、商标或素材。
- 联系：`miguchn@gmail.com`；GitHub / X：`@miguchn`。

内容在 `src/main.ts`，建筑在 `src/scene.ts` 与 `src/journey.ts`，黑猫在 `src/cat.ts`。滚动控制在 `src/motion.ts`，使用原生滚动与 `requestAnimationFrame`，不拦截滚轮。系统开启减少动态效果时，漫游改为静态排版。

基础样式在 `src/style.css`，漫游与角色动效在 `src/journey.css`、`src/personality.css`。字体使用系统字体；不同操作系统的中文字体外观可能略有差异。

黑猫按站点所有者提供的头像和坐姿参考绘制为分层 SVG：品牌使用头像，首屏与关于区使用坐姿，漫游使用独立行走姿态。眼睛、头部、尾巴、爪子分别保留动效，避免把静态整图当成走路动画。

文案保留“好奇心，没有边界”和奇想世界的叙事，页面以空间、路径与昼夜变化串起内容。保持本站原有的等距建筑、纸色背景和鼠尾草绿/珊瑚色；没有引入外站素材。

`public/share-card.svg` 是分享封面的可编辑矢量源，`public/share-card.png` 为 1200 × 630 像素的预览图。`index.html` 已配置 Open Graph 和 Twitter 大图元数据；部署后才能验证各平台抓取和缓存的实际结果。

## GitHub 交付

公开仓库：[miguchn/migu_site](https://github.com/miguchn/migu_site)。`node_modules/`、`dist/`、环境变量及本地状态均已排除在版本控制外。克隆后使用 `npm ci` 与 `npm run build` 即可生成部署文件。
