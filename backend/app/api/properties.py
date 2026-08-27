from typing import Optional

from fastapi import APIRouter, Query

from app.services.property_services import search_properties


router = APIRouter(
    prefix="/api/properties",
    tags=["Properties"]
)


@router.get("")
def get_properties(
    location: Optional[str] = Query(
        default=None
    ),
    property_type: Optional[str] = Query(
        default=None
    ),
    max_budget: Optional[float] = Query(
        default=None
    ),
    min_budget: Optional[float] = Query(
        default=None
    ),
    bedrooms: Optional[int] = Query(
        default=None
    )
):

    properties = search_properties(
        location=location,
        property_type=property_type,
        max_budget=max_budget,
        min_budget=min_budget,
        bedrooms=bedrooms
    )

    return {
        "count": len(properties),
        "properties": properties
    }