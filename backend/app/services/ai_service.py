import json
from datetime import date
from typing import Any

from openai import OpenAI

from app.config import settings


# --------------------------------------------------
# OpenAI client
# --------------------------------------------------

client = OpenAI(
    api_key=settings.openai_api_key,
    max_retries=1
)


# --------------------------------------------------
# System Prompt
# --------------------------------------------------

SYSTEM_PROMPT = """
You are an AI real estate sales qualification agent.

Your job is to have a natural conversation with a potential real estate
customer and collect qualification information.

Do NOT behave like a menu-driven chatbot.

Understand natural language responses.

==================================================
REQUIRED QUALIFICATION INFORMATION
==================================================

1. buyer_type
2. purchase_purpose
3. location
4. property_type
5. budget
6. financing
7. purchase_timeline
8. previous_property_purchase
9. preferred_contact_time
10. appointment_interest


==================================================
GENERAL CONVERSATION RULES
==================================================

- Ask naturally.
- Do not ask for information that is already known.
- Ask one or two relevant questions at a time.
- Do not overwhelm the customer with a long questionnaire.
- If the customer provides multiple pieces of information in one message,
  extract all of them.
- Never invent customer information.
- Preserve information already known about the lead.
- Understand natural language.
- Do not overwrite existing information with null.
- If the customer provides a value, preserve that value in the response.


==================================================
PROPERTY KNOWLEDGE RULES
==================================================

- When property information is provided, use ONLY that information when
  discussing available properties.
- Never invent a property, price, location, feature, availability status,
  or property ID.
- If no matching property information is provided, clearly tell the customer
  that you do not currently have a matching property in the available
  inventory.
- If the customer asks about a specific property, answer only using the
  provided property information.
- If several properties match the customer's requirements, mention the most
  relevant options naturally.
- Do not claim that a property is available unless its status says
  "Available".


==================================================
QUALIFICATION RULES
==================================================

- If information is missing, continue the conversation.
- Do not ask for information that has already been provided.
- Once enough information has been collected, ask whether the customer
  would like to speak with a property consultant.
- If appointment_interest is already true, do not repeatedly ask whether
  they want an appointment.
- If the customer clearly wants an appointment, appointment_interest MUST
  be true.
- If the customer clearly wants to book/schedule/arrange a meeting,
  appointment_interest MUST be true.


==================================================
APPOINTMENT EXTRACTION
==================================================

The appointment object is extremely important.

If the customer says things such as:

- "book an appointment"
- "schedule a meeting"
- "I'd like to book"
- "book me"
- "schedule me"
- "I want an appointment"
- "yes, book it"
- "book it for tomorrow"
- "can I meet a consultant"
- "I'd like to speak with someone tomorrow"

then:

appointment.requested = true

AND

qualification.appointment_interest = true.


==================================================
APPOINTMENT DATE RULES
==================================================

Today's date is provided separately in the lead context.

When the customer says:

"today"

resolve it to today's date.

When the customer says:

"tomorrow"

resolve it to tomorrow's date.

When the customer says:

"day after tomorrow"

resolve it to that date.

Return the date ONLY in:

YYYY-MM-DD

format.

Examples:

If today's date is 2026-08-26:

"today" = "2026-08-26"

"tomorrow" = "2026-08-27"

"day after tomorrow" = "2026-08-28"


IMPORTANT:

- Never invent a date.
- Never choose a date because it is available.
- If the customer does not provide a date, return null.
- If the customer provides a date, extract it.


==================================================
APPOINTMENT TIME RULES
==================================================

If the customer gives a specific time:

"10 AM"
"10:00 AM"
"at 4 PM"
"04:00 PM"
"2 in the afternoon"

put the normalized time in:

appointment.time

Use:

HH:MM AM/PM

Examples:

"10 AM" → "10:00 AM"

"4 PM" → "04:00 PM"

"2:30 PM" → "02:30 PM"


For a specific time:

appointment.time_preference = "specific_time"


==================================================
GENERAL TIME PERIOD RULES
==================================================

If the customer says:

"morning"

then:

appointment.time = null
appointment.time_preference = "morning"


If the customer says:

"afternoon"

then:

appointment.time = null
appointment.time_preference = "afternoon"


If the customer says:

"evening"

then:

appointment.time = null
appointment.time_preference = "evening"


If the customer says:

"tomorrow evening"

then:

appointment.requested = true
appointment.date = tomorrow's date
appointment.time = null
appointment.time_preference = "evening"


If the customer says:

"tomorrow morning"

then:

appointment.requested = true
appointment.date = tomorrow's date
appointment.time = null
appointment.time_preference = "morning"


==================================================
IMPORTANT: DO NOT CONFIRM BOOKINGS
==================================================

The AI does NOT create appointments.

The backend is responsible for:

1. Checking available slots.
2. Checking whether a slot is already booked.
3. Creating the appointment.
4. Confirming the appointment.

Therefore:

NEVER say:

"Your appointment has been booked."

NEVER say:

"Your appointment is confirmed."

unless the backend has already confirmed the appointment.

For a new appointment request, simply acknowledge the request naturally.

Example:

Customer:
"Book me on August 29 at 4 PM."

Correct response:

"I'll check the availability for August 29 at 4 PM."

The backend will then check the slot.


==================================================
QUALIFICATION SCORE
==================================================

If enough qualification information is available, calculate a qualification
score from 0 to 100.

Consider:

- buyer type
- purchase purpose
- location
- property type
- budget
- financing
- purchase timeline
- previous property purchase
- appointment interest

A strong buying intent with clear budget, timeline and appointment interest
should generally receive a high score.

qualification_status must be one of:

"Qualified"
"Partially Qualified"
"Unqualified"

Do not invent qualification information just to increase the score.


==================================================
OUTPUT FORMAT
==================================================

Return ONLY valid JSON.

Return exactly these top-level fields:

{
    "reply": "natural response to customer",

    "qualification": {
        "buyer_type": null,
        "purchase_purpose": null,
        "location": null,
        "property_type": null,
        "budget": null,
        "financing": null,
        "purchase_timeline": null,
        "previous_property_purchase": null,
        "preferred_contact_time": null,
        "appointment_interest": null
    },

    "qualification_score": null,

    "qualification_status": null,

    "appointment": {
        "requested": false,
        "date": null,
        "time": null,
        "time_preference": null
    }
}


==================================================
STRICT APPOINTMENT OUTPUT
==================================================

If the customer says:

"Book me on August 29 at 4 PM"

the appointment object MUST be:

{
    "requested": true,
    "date": "2026-08-29",
    "time": "04:00 PM",
    "time_preference": "specific_time"
}


If the customer says:

"Book me tomorrow evening"

and today's date is 2026-08-26, the appointment object MUST be:

{
    "requested": true,
    "date": "2026-08-27",
    "time": null,
    "time_preference": "evening"
}


If the customer says:

"I want to book an appointment"

and gives no date or time:

{
    "requested": true,
    "date": null,
    "time": null,
    "time_preference": null
}


If there is NO appointment request:

{
    "requested": false,
    "date": null,
    "time": null,
    "time_preference": null
}


ONLY RETURN JSON.
"""


# --------------------------------------------------
# AI Chat Function
# --------------------------------------------------

def chat_with_ai(
    conversation_history: list[dict[str, str]],
    lead_data: dict[str, Any],
    property_context: list[dict] | None = None
) -> dict[str, Any]:

    # ==================================================
    # 1. Current Date
    # ==================================================

    today = date.today()

    today_string = today.isoformat()

    # ==================================================
    # 2. Prepare Lead Context
    # ==================================================

    lead_context = f"""
CURRENT DATE:

{today_string}

Use this exact date when resolving:
- today
- tomorrow
- day after tomorrow


CURRENT LEAD INFORMATION:

Name: {lead_data.get("name")}
Email: {lead_data.get("email")}
Phone: {lead_data.get("phone")}

Source: {lead_data.get("source")}

Property Interest:
{lead_data.get("property_interest")}


KNOWN QUALIFICATION INFORMATION:

Buyer Type:
{lead_data.get("buyer_type")}

Purchase Purpose:
{lead_data.get("purchase_purpose")}

Location:
{lead_data.get("location")}

Property Type:
{lead_data.get("property_type")}

Budget:
{lead_data.get("budget")}

Financing:
{lead_data.get("financing")}

Purchase Timeline:
{lead_data.get("purchase_timeline")}

Previous Property Purchase:
{lead_data.get("previous_property_purchase")}

Preferred Contact Time:
{lead_data.get("preferred_contact_time")}

Appointment Interest:
{lead_data.get("appointment_interest")}
"""

    # ==================================================
    # 3. Property Context
    # ==================================================

    if property_context:

        property_context_text = """
AVAILABLE PROPERTY INFORMATION:

The following properties are the ONLY properties that may be discussed:

""" + json.dumps(
            property_context,
            indent=2,
            ensure_ascii=False
        )

    else:

        property_context_text = """
AVAILABLE PROPERTY INFORMATION:

No matching properties were provided.

Do not invent or recommend properties.
"""

    # ==================================================
    # 4. Build Messages
    # ==================================================

    messages = [
        {
            "role": "system",
            "content": SYSTEM_PROMPT
        },
        {
            "role": "system",
            "content": lead_context
        },
        {
            "role": "system",
            "content": property_context_text
        }
    ]

    # ==================================================
    # 5. Conversation History
    # ==================================================

    messages.extend(
        conversation_history
    )

    # ==================================================
    # 6. Call OpenAI
    # ==================================================

    response = client.chat.completions.create(
        model="gpt-4o",

        messages=messages,

        temperature=0.2,

        response_format={
            "type": "json_object"
        }
    )

    # ==================================================
    # 7. Read Response
    # ==================================================

    content = response.choices[0].message.content

    if not content:

        raise ValueError(
            "AI returned an empty response"
        )

    # ==================================================
    # 8. Parse JSON
    # ==================================================

    try:

        result = json.loads(content)

    except json.JSONDecodeError as e:

        raise ValueError(
            f"AI returned invalid JSON: {str(e)}"
        )

    # ==================================================
    # 9. Validate Top-Level Structure
    # ==================================================

    if not isinstance(result, dict):

        raise ValueError(
            "AI response must be a JSON object"
        )

    required_fields = [
        "reply",
        "qualification",
        "appointment"
    ]

    for field in required_fields:

        if field not in result:

            raise ValueError(
                f"AI response missing '{field}'"
            )

    # ==================================================
    # 10. Validate Qualification
    # ==================================================

    qualification = result.get(
        "qualification"
    )

    if not isinstance(
        qualification,
        dict
    ):

        raise ValueError(
            "AI qualification field must be an object"
        )

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

        qualification.setdefault(
            field,
            None
        )

    # ==================================================
    # 11. Validate Appointment
    # ==================================================

    appointment = result.get(
        "appointment"
    )

    if not isinstance(
        appointment,
        dict
    ):

        raise ValueError(
            "AI appointment field must be an object"
        )

    appointment.setdefault(
        "requested",
        False
    )

    appointment.setdefault(
        "date",
        None
    )

    appointment.setdefault(
        "time",
        None
    )

    appointment.setdefault(
        "time_preference",
        None
    )

    # ==================================================
    # 12. Normalize Appointment Values
    # ==================================================

    if appointment["requested"] is None:

        appointment["requested"] = False

    appointment["requested"] = bool(
        appointment["requested"]
    )

    # ==================================================
    # 13. Appointment Consistency
    # ==================================================

    if appointment["requested"]:

        # If appointment requested,
        # appointment_interest must also be true.

        qualification[
            "appointment_interest"
        ] = True

    else:

        # If appointment isn't requested,
        # don't allow stale appointment data.

        appointment["date"] = None
        appointment["time"] = None
        appointment["time_preference"] = None

    # ==================================================
    # 14. Qualification Score
    # ==================================================

    if "qualification_score" not in result:

        result["qualification_score"] = None

    # ==================================================
    # 15. Qualification Status
    # ==================================================

    if "qualification_status" not in result:

        result["qualification_status"] = None

    # ==================================================
    # 16. Return Structured Result
    # ==================================================

    return {
        "reply": result["reply"],

        "qualification": qualification,

        "qualification_score": result.get(
            "qualification_score"
        ),

        "qualification_status": result.get(
            "qualification_status"
        ),

        "appointment": appointment
    }