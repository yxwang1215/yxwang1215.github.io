import json
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
import threading
import unittest

import run


class SharedServiceTests(unittest.TestCase):
    def setUp(self):
        class Handler(BaseHTTPRequestHandler):
            def log_message(self, *args):
                pass

            def do_GET(self):
                body=json.dumps({"server_pid": 123, "poller_alive": True}).encode()
                self.send_response(200)
                self.send_header('Content-Length', str(len(body)))
                self.end_headers()
                self.wfile.write(body)
        self.http=ThreadingHTTPServer(('127.0.0.1', 0), Handler)
        self.thread=threading.Thread(target=self.http.serve_forever, daemon=True)
        self.thread.start()

    def tearDown(self):
        self.http.shutdown()
        self.http.server_close()
        self.thread.join()

    def test_another_users_healthy_server_does_not_confirm_own_start(self):
        self.assertIsNone(run.health(self.http.server_port, expected_pid=456))
        self.assertIsNone(run.health(self.http.server_port, expected_pid=None))
        self.assertEqual(run.health(self.http.server_port, expected_pid=123)['server_pid'], 123)

    def test_in_use_port_is_rejected_before_starting(self):
        with self.assertRaises(OSError):
            run.ensure_port_available(self.http.server_port)


if __name__=='__main__':
    unittest.main()
