from datetime import datetime

from sqlalchemy import Column, Integer, String, DateTime

from app.database import Base


class Appointment(Base):
    __tablename__ = "appointments"

    id = Column(Integer, primary_key=True, index=True)

    lead_id = Column(
        Integer,
        nullable=False,
        index=True
    )

    appointment_date = Column(
        String(20),
        nullable=False
    )

    appointment_time = Column(
        String(20),
        nullable=False
    )

    status = Column(
        String(50),
        default="confirmed"
    )

    calendar_event_id = Column(
        String(255),
        nullable=True
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )