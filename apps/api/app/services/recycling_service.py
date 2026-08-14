DEFAULT_GUIDANCE: dict[str, list[str]] = {
    "Plastic": ["Empty and rinse the item.", "Check the local resin-code rules.", "Keep plastic bags out of mixed recycling."],
    "Paper": ["Keep paper clean and dry.", "Flatten cardboard before collection."],
    "Glass": ["Rinse containers.", "Separate broken glass according to local guidance."],
    "Metal": ["Rinse cans and remove food residue.", "Handle sharp edges safely."],
    "Organic": ["Use a compost or approved organic-waste container."],
    "Electronic waste": ["Use an approved e-waste collection point."],
    "Hazardous waste": ["Do not place it in household recycling.", "Use an authorized hazardous-waste facility."],
    "General or mixed waste": ["Separate recyclable components where it is safe to do so."],
}


def guidance_for(category: str) -> list[str]:
    return DEFAULT_GUIDANCE.get(category, ["Follow the disposal guidance provided by your local authority."])
