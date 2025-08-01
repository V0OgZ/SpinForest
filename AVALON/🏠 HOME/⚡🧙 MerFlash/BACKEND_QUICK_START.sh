#!/bin/bash
# ⚡ MerFlash : Backend sans Maven

echo "⚡ MERFLASH: Backend alternatif..."

# Option 1: Mock API Python
cat > /tmp/mock_backend.py << 'EOF'
from http.server import HTTPServer, BaseHTTPRequestHandler
import json
from datetime import datetime

class MockAPI(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/api/health':
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            response = {
                "status": "UP",
                "mock": True,
                "timestamp": str(datetime.now())
            }
            self.wfile.write(json.dumps(response).encode())
        else:
            self.send_response(404)
            self.end_headers()

print("⚡ Mock Backend sur http://localhost:8080")
HTTPServer(('localhost', 8080), MockAPI).serve_forever()
EOF

python3 /tmp/mock_backend.py &
echo "✨ Backend mock lancé! PID: $!"