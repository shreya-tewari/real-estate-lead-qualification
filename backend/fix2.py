import os

lines = open('app/api/chat.py').read().split('\n')
idx = -1
for i in range(len(lines)-1, -1, -1):
    if lines[i].strip() == 'return {':
        idx = i
        break

if idx != -1:
    new_lines = lines[:idx]
    new_lines.extend([
        '        return {',
        '            "lead_id": lead.id,',
        '            "reply": ai_reply,',
        '            "intent": "general",',
        '            "qualification": qualification,',
        '            "qualification_score": score,',
        '            "qualification_status": status,',
        '            "appointment": appointment_data,',
        '            "available_slots": None',
        '        }',
        '    except Exception as e:',
        '        if "lead" in locals() and lead:',
        '            from app.services.conversation_service import get_conversation_history',
        '            history = get_conversation_history(lead.id)',
        '            if history and history[-1].get("role") == "user":',
        '                history.pop()',
        '        import traceback',
        '        with open("chat_error.log", "w") as f:',
        '            f.write(traceback.format_exc())',
        '        raise HTTPException(status_code=500, detail="Unexpected API error")'
    ])
    open('app/api/chat.py', 'w').write('\n'.join(new_lines))
    print("Fixed chat.py")
else:
    print("Could not find 'return {'")
