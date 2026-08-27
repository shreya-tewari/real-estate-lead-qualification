from typing import Any


# ==================================================
# Conversation History
# ==================================================

conversation_store: dict[int, list[dict[str, str]]] = {}


# ==================================================
# Pending Appointment Selection
# ==================================================

pending_appointments: dict[int, dict[str, Any]] = {}


# ==================================================
# Get Conversation History
# ==================================================

def get_conversation_history(
    lead_id: int
) -> list[dict[str, str]]:

    return conversation_store.get(
        lead_id,
        []
    )


# ==================================================
# Add Conversation Message
# ==================================================

def add_message(
    lead_id: int,
    role: str,
    content: str
) -> None:

    if lead_id not in conversation_store:
        conversation_store[lead_id] = []

    conversation_store[lead_id].append(
        {
            "role": role,
            "content": content
        }
    )


# ==================================================
# Clear Conversation
# ==================================================

def clear_conversation(
    lead_id: int
) -> None:

    conversation_store.pop(
        lead_id,
        None
    )


# ==================================================
# Save Pending Appointment
# ==================================================

def save_pending_appointment(
    lead_id: int,
    appointment_date: str | None = None,
    appointment_time: str | None = None,
    available_slots: list[dict] | None = None
) -> None:

    pending_appointments[lead_id] = {
        "date": appointment_date,
        "time": appointment_time,
        "available_slots": available_slots or []
    }


# ==================================================
# Get Pending Appointment
# ==================================================

def get_pending_appointment(
    lead_id: int
) -> dict[str, Any] | None:

    return pending_appointments.get(
        lead_id
    )


# ==================================================
# Clear Pending Appointment
# ==================================================

def clear_pending_appointment(
    lead_id: int
) -> None:

    pending_appointments.pop(
        lead_id,
        None
    )