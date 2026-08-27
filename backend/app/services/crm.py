from sqlalchemy.orm import Session
from app.models.lead import Lead
from app.models.appointment import Appointment
from app.services.summary import generate_lead_summary
from app.services.assignment import assign_sales_agent

def sync_lead_to_crm(db: Session, lead_id: int, appointment: Appointment = None):
    """
    Mock CRM Sync function.
    Generates AI summary and assigns a sales agent based on the lead details and appointment.
    """
    lead = db.query(Lead).filter(Lead.id == lead_id).first()
    if not lead:
        return
    
    # Generate AI summary
    try:
        summary = generate_lead_summary(lead, appointment)
        lead.ai_summary = summary
    except Exception as e:
        print(f"Error generating AI summary: {e}")
    
    # Assign sales agent
    agent = assign_sales_agent(lead)
    lead.assigned_agent = agent
    
    # We could also mock setting a 'synced_to_crm' boolean flag if it existed.
    
    db.commit()
    db.refresh(lead)
