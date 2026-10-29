# yahengfitting.com 本地镜像站

原站：https://www.yahengfitting.com/ （雅恒制冷 —— 制冷/暖通铜管管件企业站）
复刻时间：2026-10-27

## 怎么跑

**必须走 HTTP，不能双击 index.html**（站点是 React SPA，资源靠 fetch 加载，`file://` 下会被 CORS 拦死）。

- Windows：双击 `start.bat`
- macOS / Linux：双击 `start.command`，或终端里 `./start.sh`
- 通用：`python start.py`（默认端口 8899，被占用会自动顺延并开浏览器）

## 目录结构

```
yahengfitting/
├── start.py / start.bat / start.sh / start.command   # 一键启动
├── README.md
├── screenshots/          # 实测截图
└── site/                 # 站点本体（纯静态）
    ├── index.html        # SPA 入口（唯一 HTML）
    ├── assets/           # JS / CSS / 图片 / 视频（Vite 构建产物）
    ├── api/content       # 后端 GET /api/content 的快照（原站返回 {}）
    ├── api/media         # 后端 GET /api/media 的快照（2 个图片槽位）
    └── uploads/          # media 槽位引用的 2 张图
```

## 原站是什么

- Vite 构建的 React SPA（单 chunk：`index-CMufCpAS.js` 约 1 MB + `index-CIm_UilM.css` 约 63 KB），`#root` 挂载。
- **客户端是 hash 路由**（`#/products`、`#/news`……），不是 history 路由——直接打开 `/#/products` 即可深链，刷新也不丢页面。
- 首页 hero 是一个预加载的 mp4 视频（3.7 MB）。
- Express 后端提供两个只读 GET 接口：`/api/content`、`/api/media`；其余 `/api/content/:key`、`/api/media/...` 都是 PUT/DELETE 的后台编辑接口。
- 无外部第三方资源（字体/CDN/统计脚本均为 0），可完全离线。

## 相对原站做的改动

1. **API 快照静态化**：把 `GET /api/content`、`GET /api/media` 的响应落盘为 `site/api/content`、`site/api/media` 两个无扩展名文件，本地静态服务器直接按路径返回，SPA 的 `fetch()` 无需改动即可拿到相同 JSON（`Content-Type` 为 `application/octet-stream`，但 `response.json()` 不看 content-type，行为一致）。
   - 后台编辑功能（PUT/DELETE 写接口）离线不可用——只读镜像，属预期。
2. **内联资源还原**：JS 映射表里有 4 个 key 的值是 data URI（`en-*`、`hor-*`、`shopping-car-*`、`sm-i-home-*`），已把 data URI 解码落盘为对应文件，保证磁盘文件与运行时内容一致。
3. **`start.py` 加了 SPA fallback**：无扩展名且本地无对应文件的路径（如 `/products`）返回 `index.html`，与原站 Express 行为一致；带扩展名的资源缺失仍然老实 404，不掩盖问题。
4. 其余 350+ 个资源与原站字节一致（哈希文件名原样保留）。

## 踩坑记录

1. **原站 SSL 证书已过期**（`certificate has expired`）：curl 能过、Python urllib 直接抛错。抓取时关闭证书校验（`ssl._create_unverified_context()`）。
2. **Express SPA fallback 会把 404 变成 200 + HTML**：JS 映射表里的"源路径" key（如 `/assets/images/yaheng/xxx.webp`、`/assets/xxx.webp` 不带哈希）在原站请求时返回的是 index.html（928 字节），**不是图片**。第一轮按引用下载会得到 180 个"HTML 冒充的图片"。处理方式：从 JS 里解析出完整的 `key → 变量 → 哈希 URL/data URI` 映射表，按映射把 key 路径的文件内容替换为真实资源。
3. **Vite 哈希是 8 位**（`name-XXXXXXXX.ext`，字母数字加 `_-`，可含 `-`），按 `-hash.ext` 剥离时要用贪婪匹配回溯，否则 `C-GayEf0` 这类带连字符的哈希会剥错。
4. **Windows 下 Python 文本模式写 URL 清单会带 `\r`**，喂给 curl 报 `Malformed input`；`tr -d '\r'` 处理。
5. **`one_click_serve.py` 按脚本自身所在目录找 `site/`**，不是按 CWD——所以启动器必须放在包根目录（本包已复制为 `start.py`）。
6. 本机 `http_proxy` 环境变量会让 curl 访问 127.0.0.1 走代理拿到 502，测试时加 `--noproxy '*'`。

## 验证结论

- 静态审计：JS/CSS/HTML 中全部 352 个本地资源引用 → 本地 0 缺失；JS 资产映射表 174 条 → 全部对齐（含 4 个 data URI、1 个跨文件映射）。
- 运行时实测（Playwright + verify_page.py，`badRequests` 指资源响应码 ≥400）：

| 页面 | h1（判定渲染成功） | 图片数 | 失败请求 | 控制台错误 |
| --- | --- | --- | --- | --- |
| `/`（首页，含 hero 视频） | Precision that keeps cooling in motion. | 22 | 0 | 0 |
| `/#/products` | Yaheng Refrigeration Fittings Products | 117 | 0 | 0 |
| `/#/company` | Chengdu Yaheng Refrigeration Fittings Co., Ltd. | 1 | 0 | 0 |
| `/#/news` | Latest News & Blogs About Yaheng | 6 | 0 | 0 |

- 结论：**badRequests === 0 + 0 控制台错误 + 四个路由各自渲染出正确内容**，复刻通过。截图见 `screenshots/`。
