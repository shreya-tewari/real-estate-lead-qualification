from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.lead import Lead
from app.models.appointment import Appointment
from app.schemas.lead import LeadCreate, LeadResponse


router = APIRouter(
    prefix="/api/leads",
    tags=["Leads"]
)


@router.post(
    "",
    response_model=LeadResponse,
    status_code=201
)
def create_lead(
    lead_data: LeadCreate,
    db: Session = Depends(get_db)
):
    lead = Lead(
        name=lead_data.name,
        email=lead_data.email,
        phone=lead_data.phone,
        source=lead_data.source,
        property_interest=lead_data.property_interest,
        location=lead_data.location
    )

    db.add(lead)
    db.commit()
    db.refresh(lead)

    return lead

@router.get(
    "",
    response_model=list[LeadResponse]
)
def get_leads(
    db: Session = Depends(get_db)
):
    leads = (
        db.query(Lead)
        .order_by(Lead.created_at.desc())
        .all()
    )
    return leads


@router.get(
    "/{lead_id}",
    response_model=LeadResponse
)
def get_lead(
    lead_id: int,
    db: Session = Depends(get_db)
):
    lead = (
        db.query(Lead)
        .filter(Lead.id == lead_id)
        .first()
    )

    if not lead:
        raise HTTPException(
            status_code=404,
            detail="Lead not found"
        )
        
    appointment = db.query(Appointment).filter(Appointment.lead_id == lead_id).order_by(Appointment.created_at.desc()).first()
    
    lead_dict = {c.name: getattr(lead, c.name) for c in lead.__table__.columns}
    if appointment:
        lead_dict['appointment_date'] = appointment.appointment_date
        lead_dict['appointment_time'] = appointment.appointment_time
        
    return lead_dict

from app.services.conversation_service import get_conversation_history

@router.get(
    "/{lead_id}/history",
)
def get_lead_history(
    lead_id: int,
    db: Session = Depends(get_db)
):
    lead = (
        db.query(Lead)
        .filter(Lead.id == lead_id)
        .first()
    )

    if not lead:
        raise HTTPException(
            status_code=404,
            detail="Lead not found"
        )
        
    history = get_conversation_history(lead_id)
    return {"history": history}