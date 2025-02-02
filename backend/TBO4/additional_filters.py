import requests
from groq import Groq
from api_key import GROQ_API_KEY

GROQ_MODEL = "llama-3.3-70b-versatile"

# Initialize Groq Client
client = Groq(api_key=GROQ_API_KEY)


def budget_filter(hotel_data, budget):
    """
    Extracts hotel codes of hotels whose TotalFare + TotalTax is within the budget.

    Args:
        hotel_data (dict): The dictionary containing hotel data.
        budget (float): The maximum budget.

    Returns:
        str: A string containing all hotel codes that meet the budget criteria, separated by commas.
    """
    if "HotelResult" not in hotel_data:
        return ""

    hotel_codes = set()  # Use a set to ensure unique hotel codes

    for hotel in hotel_data["HotelResult"]:
        for room in hotel.get("Rooms", []):
            total_cost = room.get("TotalFare", 0) + room.get("TotalTax", 0)
            if total_cost <= budget:
                hotel_codes.add(hotel.get("HotelCode"))

    # Join all unique hotel codes into a single comma-separated string
    return ", ".join(hotel_codes)



hotel_facilities = [
    "Library", "Express check-in", "elevator", "Indoor pool", "24-hour front desk", "Poolside bar",
    "Turkish bath/Hammam", "Porter/bellhop", "Express check-out", "Dry cleaning/laundry service",
    "Outdoor pool", "Limo or Town Car service available", "Conference space size (meters) - 44",
    "Number of meeting rooms - 3", "Terrace", "Luggage storage", "ATM/banking", "Concierge services",
    "Gift shops or newsstand", "Snack bar/deli", "Shopping on site", "Pool umbrellas",
    "Airport transportation (surcharge)", "Barbecue grill(s)", "Couples/private dining",
    "Private picnics", "Coffee/tea in common areas", "Number of bars/lounges - 4", "Full-service spa",
    "Conference space", "Spa treatment room(s)", "Tours/ticket assistance", "Coffee shop or café",
    "Steam room", "Free WiFi", "Pool sun loungers", "Babysitting or childcare (surcharge)",
    "Smoke-free property", "Proposal/romance packages available", "Wheelchair accessible - no",
    "24-hour business center", "Conference space size (feet) - 474", "Laundry facilities", "Spa tub",
    "24-hour fitness facilities", "Garden", "Free newspapers in lobby", "Visual alarms in hallways", 
    "Handrails in stairways", "Fitness facilities", "Free breakfast", "Grocery/convenience store", "Wheelchair accessible (may have limitations)", 
    "Wheelchair accessible path of travel", "Television in common areas", "Accessible bathroom",
    "Roll-in shower", "In-room accessibility", "Assistive listening devices available", 
    "Braille or raised signage", "Wheelchair-accessible path to elevator", "Multilingual staff",
    "Wheelchair-accessible registration desk", "Non-Smoking", "Premium bedding", "Turndown service",
    "Iron/ironing board (on request)", "Satellite TV service", "Soundproofed rooms", "Room service",
    "In-room climate control (air conditioning)", "Blackout drapes/curtains", "Minibar",
    "Separate bathtub and shower", "Free wired internet", "Daily housekeeping", 
    "Individually decorated", "Bidet", "Individually furnished", "Phone",
    "Designer toiletries", "MP3 docking station", "Child-size bathrobes", "Connecting/adjoining rooms available", 
    "Soap", "Mini-fridge", "Toilet paper", "Shampoo", "DVD player",
    "Toothbrush and toothpaste available on request", "Slippers", "Private bathroom", "Bathrobes",
    "Wheelchair accessible", "Free toiletries", "Hair dryer", "In-room safe", "Rainfall showerhead",
    "Rollaway/extra beds (surcharge)", "Bar", "Room service (24 hours)", "Flat-panel TV", "Free newspaper", 
    "Free bottled water"
]


def map_amenities_with_groq(user_amenities, hotel_facilities):
    mapped_amenities = []  # Final structured list

    for amenity in user_amenities:
        prompt = f"""
        The user provided a list of amenities they want in a hotel. 
        Match each user-provided amenity with relevant facilities from the following hotel facilities list:
        {hotel_facilities}

        If the amenity has multiple possible matches (e.g., "pool" → "Indoor pool" or "Outdoor pool"), 
        return all relevant options **as a comma-separated list inside square brackets**. 
        If it has only one match, return it as a **single string**. 
        If no match is found, return "None".

        Only return the matched facility names or "None", without extra text.

        User amenity: "{amenity}"
        """

        response = client.chat.completions.create(
            model=GROQ_MODEL,
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.2
        )

        mapped_facility = response.choices[0].message.content.strip()

        if mapped_facility.lower() == "none":
            continue  # Skip if no match found

        if mapped_facility.startswith("[") and mapped_facility.endswith("]"):  
            # Convert to a list of possible matches (e.g., "[Indoor pool, Outdoor pool]")
            mapped_amenities.append(mapped_facility[1:-1].split(", "))  
        else:
            mapped_amenities.append(mapped_facility)  # Add single facility as string
    return mapped_amenities


# Function to filter hotels based on mapped amenities
def amenities_filter(hotel_results, user_amenities):
    hotel_codes = []
    
    # Get structured mapped amenities
    mapped_amenities = map_amenities_with_groq(user_amenities, hotel_facilities)

    for hotel in hotel_results.get("HotelDetails", []):
        hotel_facilities_set = set(hotel.get("HotelFacilities", []))

        # Check all required amenities
        all_amenities_satisfied = True

        for amenity_group in mapped_amenities:
            if isinstance(amenity_group, list):  # Flexible category (e.g., pool)
                if not any(facility in hotel_facilities_set for facility in amenity_group):
                    all_amenities_satisfied = False
                    break
            else:  # Strict requirement
                if amenity_group not in hotel_facilities_set:
                    all_amenities_satisfied = False
                    break

        if all_amenities_satisfied:
            hotel_codes.append(hotel["HotelCode"])

    return ", ".join(hotel_codes) if hotel_codes else "No matching hotels found"



# Test example for amenities_filter

# hotel_results = {
#     "Status": {"Code": 200, "Description": "Successful"},
#     "HotelDetails": [
#         {
#             "HotelCode": "1",
#             "HotelName": "Sofitel Legend Old Cataract Aswan",
#             "HotelFacilities": [
#                 "Library", "Express check-in", "elevator", "Indoor pool", "24-hour front desk", "Poolside bar",
#                 "Turkish bath/Hammam", "Porter/bellhop", "Express check-out", "Dry cleaning/laundry service",
#                 "Outdoor pool", "Limo or Town Car service available", "Conference space size (meters) - 44",
#                 "Number of meeting rooms - 3", "Terrace", "Luggage storage", "ATM/banking", "Concierge services",
#                 "Gift shops or newsstand", "Snack bar/deli", "Shopping on site", "Pool umbrellas",
#                 "Airport transportation (surcharge)", "Coffee shop or café", "Steam room", "Free WiFi", "Pool sun loungers", "Babysitting or childcare (surcharge)",
#                 "Smoke-free property", "Proposal/romance packages available", "Wheelchair accessible - no",
#                 "24-hour business center", "Spa tub", "24-hour fitness facilities", "Garden", "Free newspapers in lobby"
#             ]
#         },
#         {
#             "HotelCode": "2",
#             "HotelName": "Grand Hotel",
#             "HotelFacilities": ["Indoor pool", "Steam room", "Terrace"]
#         },
#         {
#             "HotelCode": "3",
#             "HotelName": "Grand Hotel",
#             "HotelFacilities": ["Indoor pool", "Steam room", "Luggage storage", "Library"]
#         },
#         {"HotelCode": "4", "HotelFacilities": ["Indoor pool", "Full-service spa", "Free WiFi"]},
#         {"HotelCode": "5", "HotelFacilities": ["Outdoor pool", "Full-service spa", "Free WiFi"]},
#         {"HotelCode": "6", "HotelFacilities": ["Gym", "Full-service spa", "Free WiFi"]},
#         {"HotelCode": "7", "HotelFacilities": ["Indoor pool", "Gym", "Free WiFi"]}
#     ]
# }

# # User input amenities
# user_amenities = ["pool", "spa", "free WiFi"]

# # Get matching hotel codes
# matching_hotel_codes = amenities_filter(hotel_results, user_amenities)
# print(matching_hotel_codes) 




# # Test example for budget_filter

# hotel_data = {
#     "Status": {"Code": 200, "Description": "Successful"},
#     "HotelResult": [
#         {
#             "HotelCode": "1120548",
#             "Currency": "USD",
#             "Rooms": [
#                 {
#                     "Name": ["Luxury Room, 1 King Bed"],
#                     "BookingCode": "1120548!TB!2!TB!4ee85bb9-9ca6-4c66-8a8a-524bfdd5ae2b",
#                     "Inclusion": "Free WiFi",
#                     "TotalFare": 152.88,
#                     "TotalTax": 28.12,
#                 },
#                 {
#                     "Name": ["Deluxe Room, 2 Queen Beds"],
#                     "BookingCode": "1120548!TB!3!TB!5ee95bb9-8ca6-5c66-9a8a-534bfdd5ae2c",
#                     "Inclusion": "Breakfast Included",
#                     "TotalFare": 120.00,
#                     "TotalTax": 20.00,
#                 },
#             ],
#         },
#         {
#             "HotelCode": "1120550",
#             "Currency": "USD",
#             "Rooms": [
#                 {
#                     "Name": ["Economy Room, 1 Full Bed"],
#                     "BookingCode": "1120550!TB!1!TB!1ee85bb9-9ca6-4c66-8a8a-524bfdd5ae2d",
#                     "Inclusion": "No WiFi",
#                     "TotalFare": 100.00,
#                     "TotalTax": 15.00,
#                 }
#             ],
#         },
#     ],
# }

# budget = 150.00
# hotel_codes_string = budget_filter(hotel_data, budget)

# # Print the result
# print(hotel_codes_string)