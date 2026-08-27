from typing import Optional

from pydantic import BaseModel


class ChatRequest(BaseModel):
    lead_id: int
    message: str


class QualificationData(BaseModel):
    buyer_type: Optional[str] = None
    purchase_purpose: Optional[str] = None
    location: Optional[str] = None
    property_type: Optional[str] = None
    budget: Optional[float] = None
    financing: Optional[str] = None
    purchase_timeline: Optional[str] = None
    previous_property_purchase: Optional[bool] = None
    preferred_contact_time: Optional[str] = None
    appointment_interest: Optional[bool] = None


class ChatResponse(BaseModel):
    lead_id: int
    reply: str
    qualification: QualificationData

    qualification_score: int
    qualification_status: str