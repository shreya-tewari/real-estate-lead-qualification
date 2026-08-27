import re
from typing import Any

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.lead import Lead

from app.services.ai_service import chat_with_ai
from app.services.scoring import score_lead
from app.services.property_services import search_properties
import traceback

from app.services.appointment_service import (
    get_available_slots,
    filter_slots,
    create_appointment
)

from app.services.conversation_service import (
    get_conversation_history,
    add_message,
    save_pending_appointment,
    get_pending_appointment,
    clear_pending_appointment
)


router = APIRouter(
    prefix="/api/chat",
    tags=["Chat"]
)


# ==================================================
# REQUEST SCHEMA
# ==================================================

class ChatRequest(BaseModel):
    lead_id: int
    message: str


# ==================================================
# RESPONSE SCHEMA
# ==================================================

class ChatResponse(BaseModel):
    lead_id: int
    reply: str
    intent: str

    qualification: dict[str, Any] | None = None

    qualification_score: int | None = None

    qualification_status: str | None = None

    appointment: dict[str, Any] | None = None

    available_slots: list[dict] | None = None


# ==================================================
# TIME NORMALIZATION
# ==================================================

def normalize_time(
    time_value: str
) -> str:

    value = time_value.strip().upper()

    value = value.replace(".", ":")

    match = re.match(
        r"^(\d{1,2})(?::(\d{1,2}))?\s*(AM|PM)$",
        value
    )

    if not match:
        return value

    hour = int(match.group(1))

    minute = int(
        match.group(2) or 0
    )

    period = match.group(3)

    return f"{hour:02d}:{minute:02d} {period}"


# ==================================================
# EXTRACT TIME FROM MESSAGE
# ==================================================

def extract_time_from_message(
    message: str
) -> str | None:

    patterns = [
        r"\b\d{1,2}:\d{2}\s*(?:AM|PM)\b",
        r"\b\d{1,2}\s*(?:AM|PM)\b"
    ]

    message_upper = message.upper()

    for pattern in patterns:

        match = re.search(
            pattern,
            message_upper
        )

        if match:

            return normalize_time(
                match.group(0)
            )

    return None


# ==================================================
# EXTRACT SLOT NUMBER
# ==================================================

def extract_slot_number(
    message: str
) -> int | None:

    message_lower = (
        message
        .lower()
        .strip()
    )

    ordinal_map = {
        "first": 1,
        "1st": 1,

        "second": 2,
        "2nd": 2,

        "third": 3,
        "3rd": 3,

        "fourth": 4,
        "4th": 4,

        "fifth": 5,
        "5th": 5,

        "sixth": 6,
        "6th": 6,

        "seventh": 7,
        "7th": 7,

        "eighth": 8,
        "8th": 8,

        "ninth": 9,
        "9th": 9,

        "tenth": 10,
        "10th": 10
    }

    for word, number in ordinal_map.items():

        if re.search(
            rf"\b{re.escape(word)}\b",
            message_lower
        ):

            return number

    match = re.search(
        r"\b(?:slot|option|number)\s*(\d+)\b",
        message_lower
    )

    if match:

        return int(
            match.group(1)
        )

    return None


# ==================================================
# FIND SELECTED SLOT
# ==================================================

def find_selected_slot(
    message: str,
    pending_slots: list[dict]
) -> dict | None:

    if not pending_slots:
        return None

    # --------------------------------------------------
    # 1. Slot number
    # --------------------------------------------------

    slot_number = extract_slot_number(
        message
    )

    if slot_number:

        index = slot_number - 1

        if 0 <= index < len(pending_slots):

            return pending_slots[index]

    # --------------------------------------------------
    # 2. Specific time
    # --------------------------------------------------

    requested_time = extract_time_from_message(
        message
    )

    if requested_time:

        matching_slots = []

        for slot in pending_slots:

            slot_time = normalize_time(
                slot["time"]
            )

            if slot_time == requested_time:

                matching_slots.append(
                    slot
                )

        if len(matching_slots) == 1:

            return matching_slots[0]

    return None


# ==================================================
# APPOINTMENT RESPONSE
# ==================================================

def appointment_response(
    lead: Lead,
    appointment,
    qualification: dict,
    score: int,
    status: str
):

    return {
        "lead_id": lead.id,

        "reply": (
            "Your appointment has been confirmed "
            f"for {appointment.appointment_date} "
            f"at {appointment.appointment_time}."
        ),

        "intent": "appointment_confirmed",

        "qualification": qualification,

        "qualification_score": score,

        "qualification_status": status,

        "appointment": {
            "id": appointment.id,
            "lead_id": appointment.lead_id,
            "date": appointment.appointment_date,
            "time": appointment.appointment_time,
            "status": appointment.status
        },

        "available_slots": []
    }


# ==================================================
# CHAT ENDPOINT
# ==================================================

@router.post(
    "",
    response_model=ChatResponse
)
def process_chat(
    request: ChatRequest,
    db: Session = Depends(get_db)
):
    try:
        # ==================================================
        # 1. FIND LEAD
        # ==================================================

        lead = (
            db.query(Lead)
            .filter(
                Lead.id == request.lead_id
            )
            .first()
        )

        if not lead:

            raise HTTPException(
                status_code=404,
                detail="Lead not found"
            )

        message = request.message.strip()

        message_lower = message.lower()

        # ==================================================
        # 2. SAVE USER MESSAGE
        # ==================================================

        add_message(
            lead_id=lead.id,
            role="user",
            content=message
        )

        # ==================================================
        # 3. GET PENDING APPOINTMENT
        # ==================================================

        pending_appointment = (
            get_pending_appointment(
                lead.id
            )
        )

        pending_slots = []

        if pending_appointment:

            pending_slots = (
                pending_appointment.get(
                    "available_slots",
                    []
                )
            )

        # ==================================================
        # 4. DETECT "SHOW AVAILABLE SLOTS"
        # ==================================================

        show_slots_phrases = [
            "yes please show",
            "yes show",
            "show me",
            "show available slots",
            "show me available slots",
            "show other slots",
            "show other available slots",
            "other slots",
            "other available slots",
            "show me other slots",
            "show me other available slots"
        ]

        is_show_slots_request = any(
            phrase in message_lower
            for phrase in show_slots_phrases
        )

        # ==================================================
        # 5. SHOW ALL AVAILABLE SLOTS
        # ==================================================

        if is_show_slots_request:

            slots = get_available_slots(
                db
            )

            if not slots:

                reply = (
                    "Sorry, there are currently "
                    "no available appointment slots."
                )

                add_message(
                    lead_id=lead.id,
                    role="assistant",
                    content=reply
                )

                return {
                    "lead_id": lead.id,
                    "reply": reply,
                    "intent": "book_appointment",
                    "qualification": {},
                    "qualification_score": (
                        lead.qualification_score
                    ),
                    "qualification_status": (
                        lead.qualification_status
                    ),
                    "appointment": {
                        "requested": True,
                        "date": None,
                        "time": None,
                        "time_preference": None
                    },
                    "available_slots": []
                }

            # --------------------------------------------------
            # Save ALL slots for later selection
            # --------------------------------------------------

            save_pending_appointment(
                lead_id=lead.id,
                appointment_date=None,
                appointment_time=None,
                available_slots=slots
            )

            reply = (
                "Sure! Here are the available "
                "appointment slots. Please choose one."
            )

            add_message(
                lead_id=lead.id,
                role="assistant",
                content=reply
            )

            return {
                "lead_id": lead.id,
                "reply": reply,
                "intent": "book_appointment",
                "qualification": {},
                "qualification_score": (
                    lead.qualification_score
                ),
                "qualification_status": (
                    lead.qualification_status
                ),
                "appointment": {
                    "requested": True,
                    "date": None,
                    "time": None,
                    "time_preference": None
                },
                "available_slots": slots
            }

        # ==================================================
        # 6. CHECK IF USER SELECTED A SLOT
        # ==================================================

        selected_slot = find_selected_slot(
            message=message,
            pending_slots=pending_slots
        )

        if selected_slot:

            try:

                # --------------------------------------------------
                # Final availability check
                # --------------------------------------------------

                current_slots = get_available_slots(
                    db
                )

                still_available = any(
                    slot["date"]
                    == selected_slot["date"]

                    and normalize_time(
                        slot["time"]
                    )
                    ==
                    normalize_time(
                        selected_slot["time"]
                    )

                    for slot in current_slots
                )

                if not still_available:

                    clear_pending_appointment(
                        lead.id
                    )

                    reply = (
                        "Sorry, that slot is no longer "
                        "available. Please choose another "
                        "available slot."
                    )

                    add_message(
                        lead_id=lead.id,
                        role="assistant",
                        content=reply
                    )

                    return {
                        "lead_id": lead.id,
                        "reply": reply,
                        "intent": "book_appointment",
                        "qualification": {},
                        "qualification_score": (
                            lead.qualification_score
                        ),
                        "qualification_status": (
                            lead.qualification_status
                        ),
                        "appointment": None,
                        "available_slots": current_slots
                    }

                # --------------------------------------------------
                # Create appointment
                # --------------------------------------------------

                appointment = create_appointment(
                    db=db,
                    lead_id=lead.id,
                    appointment_date=(
                        selected_slot["date"]
                    ),
                    appointment_time=(
                        selected_slot["time"]
                    )
                )

                # --------------------------------------------------
                # Clear pending slots
                # --------------------------------------------------

                clear_pending_appointment(
                    lead.id
                )

                # --------------------------------------------------
                # Confirmation
                # --------------------------------------------------

                reply = (
                    "Your appointment has been "
                    "confirmed for "
                    f"{appointment.appointment_date} "
                    "at "
                    f"{appointment.appointment_time}."
                )

                add_message(
                    lead_id=lead.id,
                    role="assistant",
                    content=reply
                )

                return appointment_response(
                    lead=lead,
                    appointment=appointment,
                    qualification={},
                    score=(
                        lead.qualification_score
                        or 0
                    ),
                    status=(
                        lead.qualification_status
                        or "Not Qualified"
                    )
                )

            except Exception as e:

                db.rollback()

                raise HTTPException(
                    status_code=409,
                    detail=str(e)
                )

        # ==================================================
        # 7. CONFIRM SINGLE PENDING SLOT
        # ==================================================

        if pending_appointment:

            pending_date = (
                pending_appointment.get(
                    "date"
                )
            )

            pending_time = (
                pending_appointment.get(
                    "time"
                )
            )

            confirmation_phrases = [
                "yes",
                "yeah",
                "yep",
                "sure",
                "okay",
                "ok",
                "book it",
                "confirm",
                "confirm it",
                "go ahead",
                "yes please",
                "yes book it"
            ]

            is_confirmation = any(
                message_lower == phrase
                for phrase in confirmation_phrases
            )

            if (
                is_confirmation
                and pending_date
                and pending_time
            ):

                try:

                    current_slots = get_available_slots(
                        db
                    )

                    still_available = any(
                        slot["date"]
                        == pending_date

                        and normalize_time(
                            slot["time"]
                        )
                        ==
                        normalize_time(
                            pending_time
                        )

                        for slot in current_slots
                    )

                    if not still_available:

                        clear_pending_appointment(
                            lead.id
                        )

                        reply = (
                            "Sorry, that slot is no longer "
                            "available. Please choose another "
                            "available slot."
                        )

                        add_message(
                            lead_id=lead.id,
                            role="assistant",
                            content=reply
                        )

                        return {
                            "lead_id": lead.id,
                            "reply": reply,
                            "intent": "book_appointment",
                            "qualification": {},
                            "qualification_score": (
                                lead.qualification_score
                            ),
                            "qualification_status": (
                                lead.qualification_status
                            ),
                            "appointment": None,
                            "available_slots": current_slots
                        }

                    appointment = create_appointment(
                        db=db,
                        lead_id=lead.id,
                        appointment_date=pending_date,
                        appointment_time=pending_time
                    )

                    clear_pending_appointment(
                        lead.id
                    )

                    return appointment_response(
                        lead=lead,
                        appointment=appointment,
                        qualification={},
                        score=(
                            lead.qualification_score
                            or 0
                        ),
                        status=(
                            lead.qualification_status
                            or "Not Qualified"
                        )
                    )

                except Exception as e:

                    db.rollback()

                    raise HTTPException(
                        status_code=409,
                        detail=str(e)
                    )

        # ==================================================
        # 8. LOAD CONVERSATION HISTORY
        # ==================================================

        conversation_history = (
            get_conversation_history(
                lead.id
            )
        )

        # ==================================================
        # 9. PREPARE LEAD DATA
        # ==================================================

        lead_data = {

            "id": lead.id,

            "name": lead.name,

            "email": lead.email,

            "phone": lead.phone,

            "source": lead.source,

            "property_interest": (
                lead.property_interest
            ),

            "buyer_type": lead.buyer_type,

            "purchase_purpose": (
                lead.purchase_purpose
            ),

            "location": lead.location,

            "property_type": (
                lead.property_type
            ),

            "budget": lead.budget,

            "financing": lead.financing,

            "purchase_timeline": (
                lead.purchase_timeline
            ),

            "previous_property_purchase": (
                lead.previous_property_purchase
            ),

            "preferred_contact_time": (
                lead.preferred_contact_time
            ),

            "appointment_interest": (
                lead.appointment_interest
            )
        }

        # ==================================================
        # 10. SEARCH PROPERTIES
        # ==================================================

        try:

            property_results = search_properties(
                location=lead.location,
                property_type=lead.property_type,
                max_budget=lead.budget
            )

        except Exception as e:

            raise HTTPException(
                status_code=500,
                detail=(
                    f"Property search error: {str(e)}"
                )
            )

        # ==================================================
        # 11. CALL AI
        # ==================================================

        try:

            ai_result = chat_with_ai(
                conversation_history=conversation_history,
                lead_data=lead_data,
                property_context=property_results
            )

        except Exception as e:

            raise HTTPException(
                status_code=500,
                detail=f"AI service error: {str(e)}"
            )

        # ==================================================
        # 12. READ AI RESULT
        # ==================================================

        ai_reply = ai_result.get("reply")
        if not ai_reply:
            ai_reply = "How can I help you?"

        qualification = ai_result.get(
            "qualification",
            {}
        )

        appointment_data = ai_result.get(
            "appointment",
            {}
        )

        # ==================================================
        # 13. UPDATE LEAD QUALIFICATION
        # ==================================================

        qualification_fields = [

            "buyer_type",

            "purchase_purpose",

            "location",

            "property_type",

            "budget",

            "financing",

            "purchase_timeline",

            "previous_property_purchase",

            "preferred_contact_time",

            "appointment_interest"
        ]

        for field in qualification_fields:

            value = qualification.get(field)
            if value in ["None", "none", "null", "Null"]:
                value = None

            if field in ["previous_property_purchase", "appointment_interest"] and value is not None:
                if isinstance(value, str):
                    if value.lower() in ["true", "yes", "1", "y"]:
                        value = True
                    elif value.lower() in ["false", "no", "0", "n"]:
                        value = False
                    else:
                        value = None

            if value is not None:

                setattr(
                    lead,
                    field,
                    value
                )

        # ==================================================
        # 14. CALCULATE SCORE
        # ==================================================

        try:

            score, status = score_lead(
                lead
            )

        except Exception as e:

            raise HTTPException(
                status_code=500,
                detail=(
                    f"Lead scoring error: {str(e)}"
                )
            )

        lead.qualification_score = score

        lead.qualification_status = status

        # ==================================================
        # 15. SAVE AI MESSAGE
        # ==================================================

        add_message(
            lead_id=lead.id,
            role="assistant",
            content=ai_reply
        )

        # ==================================================
        # 16. COMMIT LEAD
        # ==================================================

        try:

            db.commit()

            db.refresh(lead)

        except Exception as e:
            if 'lead' in locals() and lead:

                history = get_conversation_history(lead.id)
                if history and history[-1].get("role") == "user":
                    history.pop()

            db.rollback()

            raise HTTPException(
                status_code=500,
                detail=(
                    f"Database error: {str(e)}"
                )
            )

        # ==================================================
        # 17. CHECK APPOINTMENT REQUEST
        # ==================================================

        appointment_requested = (
            appointment_data.get(
                "requested",
                False
            )
        )

        # ==================================================
        # 18. APPOINTMENT REQUEST
        # ==================================================

        if appointment_requested:

            # --------------------------------------------------
            # Get available slots
            # --------------------------------------------------

            slots = get_available_slots(
                db
            )

            # --------------------------------------------------
            # Filter according to AI extraction
            # --------------------------------------------------

            available_slots = filter_slots(
                available_slots=slots,

                appointment_date=(
                    appointment_data.get(
                        "date"
                    )
                ),

                time_preference=(
                    appointment_data.get(
                        "time_preference"
                    )
                ),

                specific_time=(
                    appointment_data.get(
                        "time"
                    )
                )
            )

            # ==================================================
            # 19. NO MATCHING SLOT
            # ==================================================

            if not available_slots:

                # IMPORTANT:
                # Do NOT save the old filtered appointment
                # as pending.
                #
                # The user may respond:
                # "yes please show"
                #
                # In that case we need to show ALL slots.

                clear_pending_appointment(
                    lead.id
                )

                reply = (
                    "I couldn't find an available "
                    "slot matching your requested "
                    "date and time. Would you like "
                    "me to show you other available "
                    "slots?"
                )

                return {
                    "lead_id": lead.id,

                    "reply": reply,

                    "intent": "book_appointment",

                    "qualification": qualification,

                    "qualification_score": score,

                    "qualification_status": status,

                    "appointment": appointment_data,

                    "available_slots": []
                }

            # ==================================================
            # 20. EXACT TIME REQUESTED
            # ==================================================

            requested_time = (
                appointment_data.get(
                    "time"
                )
            )

            if requested_time:

                slot = available_slots[0]

                try:

                    appointment = create_appointment(
                        db=db,

                        lead_id=lead.id,

                        appointment_date=(
                            slot["date"]
                        ),

                        appointment_time=(
                            slot["time"]
                        )
                    )

                except Exception as e:

                    db.rollback()

                    raise HTTPException(
                        status_code=409,
                        detail=str(e)
                    )

                return appointment_response(
                    lead=lead,

                    appointment=appointment,

                    qualification=qualification,

                    score=score,

                    status=status
                )

            # ==================================================
            # 21. ONE MATCHING SLOT
            # ==================================================

            if len(available_slots) == 1:

                slot = available_slots[0]

                # Save one pending slot

                save_pending_appointment(
                    lead_id=lead.id,

                    appointment_date=(
                        slot["date"]
                    ),

                    appointment_time=(
                        slot["time"]
                    ),

                    available_slots=(
                        available_slots
                    )
                )

                reply = (
                    f"I have {slot['time']} "
                    f"available on {slot['date']}. "
                    "Would you like me to book it?"
                )

                add_message(
                    lead_id=lead.id,
                    role="assistant",
                    content=reply
                )

                return {
                    "lead_id": lead.id,

                    "reply": reply,

                    "intent": "book_appointment",

                    "qualification": qualification,

                    "qualification_score": score,

                    "qualification_status": status,

                    "appointment": {
                        **appointment_data,
                        "pending": True
                    },

                    "available_slots": available_slots
                }

            # ==================================================
            # 22. MULTIPLE MATCHING SLOTS
            # ==================================================

            save_pending_appointment(
                lead_id=lead.id,

                appointment_date=None,

                appointment_time=None,

                available_slots=available_slots
            )

            reply = (
                "Sure! Here are the available "
                "appointment slots. Please choose one."
            )

            add_message(
                lead_id=lead.id,
                role="assistant",
                content=reply
            )

            return {
                "lead_id": lead.id,

                "reply": reply,

                "intent": "book_appointment",

                "qualification": qualification,

                "qualification_score": score,

                "qualification_status": status,

                "appointment": appointment_data,

                "available_slots": available_slots
            }

        # ==================================================
        # 23. GENERAL CONVERSATION
        # ==================================================

        return {
            "lead_id": lead.id,
            "reply": ai_reply,
            "intent": "general",
            "qualification": qualification,
            "qualification_score": score,
            "qualification_status": status,
            "appointment": appointment_data,
            "available_slots": None
        }
    except HTTPException:
        raise
    except Exception as e:
        import traceback
        tb = traceback.format_exc()
        try:
            import os
            log_path = os.path.join(os.path.dirname(__file__), "..", "..", "chat_error.log")
            with open(log_path, "w") as f:
                f.write(tb)
        except Exception:
            pass
        raise HTTPException(status_code=500, detail=str(e) or "Unexpected API error")