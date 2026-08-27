import json
from sqlalchemy import create_engine, text

engine = create_engine('postgresql://neondb_owner:npg_fmJdvxP6alq7@ep-damp-art-axjmfub2-pooler.c-4.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require')
session = engine.connect()
res = session.execute(text('SELECT lead_id, role, message FROM conversations WHERE lead_id IN (1, 4, 5) ORDER BY id DESC LIMIT 50')).fetchall()
with open('conv.json', 'w', encoding='utf-8') as f:
    json.dump([{'lead_id': r[0], 'role': r[1], 'message': r[2]} for r in res], f)
