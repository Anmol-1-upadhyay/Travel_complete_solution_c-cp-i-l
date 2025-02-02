# import json
# import re
# from groq import Groq
# import fetchCountryCode,fetchCityCode,fetchHotelCodes
# import requests
# from requests.auth import HTTPBasicAuth

# GROQ_API_KEY = "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"
# GROQ_MODEL = "llama-3.3-70b-versatile"

# api_endpoint="http://api.tbotechnology.in/TBOHolidays_HotelAPI/Search"
# username="hackathontest"
# password="Hac@98910186"

# # Initialize GROQ API client
# client = Groq(api_key=GROQ_API_KEY)

# # Session string to hold entire conversation
# session_history = "User-Bot Conversation History:\n"

# travel_preferences = {}

# def chat_with_llm(user_input):
#     """
#     Process the user's input using LLM to determine the next action and provide responses.
#     """
#     global session_history
#     session_history += f"User: {user_input}\n"

#     prompt = (
#         "Use to the point and concise, easy-to-understand language. "
#         "Note that the user may only ask for simple things like just book something, then don't unnecessarily extend the conversation and just ask for crucial parameters. "
#         "But if user asks for suggestions or if is not sure about something then suggest. "
#         "Based on the following conversation, continue the discussion to help the user finalize travel details. "
#         "Guide the user by suggesting destinations, asking for required inputs, and extracting final preferences when ready. "
#         "Keep adding the information to the json format parameters if you feel that the user has confirmed something also note that we may change this parameter later. "
#         "The essential parameters to gather are destination, check-in date, check-out date, number of adults, number of children, children ages, number of rooms. Additional details can be included as needed. "
#         "'destination' parameter must contain only the name of a city. If the user provides a country name or any other type of destination, prompt them to specify the city they plan to visit. "
#         "'CheckIn' parameter should indicate the specific date (day, month, and year) when a guest intends to arrive at the hotel or accommodation to start their stay. Make sure the date is greater than today's date and check the year>=2025 . If the user provides relative inputs such as 'next Monday', 'next week', 'next month', 'next year' or mentions a festival day, calculate the exact date based on today's date. Confirm the calculated date with the user to ensure accuracy. Once confirmed, store the date in the format day-month-year."
#         "'CheckOut' parameter should specify the exact date (day, month, and year) when a guest plans to leave the hotel or accommodation at the end of their stay. Make sure the date is greater than today's date and check the year>=2025. If the user provides relative inputs such as 'next Friday', 'after two weeks', 'end of next month', 'next year' or mentions a festival day, calculate the corresponding date based on today's date and the specified duration of the stay. Confirm the calculated date with the user to ensure it aligns with their intent. Once confirmed, store the date in the format day-month-year."
#         "'NoOfRooms' parameter should reflect the number of Rooms required. It should be a non negative integer. "   
#         "'PaxRooms' parameter is an array of occupancy details for each room; for example if booking 2 rooms, ask the user for the number of adults and children and children ages in Room 1 and Room 2 individually. Each element in PaxRooms has three parameters: Adults, Children and ChildrenAges"
#         "'Adults' parameter should reflect the number of adult guests (1-8) per room. It should be a positive integer. "
#         "'Children' parameter should reflect the number of child guests (0-4) per room. It should be a non negative integer. "
#         "'ChildrenAges' parameter should reflect the list of children ages (0-18 years). The length of array is equal to the number of children in the room. Eg, [2, 8] if request contains 2 children.(ask only if number of children are non zero). "
#         "'Refundable' parameter: Ask user if they wants only refundable rooms; if yes set True else False. "
#         "'MealType' parameter: Ask user for if they want to include meal or not. Then set this parameter to either of the three options: 'WithMeal' (includes meals), 'RoomOnly' (excludes meals), or 'All' (shows all hotels with or without meals). "
#         "'GuestNationality' parameter: Ask the lead guest nationality and then store his country full name in this parameter. "
#         "If enough information is provided, extract and summarize travel preferences in a dictionary format. "
#         "Once the user confirms they are satisfied with the parameters and is ready to proceed with the hotel results, respond with the single word 'done'. Ensure that the response is in this exact format only.\n\n"
#         f"Conversation:\n{session_history}"
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


# def chatbot():
#     """
#     Main chatbot loop to interact with the user.
#     """
#     global session_history
#     print("Welcome to the Travel Chatbot! Type 'exit' to end the session.")

#     while True:
#         user_input = input("You: ")
#         if user_input.lower() in ["exit", "quit"]:
#             print("Goodbye! Hope to assist you again.")
#             break

#         bot_response = chat_with_llm(user_input)

#         if bot_response.lower() == "done":
#                 # Ask the bot to provide travel details in a structured format
#                 prompt_for_details = (
#                     "Provide travel details strictly in a dictionary format as follows. Do not include any additional text or explanation, only the dictionary. The key names must be the same as provided in the following format:\n"
#                     "CheckIn: YYYY-MM-DD', 'CheckOut: YYYY-MM-DD', 'GuestNationality: full country name', 'Country: destination city's full country name', 'City: city full name', "
#                     "'PaxRooms: An array where each element represents a room and is a nested dictionary in the format {\Adults:integer, Children:integer, ChildrenAges:array of integers}. The number of nested arrays in 'PaxRooms' corresponds to the number of rooms.', "
#                     "'Filters: A dictionary containing 'Refundable':(true/false), 'NoOfRooms':(a non-negative integer), 'MealType':('All', 'WithMeal', or 'RoomOnly').'"
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
#                 break
#         else:
#             print(f"Bot: {bot_response}")


# def get_parameters(travel_preferences):
#     citycode=fetchCityCode.extract_city_code(
#             travel_preferences["City"], 
#             fetchCountryCode.extract_country_code(travel_preferences["Country"])
#         )
#     hostelcodes=fetchHotelCodes.extract_hotel_codes(citycode)
#     parameters = {
#         "CheckIn": travel_preferences["CheckIn"],
#         "CheckOut": travel_preferences["CheckOut"],
#         "HotelCodes": hostelcodes,
#         "GuestNationality": fetchCountryCode.extract_country_code(travel_preferences["GuestNationality"]),
#         "CityCode": citycode,
#         "PaxRooms": travel_preferences["PaxRooms"],
#         "ResponseTime": 23.0,
#         "IsDetailedResponse": False,
#         "Filters": travel_preferences["Filters"]
#     }
#     return parameters

# def get_results(payload):
#     try:
#         response = requests.post(api_endpoint, json=payload, auth=HTTPBasicAuth(username, password))
#         if response.status_code == 200:
#             response_data = response.json()  # This will convert the JSON response to a Python dictionary
#             return response_data
    
#     except requests.exceptions.RequestException as e:
#         print(f"An error occurred: {e}")    

# if __name__ == "__main__":
#     chatbot()
#     parameters=get_parameters(travel_preferences)
#     #print(parameters)
#     results=get_results(parameters)
#     print(results)

