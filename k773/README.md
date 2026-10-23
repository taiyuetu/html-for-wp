# 本地镜像副本

源站: https://yanshi.92wailian.com/k773/
镜像时间: 2026-10-22 20:45（20:57 补全资源与链接改写）

## 本次抓取状态

- 页面：58 个（sitemap 收录 151 个，**尚缺 93 个**）
- 静态资源：已补全约 190 个（skin/ 样式脚本、skin/images/、static/upload 图片）
- 本地断链：HTML 中引用的样式/脚本/图片，已抓到的页面里 **0 条缺失**
- 未完成原因：抓取进行到约 1/3 时源站整体返回 **502 Bad Gateway**（Tengine 上游异常），
  持续 20 分钟以上未恢复，剩余页面与约 42 张图片无法继续下载

## 已完整可离线浏览的部分

- 首页 `/k773/`
- 栏目页与详情页：`aiwriting`（13）、`aivideo`（13）、`aichat`（13）、`aiaudio`（12）、
  `aicode`（4）、`aioffice`（1）、`aiimages`（1）

## 尚未抓到的栏目

- `?about/`、`?blog/`、`?aidesign/`、`?aimodels/`、`?aibenchmarks/` 及其详情页
- 上述栏目在页面里仍指向线上地址（`https://yanshi.92wailian.com/k773/...`），
  源站恢复后这些链接可直接点通

## 打开方式

- 直接双击 `index.html` 即可浏览
- 或在本目录执行 `python -m http.server 8000`，访问 http://127.0.0.1:8000/

## 说明

- 源站自身缺失的文件（如 `skin/js/common.js` 及各字体 woff）在线上就是 404，非漏抓
- 表单提交、站内搜索、在线客服依赖后端，静态副本只保留外观
