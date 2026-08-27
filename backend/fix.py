import traceback
lines = open('app/api/chat.py').read().split('\n')
bad_start = None
for i, l in enumerate(lines):
    if l.strip() == '"lead_id": lead.id,' and i > 0 and lines[i-1].strip() == '"appointment": appointment_data,':
        bad_start = i
        break

if bad_start:
    lines = lines[:bad_start]
    lines.append('            "available_slots": None')
    lines.append('        }')
    lines.append('')
    lines.append('    except Exception as e:')
    lines.append('        if "lead" in locals() and lead:')
    lines.append('            from app.services.conversation_service import conversation_store')
    lines.append('            if lead.id in conversation_store and conversation_store[lead.id]:')
    lines.append('                if conversation_store[lead.id][-1].get("role") == "user":')
    lines.append('                    conversation_store[lead.id].pop()')
    lines.append('        import traceback')
    lines.append('        with open("chat_error.log", "w") as f:')
    lines.append('            f.write(traceback.format_exc())')
    lines.append('        raise HTTPException(status_code=500, detail="Unexpected API error")')

    with open('app/api/chat.py', 'w') as f:
        f.write('\n'.join(lines))
