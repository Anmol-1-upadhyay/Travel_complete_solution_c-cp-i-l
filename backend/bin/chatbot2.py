# import json
# import re
# from groq import Groq
# from fastapi import FastAPI, APIRouter
# from api_key import groq_api_key
# import fetchCountryCode, fetchCityCode, fetchHotelCodes, additional_filters, attractions
# import requests
# from requests.auth import HTTPBasicAuth
# from datetime import datetime
# from pydantic import BaseModel
# from api_key import GROQ_API_KEY

# chatbot_router = APIRouter()

# # GROQ_API_KEY = groq_api_key
# GROQ_MODEL = "llama-3.3-70b-versatile"

# api_endpoint_search="http://api.tbotechnology.in/TBOHolidays_HotelAPI/Search"
# api_endpoint_hoteldetails="http://api.tbotechnology.in/TBOHolidays_HotelAPI/HotelDetails"
# username="hackathontest"
# password="Hac@98910186"

# # Initialize GROQ API client
# client = Groq(api_key=GROQ_API_KEY)

# # Session string to hold entire conversation
# session_history = "User-Bot Conversation History:\n"

# travel_preferences = {}

# # Request body structure for the user's input
# class UserInput(BaseModel):
#     text: str

# today = datetime.today()
# date = today.strftime("%A, %B %d, %Y")  

# def chat_with_llm(user_input):
#     """
#     Process the user's input using LLM to determine the next action and provide responses.
#     """
#     global session_history
#     session_history += f"User: {user_input}\n"

#     prompt = (
#         "Use clear, concise, and easy-to-understand language. "
#         "If the user makes straightforward request like just book something, then don't unnecessarily extend the conversation and just ask for crucial parameters. "
#         "If the user seeks suggestions or seems unsure, provide helpful recommendations. "
#         "Based on the following conversation, continue the discussion to help the user finalize travel details. "
#         "Guide the user by suggesting destinations, asking for required inputs, and extracting final preferences when ready. "
#         "Update the JSON parameters when the user confirms details, but note that they may change later. Do not display the parameters to the user in output but keep a record of it. "
#         "The essential parameters to gather are as follows: "
#         "'destination' parameter must contain only the name of a city. If the user provides a country name or any other type of destination, prompt them to specify the city they plan to visit. "
#         f"'CheckIn' parameter should indicate the specific date (day, month, and year) when a guest intends to arrive at the hotel or accommodation to start their stay. Make sure the date is greater than or equal to {date} (Check the year carefully). If the user provides relative inputs such as 'next Monday', 'next week', 'next month', 'next year' or mentions a festival day, calculate the exact date based on today's date. Confirm the calculated date with the user to ensure accuracy. Once confirmed, store the date in the format day-month-year."
#         f"'CheckOut' parameter should specify the exact date (day, month, and year) when a guest plans to leave the hotel or accommodation at the end of their stay. Make sure the date is strictly greater than check-in date (Check the year carefully). If the user provides relative inputs such as 'next Friday', 'after two weeks', 'end of next month', 'next year' or mentions a festival day, calculate the corresponding date based on today's date and the specified duration of the stay. Confirm the calculated date with the user to ensure it aligns with their intent. Once confirmed, store the date in the format day-month-year."
#         "'NoOfRooms' parameter should reflect the number of Rooms required. It should be a non negative integer. "   
#         "'PaxRooms' parameter is an array of occupancy details for each room; for example if booking 2 rooms, ask the user for the number of adults and children and children ages in Room 1 and Room 2 individually. Each element in PaxRooms has three parameters: Adults, Children and ChildrenAges"
#         "'Adults' parameter should reflect the number of adult guests (1-8) per room. It should be a positive integer. "
#         "'Children' parameter should reflect the number of child guests (0-4) per room. It should be a non negative integer. "
#         "'ChildrenAges' parameter should reflect the list of children ages (0-18 years). The length of array is equal to the number of children in the room. Eg, [2, 8] if request contains 2 children.(ask only if number of children are non zero). "
#         "'Refundable' parameter: Ask user if they wants only refundable rooms; if yes set True else False. "
#         "'MealType' parameter: Ask user for if they want to include meal or not. Then set this parameter to either of the three options: 'WithMeal' (includes meals), 'RoomOnly' (excludes meals), or 'All' (shows all hotels with or without meals). "
#         "'GuestNationality' parameter: Ask the lead guest nationality and then store his country full name in this parameter. "
#         "'Budget' parameter(in USD): Ask the user for their total budget per hotel room for the entire stay, specifying the currency they prefer. Convert the amount to USD based on the given currency. If no currency is mentioned, prompt the user to specify one before proceeding. If the user has no budget limit, store the value as 'NULL' while maintaining the same format. "
#         "'Amenities' parameter: Ask and extract the amenities the user wants and store all the amenities in an array. Amenities dont include tourist spots like Eiffel Tower, Red Fort or Taj Mahal. "
#         "'Attractions' parameter: If the user requests to show hotels near a specific tourist attraction, save the tourist attractions like Eiffel Tower,Red Fort or Taj Mahal in this array. Only populate the array when the user explicitly mentions an attraction—do not ask them to provide one. Save the correct and complete name of the attraction spot. "
#         "If enough information is provided, extract and summarize travel preferences in a dictionary format. "
#         "Once the user confirms they are satisfied with the parameters and is ready to proceed with the hotel results, respond with the single word 'OK SEARCH' without any other sentence or explanation. Ensure that the response is in this exact format only.\n\n"        f"Conversation:\n{session_history}"
#     )

#     response = client.chat.completions.create(
#         model=GROQ_MODEL,
#         messages=[{"role": "user", "content": prompt}],
#         temperature=1,
#         max_tokens=1024,
#         top_p=1,
#         stream=False
#     )

#     bot_response = response.choices[0].message.content.strip()
#     session_history += f"Bot: {bot_response}\n"
#     return bot_response


# def parse_travel_details(bot_response):
#     """
#     Parse the travel details from the bot response into a dictionary.
#     """
#     global travel_preferences
#     try:
#         # Strip unnecessary whitespace and validate the JSON structure
#         bot_response = bot_response.strip()

#         # Validate if the response looks like a JSON object
#         if not bot_response.startswith("{") or not bot_response.endswith("}"):
#             raise ValueError("Bot response is not valid JSON.")

#         # Parse the JSON object
#         travel_preferences = json.loads(bot_response)

#     except json.JSONDecodeError as e:
#         print(f"Error parsing travel details: {e}")
#         travel_preferences = {}
#     except ValueError as e:
#         print(f"Error: {e}")
#         travel_preferences = {}

# @chatbot_router.post("/")
# def chatbot(input: UserInput):
#     """
#     Main chatbot loop to interact with the user.
#     """
#     global session_history
#     print("Welcome to the Travel Chatbot! Type 'exit' to end the session.")

#     while True:
#         user_input = input.text
#         # user_input = input("You: ")
#         if user_input.lower() in ["exit", "quit"]:
#             print("Goodbye! Hope to assist you again.")
#             break

#         bot_response = chat_with_llm(user_input)

#         if "OK SEARCH" in bot_response.upper():
#                 # Ask the bot to provide travel details in a structured format
#                 prompt_for_details = (
#                     "Provide travel details strictly in a dictionary format as follows. Do not include any additional text or explanation, only the dictionary. The key names must be the same as provided in the following format and should be in double quotes:\n"
#                     "CheckIn: YYYY-MM-DD', 'CheckOut: YYYY-MM-DD', 'GuestNationality: full country name', 'Country: destination city's full country name', 'City: destination city full name', "
#                     "'PaxRooms: An array where each element represents a room and is a nested dictionary in the format {\Adults:integer, Children:integer, ChildrenAges:array of integers}. The number of nested arrays in 'PaxRooms' corresponds to the number of rooms.', "
#                     "'Filters: A dictionary containing 'Refundable':(true/false), 'NoOfRooms':(a non-negative integer), 'MealType':('All', 'WithMeal', or 'RoomOnly')', 'Budget: float number or \"NO LIMIT\"', 'Amenities: [amenity1, amenity2,...]', 'Attractions: [attraction1, attraction2,...]': \n"
#                     f"Conversation:\n{session_history}"
#                 )

#                 response = client.chat.completions.create(
#                     model=GROQ_MODEL,
#                     messages=[{"role": "user", "content": prompt_for_details}],
#                     temperature=1,
#                     max_tokens=1024,
#                     top_p=1,
#                     stream=False
#                 )

#                 parse_travel_details(response.choices[0].message.content.strip())
#                 main_results = main()
#                 return main_results
#                 break
#         else:
#             print(f"Bot: {bot_response}")

#         # Return the bot's response to the frontend
#         return {"response": bot_response}


# def get_parameters(travel_preferences):
#     countrycode=fetchCountryCode.extract_country_code(travel_preferences["Country"])
#     citycode=fetchCityCode.extract_city_code(travel_preferences["City"],countrycode)
#     hotelcodes=fetchHotelCodes.extract_hotel_codes(citycode)
#     parameters = {
#         "CheckIn": travel_preferences["CheckIn"],
#         "CheckOut": travel_preferences["CheckOut"],
#         "HotelCodes": hotelcodes,
#         "GuestNationality": fetchCountryCode.extract_country_code(travel_preferences["GuestNationality"]),
#         "CityCode": citycode,
#         "PaxRooms": travel_preferences["PaxRooms"],
#         "ResponseTime": 23.0,
#         "IsDetailedResponse": False,
#         "Filters": travel_preferences["Filters"],
#         "Budget": travel_preferences["Budget"],
#         "Amenities": travel_preferences["Amenities"],
#         "Attractions": travel_preferences["Attractions"]
#     }
#     return parameters

# def get_results(payload):
#     try:
#         response = requests.post(api_endpoint_search, json=payload, auth=HTTPBasicAuth(username, password))
#         if response.status_code == 200:
#             response_data = response.json()  # This will convert the JSON response to a Python dictionary
#             return response_data
    
#     except requests.exceptions.RequestException as e:
#         print(f"An error occurred: {e}")    

# def get_hotel_info(payload):
#     try:
#         response = requests.post(api_endpoint_hoteldetails, json=payload, auth=HTTPBasicAuth(username, password))
#         if response.status_code == 200:
#             response_data = response.json()  # This will convert the JSON response to a Python dictionary
#             return response_data
    
#     except requests.exceptions.RequestException as e:
#         print(f"An error occurred: {e}")     

# def main():
#     # chatbot()

#     print("here")
#     parameters=get_parameters(travel_preferences)
#     search_results=get_results(parameters)

#     if str(parameters["Budget"]).upper() != "NO LIMIT":
#         filtered_hotelcodes=additional_filters.budget_filter(search_results,parameters["Budget"])
#         print("here2")
#         hotel_results=get_hotel_info({"Hotelcodes": filtered_hotelcodes, "Language": "EN"})  
#     else:
#         hotel_results=get_hotel_info({"Hotelcodes": parameters["HotelCodes"], "Language": "EN"})  
#         print("here3")

#     if len(parameters["Amenities"]):  
#         filtered_hotelcodes=additional_filters.amenities_filter(hotel_results,parameters["Amenities"])
#         print("here4")
#         hotel_results=get_hotel_info({"Hotelcodes": filtered_hotelcodes, "Language": "EN"})

#     if len(parameters["Attractions"]):  
#         filtered_hotelcodes = attractions.get_hotels_with_attractions(hotel_results, parameters["Attractions"])
#         print("here5")
#         hotel_results=get_hotel_info({"Hotelcodes": filtered_hotelcodes, "Language": "EN"}) 
    
#     parameters["HotelCodes"]=filtered_hotelcodes
#     print("parameters:",parameters)
#     search_results=get_results(parameters)
#     print("search_results:",search_results)
#     print("hotel_results:",hotel_results)

#     # Create a map of HotelDetails by HotelCode for quick lookup
#     hotel_details_map = {detail['HotelCode']: detail for detail in hotel_results['HotelDetails']}

#     # Combine the data from roomsData (search_results) and hotelDetails
#     combined_data = [
#         {**room, 'HotelDetails': hotel_details_map.get(room['HotelCode'], None)} 
#         for room in search_results['HotelResult']
#     ]
#     print("combined_data:", combined_data)


#     return {
#         # "search_results": search_results["HotelResult"],
#         # "hotel_results": hotel_results["HotelDetails"]
#         "combined_data": combined_data
#     }

# # Test example:    
# # I had like to visit Chennai on February 10 for a 2-day stay. I want to book a single, non-refundable room for one adult, with a budget of ₹20000. The hotel should have wifi and be near ECR Beach. Meals are optional, and my nationality is Indian.