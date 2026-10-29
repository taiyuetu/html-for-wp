#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""静态站点一键启动器 —— 打包交付镜像站时，放一份到包根目录当「一键启动」入口。

为什么需要它（不是随便 python -m http.server 就够）：
  1. 找不到空闲端口时自动顺延，不会因为 8899 被占就静默失败；
  2. 自动开浏览器 —— 用户要的就是"双击就能看"；
  3. 只报 4xx/5xx，不刷每条 200（否则 3D 站点几百个资源请求会刷屏）；
  4. 关掉缓存 —— 重跑时不至于被浏览器缓存骗过；
  5. 附带清楚的中文提示「必须走 HTTP，双击 index.html 会因浏览器安全策略挂掉」，
     这是镜像站最高频的误用（file:// 下 fetch 被 CORS 拦死，3D/资源全加载不出来）。

配套的薄壳（同目录一起给，用户双击用）：
  start.sh      #!/usr/bin/env bash
                cd "$(dirname "$0")" || exit 1
                command -v python3 >/dev/null 2>&1 && exec python3 start.py "$@" || exec python start.py "$@"
  start.command # 同 start.sh，macOS 双击用；两个都要 chmod 755
  start.bat     @echo off
                chcp 65001 >nul
                cd /d "%~dp0"
                where python >nul 2>nul && (python start.py %*) || (py start.py %*)

用法：
  python3 one_click_serve.py [端口] [站点目录名，默认 site]
"""
import http.server
import os
import socket
import socketserver
import sys
import threading
import webbrowser

HERE = os.path.dirname(os.path.abspath(__file__))
SITE = os.path.join(HERE, sys.argv[2] if len(sys.argv) > 2 else "site")
DEFAULT_PORT = 8899


class QuietHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *a, **kw):
        super().__init__(*a, directory=SITE, **kw)

    def send_head(self):
        # SPA fallback：原站 Express 对未知路径返回 index.html（客户端路由
        # 深链接如 /products、/news 直接打开或刷新时需要）。
        # 只对"无扩展名"的路径兜底；真正的资源缺失仍然 404，不掩盖问题。
        req = self.path.split("?", 1)[0].split("#", 1)[0]
        last = req.rsplit("/", 1)[-1]
        local = self.translate_path(req)
        if "." not in last and not os.path.isfile(local):
            self.path = "/index.html"
        return super().send_head()

    def log_message(self, fmt, *args):
        code = args[1] if len(args) > 1 else ""
        if str(code).startswith(("4", "5")):
            sys.stderr.write("  [%s] %s\n" % (code, args[0]))

    def end_headers(self):
        # 让 .lsd / .bin / .gltf / .ktx2 这类自定义扩展名也当二进制流下发
        self.send_header("Cache-Control", "no-store")
        super().end_headers()


class Server(socketserver.ThreadingTCPServer):
    allow_reuse_address = True
    daemon_threads = True


def free_port(start=DEFAULT_PORT, tries=40):
    for p in range(start, start + tries):
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
            try:
                s.bind(("127.0.0.1", p))
                return p
            except OSError:
                continue
    raise SystemExit("找不到空闲端口（%d-%d 都占用了）" % (start, start + tries))


def main():
    if not os.path.isdir(SITE):
        raise SystemExit("找不到 %s/ 目录，请确认压缩包完整解压。" % os.path.basename(SITE))
    port = int(sys.argv[1]) if len(sys.argv) > 1 else free_port()
    url = "http://127.0.0.1:%d/" % port
    httpd = Server(("127.0.0.1", port), QuietHandler)
    print("\n  静态站已启动\n  ----------------------------------------")
    print("  地址：  " + url)
    print("  目录：  " + SITE)
    print("  停止：  Ctrl + C")
    print("  提示：  必须用这个 HTTP 地址访问；直接双击 index.html 会因浏览器")
    print("          安全策略导致 3D / 资源加载失败。\n")
    threading.Timer(0.6, lambda: webbrowser.open(url)).start()
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n  已停止。")
    finally:
        httpd.server_close()


if __name__ == "__main__":
    main()
