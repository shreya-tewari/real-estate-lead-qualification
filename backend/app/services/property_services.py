import json
from pathlib import Path


PROPERTY_FILE = (
    Path(__file__).resolve().parent.parent
    / "knowledge"
    / "properties.json"
)


def load_properties() -> list[dict]:
    """
    Load all properties from the knowledge base.
    """

    with open(
        PROPERTY_FILE,
        "r",
        encoding="utf-8"
    ) as file:
        return json.load(file)


def search_properties(
    location: str | None = None,
    property_type: str | None = None,
    max_budget: str | float | None = None,
    min_budget: str | float | None = None,
    bedrooms: int | None = None
) -> list[dict]:
    """
    Search properties using basic filters.
    """

    properties = load_properties()

    results = []

    for property_item in properties:

        # Location filter
        if location:
            if location.lower() not in (
                property_item["location"].lower()
                + " "
                + property_item["city"].lower()
            ):
                continue

        # Property type filter
        if property_type:
            if (
                property_item["property_type"].lower()
                != property_type.lower()
            ):
                continue

        # Maximum budget
        if max_budget is not None:
            try:
                if property_item["price"] > float(max_budget):
                    continue
            except (ValueError, TypeError):
                pass

        # Minimum budget
        if min_budget is not None:
            try:
                if property_item["price"] < float(min_budget):
                    continue
            except (ValueError, TypeError):
                pass

        # Bedroom filter
        if bedrooms is not None:
            if property_item["bedrooms"] != bedrooms:
                continue

        results.append(property_item)

    return results