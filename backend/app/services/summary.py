import json
from openai import OpenAI
from app.config import settings
from app.models.lead import Lead
from app.models.appointment import Appointment

client = OpenAI(
    api_key=settings.openai_api_key,
)

def generate_lead_summary(lead: Lead, appointment: Appointment = None) -> str:
    """
    Generates a concise sales briefing summary for a qualified lead.
    """
    prompt = f"""
You are an expert real estate AI. Write a concise, one-paragraph summary of the following lead for a human sales agent.
Include their buying intent, budget, property preferences, timeline, and appointment details if any.

Lead Information:
Name: {lead.name}
Buyer Type: {lead.buyer_type}
Location: {lead.location}
Budget: {lead.budget}
Property Type: {lead.property_type}
Purchase Purpose: {lead.purchase_purpose}
Timeline: {lead.purchase_timeline}
Financing: {lead.financing}
Score: {lead.qualification_score} ({lead.qualification_status})
"""
    if appointment:
        prompt += f"Appointment Booked: {appointment.appointment_date} at {appointment.appointment_time}\n"
    
    prompt += "\nReturn ONLY the paragraph text without any prefix or quotes."

    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.2,
    )
    
    content = response.choices[0].message.content
    return content.strip()
