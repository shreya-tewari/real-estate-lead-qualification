from pydantic import BaseModel


class AppointmentCreate(BaseModel):
    lead_id: int
    appointment_date: str
    appointment_time: str


class AppointmentResponse(BaseModel):
    id: int
    lead_id: int
    appointment_date: str
    appointment_time: str
    status: str
    calendar_event_id: str | None = None

    class Config:
        from_attributes = True