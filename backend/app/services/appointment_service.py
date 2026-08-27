from datetime import datetime

from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.appointment import Appointment


# ==================================================
# Mock Calendar Slots
# ==================================================

MOCK_SLOTS = [

    # ----------------------------------------------
    # August 28
    # ----------------------------------------------

    {
        "date": "2026-08-28",
        "time": "10:00 AM"
    },
    {
        "date": "2026-08-28",
        "time": "02:00 PM"
    },
    {
        "date": "2026-08-28",
        "time": "05:00 PM"
    },

    # ----------------------------------------------
    # August 29
    # ----------------------------------------------

    {
        "date": "2026-08-29",
        "time": "10:00 AM"
    },
    {
        "date": "2026-08-29",
        "time": "01:00 PM"
    },
    {
        "date": "2026-08-29",
        "time": "04:00 PM"
    },
    {
        "date": "2026-08-29",
        "time": "06:00 PM"
    },

    # ----------------------------------------------
    # August 30
    # ----------------------------------------------

    {
        "date": "2026-08-30",
        "time": "11:00 AM"
    },
    {
        "date": "2026-08-30",
        "time": "02:00 PM"
    },
    {
        "date": "2026-08-30",
        "time": "05:00 PM"
    },

    # ----------------------------------------------
    # August 31
    # ----------------------------------------------

    {
        "date": "2026-08-31",
        "time": "10:00 AM"
    },
    {
        "date": "2026-08-31",
        "time": "03:00 PM"
    },
    {
        "date": "2026-08-31",
        "time": "07:00 PM"
    },

    # ----------------------------------------------
    # September 1
    # ----------------------------------------------

    {
        "date": "2026-09-01",
        "time": "09:00 AM"
    },
    {
        "date": "2026-09-01",
        "time": "11:00 AM"
    },
    {
        "date": "2026-09-01",
        "time": "02:00 PM"
    },
    {
        "date": "2026-09-01",
        "time": "06:00 PM"
    },

    # ----------------------------------------------
    # September 2
    # ----------------------------------------------

    {
        "date": "2026-09-02",
        "time": "10:00 AM"
    },
    {
        "date": "2026-09-02",
        "time": "01:00 PM"
    },
    {
        "date": "2026-09-02",
        "time": "04:00 PM"
    },
    {
        "date": "2026-09-02",
        "time": "07:00 PM"
    },

    # ----------------------------------------------
    # September 3
    # ----------------------------------------------

    {
        "date": "2026-09-03",
        "time": "09:00 AM"
    },
    {
        "date": "2026-09-03",
        "time": "12:00 PM"
    },
    {
        "date": "2026-09-03",
        "time": "03:00 PM"
    },
    {
        "date": "2026-09-03",
        "time": "05:00 PM"
    },

    # ----------------------------------------------
    # September 4
    # ----------------------------------------------

    {
        "date": "2026-09-04",
        "time": "10:00 AM"
    },
    {
        "date": "2026-09-04",
        "time": "02:00 PM"
    },
    {
        "date": "2026-09-04",
        "time": "06:00 PM"
    },

    # ----------------------------------------------
    # September 5
    # ----------------------------------------------

    {
        "date": "2026-09-05",
        "time": "09:00 AM"
    },
    {
        "date": "2026-09-05",
        "time": "11:00 AM"
    },
    {
        "date": "2026-09-05",
        "time": "04:00 PM"
    },
    {
        "date": "2026-09-05",
        "time": "07:00 PM"
    },

    # ----------------------------------------------
    # September 6
    # ----------------------------------------------

    {
        "date": "2026-09-06",
        "time": "10:00 AM"
    },
    {
        "date": "2026-09-06",
        "time": "01:00 PM"
    },
    {
        "date": "2026-09-06",
        "time": "05:00 PM"
    },

    # ----------------------------------------------
    # September 7
    # ----------------------------------------------

    {
        "date": "2026-09-07",
        "time": "09:00 AM"
    },
    {
        "date": "2026-09-07",
        "time": "03:00 PM"
    },
    {
        "date": "2026-09-07",
        "time": "06:00 PM"
    },

    # ----------------------------------------------
    # September 8
    # ----------------------------------------------

    {
        "date": "2026-09-08",
        "time": "10:00 AM"
    },
    {
        "date": "2026-09-08",
        "time": "12:00 PM"
    },
    {
        "date": "2026-09-08",
        "time": "04:00 PM"
    },
    {
        "date": "2026-09-08",
        "time": "07:00 PM"
    },

    # ----------------------------------------------
    # September 9
    # ----------------------------------------------

    {
        "date": "2026-09-09",
        "time": "09:00 AM"
    },
    {
        "date": "2026-09-09",
        "time": "02:00 PM"
    },
    {
        "date": "2026-09-09",
        "time": "05:00 PM"
    },

    # ----------------------------------------------
    # September 10
    # ----------------------------------------------

    {
        "date": "2026-09-10",
        "time": "10:00 AM"
    },
    {
        "date": "2026-09-10",
        "time": "01:00 PM"
    },
    {
        "date": "2026-09-10",
        "time": "06:00 PM"
    },

    # ----------------------------------------------
    # September 11
    # ----------------------------------------------

    {
        "date": "2026-09-11",
        "time": "09:00 AM"
    },
    {
        "date": "2026-09-11",
        "time": "11:00 AM"
    },
    {
        "date": "2026-09-11",
        "time": "03:00 PM"
    },
    {
        "date": "2026-09-11",
        "time": "07:00 PM"
    },

    # ----------------------------------------------
    # September 12
    # ----------------------------------------------

    {
        "date": "2026-09-12",
        "time": "10:00 AM"
    },
    {
        "date": "2026-09-12",
        "time": "02:00 PM"
    },
    {
        "date": "2026-09-12",
        "time": "05:00 PM"
    },

    # ----------------------------------------------
    # September 13
    # ----------------------------------------------

    {
        "date": "2026-09-13",
        "time": "09:00 AM"
    },
    {
        "date": "2026-09-13",
        "time": "12:00 PM"
    },
    {
        "date": "2026-09-13",
        "time": "04:00 PM"
    },

    # ----------------------------------------------
    # September 14
    # ----------------------------------------------

    {
        "date": "2026-09-14",
        "time": "10:00 AM"
    },
    {
        "date": "2026-09-14",
        "time": "01:00 PM"
    },
    {
        "date": "2026-09-14",
        "time": "06:00 PM"
    },

    # ----------------------------------------------
    # September 15
    # ----------------------------------------------

    {
        "date": "2026-09-15",
        "time": "09:00 AM"
    },
    {
        "date": "2026-09-15",
        "time": "11:00 AM"
    },
    {
        "date": "2026-09-15",
        "time": "03:00 PM"
    },
    {
        "date": "2026-09-15",
        "time": "07:00 PM"
    },

    # ----------------------------------------------
    # October 1
    # ----------------------------------------------

    {
        "date": "2026-10-01",
        "time": "10:00 AM"
    },
    {
        "date": "2026-10-01",
        "time": "02:00 PM"
    },
    {
        "date": "2026-10-01",
        "time": "05:00 PM"
    },

    # ----------------------------------------------
    # October 2
    # ----------------------------------------------

    {
        "date": "2026-10-02",
        "time": "09:00 AM"
    },
    {
        "date": "2026-10-02",
        "time": "01:00 PM"
    },
    {
        "date": "2026-10-02",
        "time": "06:00 PM"
    },

    # ----------------------------------------------
    # October 3
    # ----------------------------------------------

    {
        "date": "2026-10-03",
        "time": "10:00 AM"
    },
    {
        "date": "2026-10-03",
        "time": "03:00 PM"
    },
    {
        "date": "2026-10-03",
        "time": "07:00 PM"
    },

    # ----------------------------------------------
    # October 4
    # ----------------------------------------------

    {
        "date": "2026-10-04",
        "time": "09:00 AM"
    },
    {
        "date": "2026-10-04",
        "time": "12:00 PM"
    },
    {
        "date": "2026-10-04",
        "time": "04:00 PM"
    },

    # ----------------------------------------------
    # October 5
    # ----------------------------------------------

    {
        "date": "2026-10-05",
        "time": "10:00 AM"
    },
    {
        "date": "2026-10-05",
        "time": "02:00 PM"
    },
    {
        "date": "2026-10-05",
        "time": "06:00 PM"
    },
]


# ==================================================
# Get Available Appointment Slots
# ==================================================

def get_available_slots(
    db: Session
) -> list[dict]:
    """
    Return mock calendar slots that are not already booked.
    """

    # ----------------------------------------------
    # Get confirmed appointments
    # ----------------------------------------------

    booked = (
        db.query(Appointment)
        .filter(
            Appointment.status == "confirmed"
        )
        .all()
    )

    # ----------------------------------------------
    # Build booked slot set
    # ----------------------------------------------

    booked_slots = {
        (
            appointment.appointment_date,
            appointment.appointment_time
        )
        for appointment in booked
    }

    # ----------------------------------------------
    # Remove booked slots
    # ----------------------------------------------

    available_slots = [
        slot
        for slot in MOCK_SLOTS
        if (
            slot["date"],
            slot["time"]
        ) not in booked_slots
    ]

    return available_slots


# ==================================================
# Filter Available Slots
# ==================================================

def filter_slots(
    available_slots: list[dict],
    appointment_date: str | None = None,
    time_preference: str | None = None,
    specific_time: str | None = None
) -> list[dict]:
    """
    Filter available slots according to:
    - requested date
    - specific time
    - morning / afternoon / evening
    """

    # ----------------------------------------------
    # Start with all available slots
    # ----------------------------------------------

    filtered_slots = list(available_slots)

    # ----------------------------------------------
    # 1. Filter by date
    # ----------------------------------------------

    if appointment_date:

        filtered_slots = [
            slot
            for slot in filtered_slots
            if slot["date"] == appointment_date
        ]

    # ----------------------------------------------
    # 2. Filter by specific time
    # ----------------------------------------------

    if specific_time:

        requested_time = (
            specific_time
            .strip()
            .lower()
        )

        filtered_slots = [
            slot
            for slot in filtered_slots
            if slot["time"]
            .strip()
            .lower()
            == requested_time
        ]

        return filtered_slots

    # ----------------------------------------------
    # 3. Filter by time preference
    # ----------------------------------------------

    if time_preference:

        preference = (
            time_preference
            .strip()
            .lower()
        )

        result = []

        for slot in filtered_slots:

            try:

                slot_time = datetime.strptime(
                    slot["time"],
                    "%I:%M %p"
                )

                hour = slot_time.hour

                # ----------------------------------
                # Morning: 5 AM - 11:59 AM
                # ----------------------------------

                if (
                    preference == "morning"
                    and 5 <= hour < 12
                ):
                    result.append(slot)

                # ----------------------------------
                # Afternoon: 12 PM - 4:59 PM
                # ----------------------------------

                elif (
                    preference == "afternoon"
                    and 12 <= hour < 17
                ):
                    result.append(slot)

                # ----------------------------------
                # Evening: 5 PM - 9:59 PM
                # ----------------------------------

                elif (
                    preference == "evening"
                    and 17 <= hour < 22
                ):
                    result.append(slot)

            except ValueError:
                # Ignore malformed times
                continue

        filtered_slots = result

    return filtered_slots


# ==================================================
# Check Whether Slot Is Available
# ==================================================

def is_slot_available(
    db: Session,
    appointment_date: str,
    appointment_time: str
) -> bool:
    """
    Check whether a specific slot is still available.
    """

    existing_appointment = (
        db.query(Appointment)
        .filter(
            Appointment.appointment_date
            == appointment_date,

            Appointment.appointment_time
            == appointment_time,

            Appointment.status == "confirmed"
        )
        .first()
    )

    return existing_appointment is None


# ==================================================
# Create Appointment
# ==================================================

def create_appointment(
    db: Session,
    lead_id: int,
    appointment_date: str,
    appointment_time: str
):
    """
    Create a confirmed appointment.

    The slot is checked again immediately before
    inserting to prevent double booking.
    """

    # ----------------------------------------------
    # 1. Verify slot exists in calendar
    # ----------------------------------------------

    slot_exists = any(
        slot["date"] == appointment_date
        and slot["time"] == appointment_time
        for slot in MOCK_SLOTS
    )

    if not slot_exists:

        raise HTTPException(
            status_code=400,
            detail="Invalid appointment slot"
        )

    # ----------------------------------------------
    # 2. Check whether slot is already booked
    # ----------------------------------------------

    if not is_slot_available(
        db=db,
        appointment_date=appointment_date,
        appointment_time=appointment_time
    ):

        raise HTTPException(
            status_code=409,
            detail="This appointment slot is already booked"
        )

    # ----------------------------------------------
    # 3. Create appointment
    # ----------------------------------------------

    appointment = Appointment(
        lead_id=lead_id,
        appointment_date=appointment_date,
        appointment_time=appointment_time,
        status="confirmed"
    )

    # ----------------------------------------------
    # 4. Save
    # ----------------------------------------------

    db.add(appointment)
    db.commit()
    db.refresh(appointment)

    return appointment