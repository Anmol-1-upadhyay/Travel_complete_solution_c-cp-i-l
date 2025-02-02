def get_hotels_with_attractions(hotel_results, attractions_list):
    # Ensure hotel_results is not None and is a valid dictionary
    if not hotel_results or not isinstance(hotel_results, dict):
        return "Invalid or empty data provided"
    
    hotel_codes = []
    
    if "HotelDetails" in hotel_results:
        for hotel in hotel_results["HotelDetails"]:
            # Check if "Attractions" key exists in the hotel
            if "Attractions" in hotel:
                attractions_text = " ".join(hotel["Attractions"].values()).lower()

                # Check if all attractions in the list exist in the attractions text
                if all(attraction.lower() in attractions_text for attraction in attractions_list):
                    hotel_codes.append(hotel["HotelCode"])

    return " ".join(hotel_codes) if hotel_codes else "No hotels match the attractions"


# # Example usage

# hotel_results = {
#     "Status": {
#         "Code": 200,
#         "Description": "Successful"
#     },
#     "HotelDetails": [
#         {
#             "HotelCode": "1000000",
#             "HotelName": "Sofitel Legend Old Cataract Aswan",
#             "Attractions": {
#                 "1)": "Eiffel Tower - 0.4 km / 0.2 mi <br /> Louvre Museum - 1.1 km / 0.7 mi <br /> Champs-Élysées - 2 km / 1.2 mi"
#             }
#         },
#         {
#             "HotelCode": "1000001",
#             "HotelName": "Other Hotel",
#             "Attractions": {
#                 "1)": "Eiffel Tower - 1 km / 0.6 mi <br /> Arc de Triomphe - 3 km / 1.8 mi"
#             }
#         },
#         {
#             "HotelCode": "1000002",
#             "HotelName": "Paris Grand Hotel",
#             "Attractions": {
#                 "1)": "Eiffel Tower - 1 km / 0.6 mi <br /> Champs-Élysées - 2 km / 1.2 mi <br /> Louvre Museum - 3 km / 1.8 mi"
#             }
#         }
#     ]
# }

# # Attractions to search for
# attractions_to_search = ["Eiffel Tower", "Louvre Museum"]

# # Extract hotel codes
# matching_hotel_codes = get_hotels_with_attractions(hotel_results, attractions_to_search)

# # Output result
# print(matching_hotel_codes)
