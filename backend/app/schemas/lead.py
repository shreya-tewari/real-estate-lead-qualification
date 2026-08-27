from typing import Optional

from pydantic import BaseModel, EmailStr


class LeadCreate(BaseModel):
    name: str
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    source: Optional[str] = None
    property_interest: Optional[str] = None
    location: Optional[str] = None


class LeadResponse(BaseModel):
    id: int
    name: str
    email: Optional[str] = None
    phone: Optional[str] = None
    source: Optional[str] = None
    property_interest: Optional[str] = None

    buyer_type: Optional[str] = None
    purchase_purpose: Optional[str] = None
    location: Optional[str] = None
    property_type: Optional[str] = None
    budget: Optional[str] = None
    financing: Optional[str] = None
    purchase_timeline: Optional[str] = None
    previous_property_purchase: Optional[bool] = None
    preferred_contact_time: Optional[str] = None
    appointment_interest: Optional[bool] = None

    qualification_score: Optional[int] = None
    qualification_status: Optional[str] = None
    assigned_agent: Optional[str] = None
    ai_summary: Optional[str] = None
    appointment_date: Optional[str] = None
    appointment_time: Optional[str] = None

    class Config:
        from_attributes = True