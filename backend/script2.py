import urllib.request
import json
def send(m):
    req = urllib.request.Request('http://127.0.0.1:8000/api/chat', data=json.dumps({'lead_id': 4, 'message': m}).encode(), headers={'Content-Type': 'application/json'})
    try:
        print(urllib.request.urlopen(req).read().decode('utf-8')[:100])
    except Exception as e:
        print("Error:", e.read().decode())

send('70 Lakh to 1 crore')
send('afternoon')
send('individual')
send('afternon')
