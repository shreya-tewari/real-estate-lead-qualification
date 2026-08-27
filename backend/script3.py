import urllib.request
import urllib.error
import json

def send(m):
    req = urllib.request.Request(
        'http://127.0.0.1:8000/api/chat',
        data=json.dumps({'lead_id': 4, 'message': m}).encode(),
        headers={'Content-Type': 'application/json'}
    )
    try:
        res = urllib.request.urlopen(req)
        print("Success:", res.read().decode('utf-8')[:100])
    except urllib.error.HTTPError as e:
        print(f"HTTPError {e.code}:", e.read().decode())
    except Exception as e:
        print("Other Error:", str(e))

send('70 Lakh to 1 crore')
send('afternoon')
send('individual')
send('afternon')
