from app.models.lead import Lead

def assign_sales_agent(lead: Lead) -> str:
    """
    Rule-based assignment for sales agents.
    """
    if lead.location and "Dubai" in lead.location:
        if lead.qualification_score and lead.qualification_score > 80:
            return "Dubai Investment Sales Team"
        return "Dubai General Sales Team"
    elif lead.location and "Abu Dhabi" in lead.location:
        return "Abu Dhabi Sales Team"
    
    return "Global Inbound Sales Team"
