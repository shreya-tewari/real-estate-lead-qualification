from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.lead import Lead
from app.models.appointment import Appointment
from app.schemas.appointment import (
    AppointmentCreate,
    AppointmentResponse
)
from app.services.appointment_service import get_available_slots
from app.services.crm import sync_lead_to_crm
router = APIRouter(
    prefix="/api/appointments",
    tags=["Appointments"]
)


@router.get("/slots")
def get_slots(
    db: Session = Depends(get_db)
):
    return {
        "slots": get_available_slots(db)
    }
    """
    Return available appointment slots.

    For the POC these are mock calendar slots.
    """

    slots = [
        {
            "date": "2026-08-27",
            "time": "10:00 AM"
        },
        {
            "date": "2026-08-27",
            "time": "02:00 PM"
        },
        {
            "date": "2026-08-27",
            "time": "05:00 PM"
        },
        {
            "date": "2026-08-28",
            "time": "11:00 AM"
        },
        {
            "date": "2026-08-28",
            "time": "04:00 PM"
        }
    ]

    # Remove already booked slots
    booked = (
        db.query(Appointment)
        .filter(
            Appointment.status == "confirmed"
        )
        .all()
    )

    booked_slots = {
        (
            appointment.appointment_date,
            appointment.appointment_time
        )
        for appointment in booked
    }

    available_slots = [
        slot
        for slot in slots
        if (
            slot["date"],
            slot["time"]
        ) not in booked_slots
    ]

    return {
        "slots": available_slots
    }


@router.post(
    "",
    response_model=AppointmentResponse
)
def create_appointment(
    request: AppointmentCreate,
    db: Session = Depends(get_db)
):

    # ----------------------------------------------
    # 1. Check lead
    # ----------------------------------------------

    lead = (
        db.query(Lead)
        .filter(
            Lead.id == request.lead_id
        )
        .first()
    )

    if not lead:
        raise HTTPException(
            status_code=404,
            detail="Lead not found"
        )

    # ----------------------------------------------
    # 2. Check slot
    # ----------------------------------------------

    existing_appointment = (
        db.query(Appointment)
        .filter(
            Appointment.appointment_date
            == request.appointment_date,

            Appointment.appointment_time
            == request.appointment_time,

            Appointment.status == "confirmed"
        )
        .first()
    )

    if existing_appointment:
        raise HTTPException(
            status_code=409,
            detail="This appointment slot is already booked"
        )

    # ----------------------------------------------
    # 3. Create appointment
    # ----------------------------------------------

    appointment = Appointment(
        lead_id=request.lead_id,
        appointment_date=request.appointment_date,
        appointment_time=request.appointment_time,
        status="confirmed"
    )

    db.add(appointment)
    db.commit()
    db.refresh(appointment)

    # ----------------------------------------------
    # 4. Sync to CRM
    # ----------------------------------------------

    sync_lead_to_crm(db, request.lead_id, appointment)

    # ----------------------------------------------
    # 5. Return appointment
    # ----------------------------------------------

    return appointment

@router.get(
    "/all",
    response_model=list[AppointmentResponse]
)
def get_all_appointments(
    db: Session = Depends(get_db)
):
    appointments = (
        db.query(Appointment)
        .order_by(Appointment.appointment_date.desc())
        .all()
    )
    return appointments