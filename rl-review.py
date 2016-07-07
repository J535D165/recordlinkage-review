import os

try:
    from http.server import BaseHTTPRequestHandler, HTTPServer
except ImportError:
    from BaseHTTPServer import BaseHTTPRequestHandler, HTTPServer

import mimetypes

class StoreHandler(BaseHTTPRequestHandler):

    def do_GET(self):

        try:

            # Get filepath
            if self.path in ("", "/"):
                filepath = "index.html"
            else:
                filepath = self.path.lstrip("/")

            with open(filepath) as fh:

                self.send_response(200)

                mimetype, _ = mimetypes.guess_type(filepath)
                self.send_header('Content-type', mimetype)

                self.end_headers()

                self.wfile.write(fh.read().encode())

        except IOError:
            self.send_error(404,'File Not Found: %s ' % filepath)

    def do_POST(self):

        filepath = self.path
        try:
            length = self.headers['content-length']
            data = self.rfile.read(int(length))

            with open(filepath, 'w') as fh:
                fh.write(data.decode())

            self.send_response(200)

        except IOError:
            self.send_error(404,'FileError: %s ' % filepath)


if __name__ == '__main__':

    server = HTTPServer(('localhost', 8081), StoreHandler)

    print 'Starting server, use <Ctrl-C> to stop'
    server.serve_forever()


