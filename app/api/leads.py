from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.lead import Lead
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
        property_interest=lead_data.property_interest
    )

    db.add(lead)
    db.commit()
    db.refresh(lead)

    return lead


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

    return lead