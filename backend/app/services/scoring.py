from typing import Optional


def calculate_lead_score(lead) -> int:
    """
    Calculate lead qualification score from 0 to 100.
    """

    score = 0

    # --------------------------------------------------
    # Buyer Type - 10 points
    # --------------------------------------------------

    if lead.buyer_type:
        score += 10

    # --------------------------------------------------
    # Purchase Purpose - 10 points
    # --------------------------------------------------

    if lead.purchase_purpose:
        score += 10

    # --------------------------------------------------
    # Location - 10 points
    # --------------------------------------------------

    if lead.location:
        score += 10

    # --------------------------------------------------
    # Property Type - 10 points
    # --------------------------------------------------

    if lead.property_type:
        score += 10

    # --------------------------------------------------
    # Budget - 15 points
    # --------------------------------------------------

    if lead.budget:
        score += 15

    # --------------------------------------------------
    # Financing - 10 points
    # --------------------------------------------------

    if lead.financing:
        score += 10

    # --------------------------------------------------
    # Purchase Timeline - 15 points
    # --------------------------------------------------

    if lead.purchase_timeline:
        timeline = lead.purchase_timeline.lower()

        if (
            "month" in timeline
            or "week" in timeline
            or "immediate" in timeline
            or "soon" in timeline
        ):
            score += 15
        else:
            score += 8

    # --------------------------------------------------
    # Previous Property Purchase - 5 points
    # --------------------------------------------------

    if lead.previous_property_purchase is not None:
        score += 5

    # --------------------------------------------------
    # Appointment Interest - 5 points
    # --------------------------------------------------

    if lead.appointment_interest is True:
        score += 5

    return min(score, 100)


def get_qualification_status(score: int) -> str:
    """
    Convert score into qualification status.
    """

    if score >= 80:
        return "Qualified"

    if score >= 50:
        return "Partially Qualified"

    return "Not Qualified"


def score_lead(lead):
    """
    Calculate and store score/status on the lead.
    """

    score = calculate_lead_score(lead)

    status = get_qualification_status(score)

    lead.qualification_score = score
    lead.qualification_status = status

    return score, status