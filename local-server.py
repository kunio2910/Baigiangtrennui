from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlparse


ROOT = Path(__file__).resolve().parent
CATEGORY_PATHS = {
    "cac-thanh",
    "nha-tho",
    "bai-viet",
    "su-kien",
    "cau-nguyen",
    "giao-ly",
}


class LocalRouteHandler(SimpleHTTPRequestHandler):
    def translate_path(self, path):
        parsed = urlparse(path)
        clean_path = parsed.path.strip("/")

        if not clean_path:
            return str(ROOT / "index.html")

        first_part = clean_path.split("/", 1)[0]

        if first_part in CATEGORY_PATHS:
            if "/" in clean_path:
                return str(ROOT / "detail.html")
            return str(ROOT / "category.html")

        if clean_path == "gui-loi-cau-nguyen":
            return str(ROOT / "prayer-request.html")

        return super().translate_path(path)


if __name__ == "__main__":
    server = ThreadingHTTPServer(("127.0.0.1", 5500), LocalRouteHandler)
    print("Local server: http://127.0.0.1:5500/")
    server.serve_forever()
