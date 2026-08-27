from datetime import datetime

from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, Text

from app.database import Base


class Lead(Base):
    __tablename__ = "leads"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=True)
    phone = Column(String(50), nullable=True)

    source = Column(String(100), nullable=True)
    property_interest = Column(String(255), nullable=True)

    # Qualification information
    buyer_type = Column(String(100), nullable=True)
    purchase_purpose = Column(String(255), nullable=True)
    location = Column(String(255), nullable=True)
    property_type = Column(String(100), nullable=True)

    budget = Column(String(255), nullable=True)
    financing = Column(String(100), nullable=True)

    purchase_timeline = Column(String(100), nullable=True)

    previous_property_purchase = Column(Boolean, nullable=True)

    preferred_contact_time = Column(String(100), nullable=True)

    appointment_interest = Column(Boolean, nullable=True)

    # Qualification result
    qualification_score = Column(Integer, nullable=True)

    qualification_status = Column(
        String(50),
        nullable=True
    )

    assigned_agent = Column(
        String(255),
        nullable=True
    )

    ai_summary = Column(
        Text,
        nullable=True
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )

    updated_at = Column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow
    )