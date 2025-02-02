# import requests
# import base64
# from groq import Groq

# # TBO API credentials
# TBO_API_URL = "http://api.tbotechnology.in/TBOHolidays_HotelAPI"
# TBO_USERNAME = "hackathontest"
# TBO_PASSWORD = "Hac@98910186"

# # GROQ API credentials
# GROQ_API_KEY = "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"
# GROQ_MODEL = "llama-3.3-70b-versatile"

# # Encode credentials for Basic Authentication
# credentials = f"{TBO_USERNAME}:{TBO_PASSWORD}"
# encoded_credentials = base64.b64encode(credentials.encode()).decode()

# # Request headers for TBO API
# HEADERS = {
#     "Authorization": f"Basic {encoded_credentials}",
#     "Content-Type": "application/json"
# }

# # Initialize GROQ API client
# client = Groq(api_key=GROQ_API_KEY)

# # Session string to hold entire conversation
# session_history = "User-Bot Conversation History:\n"

# def analyze_intent(user_input):
#     """
#     Determine if the user is seeking suggestions or ready to book.
#     """
#     global session_history
#     session_history += f"User: {user_input}\n"

#     prompt = (
#         "Analyze the conversation and determine if the user is:\n"
#         "1. Asking for suggestions (Reply with 'suggest')\n"
#         "2. Ready to book (Reply with 'book')\n"
#         "3. Needs more clarifications (Reply with 'clarify')\n\n"
#         f"Conversation:\n{session_history}"
#     )

#     response = client.chat.completions.create(
#         model=GROQ_MODEL,
#         messages=[{"role": "user", "content": prompt}],
#         temperature=0.7,
#         max_tokens=20
#     )

#     decision = response.choices[0].message.content.strip().lower()
#     return decision

# def extract_booking_parameters():
#     """
#     Extract necessary booking details from the entire conversation history.
#     """
#     global session_history

#     prompt = (
#         "Extract relevant travel booking details such as destination, "
#         "check-in date, check-out date, budget, hotel rating, and amenities "
#         "from the following conversation. Provide the extracted parameters in JSON format.\n\n"
#         f"Conversation:\n{session_history}"
#     )

#     response = client.chat.completions.create(
#         model=GROQ_MODEL,
#         messages=[{"role": "user", "content": prompt}],
#         temperature=0.7,
#         max_tokens=200
#     )

#     extracted_params = response.choices[0].message.content.strip()
#     return extracted_params

# def search_hotels(parameters):
#     """
#     Calls the TBO API to search for hotels based on extracted parameters.
#     """
#     payload = {
#         "Destination": parameters.get("destination"),
#         "CheckInDate": parameters.get("check_in_date"),
#         "CheckOutDate": parameters.get("check_out_date"),
#         "Budget": parameters.get("budget"),
#         "Rating": parameters.get("hotel_rating"),
#         "Amenities": parameters.get("amenities")
#     }

#     try:
#         response = requests.post(TBO_API_URL, headers=HEADERS, json=payload)
#         response.raise_for_status()
#         return response.json()
#     except requests.exceptions.RequestException as e:
#         return {"error": f"Failed to fetch hotel data: {e}"}

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

#         # Analyze user's intent (suggestions, booking, clarifications)
#         decision = analyze_intent(user_input)
        
#         if decision == "suggest":
#             bot_response = "Sure! Here are some travel suggestions for you. Would you like to explore beach destinations or cultural cities?"
#         elif decision == "book":
#             extracted_info = extract_booking_parameters()
#             session_history += f"Bot: Extracted booking parameters: {extracted_info}\n"
            
#             # Show the extracted details to the user for confirmation
#             print(f"Here are the extracted details:\n{extracted_info}")
#             confirmation = input("Do you confirm these details? (yes/no): ")

#             if confirmation.lower() == "yes":
#                 params = json.loads(extracted_info)
#                 hotel_results = search_hotels(params)
#                 print("Here are some hotel options for you:")
#                 print(json.dumps(hotel_results, indent=2))
#                 break
#             else:
#                 bot_response = "Please provide the missing or incorrect details."
#         else:
#             bot_response = "Could you clarify your request further?"

#         # Append bot response to session history
#         session_history += f"Bot: {bot_response}\n"
#         print(f"Bot: {bot_response}")

# if __name__ == "__main__":
#     chatbot()





import json
from groq import Groq
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

newTBOfeedback = FastAPI()

# CORS middleware setup
origins = [
    "http://localhost",  # Allow your frontend (if it runs on localhost)
    "http://localhost:3000",  # React (or any other frontend) running on a different port
    "*",  # To allow all origins (use with caution in production)
]

newTBOfeedback.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Allows the specified origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods
    allow_headers=["*"],  # Allows all headers
)

# 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
# GROQ API credentials
GROQ_API_KEY = "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"
GROQ_MODEL = "llama-3.3-70b-versatile"

# Initialize GROQ API client
client = Groq(api_key=GROQ_API_KEY)

# Session string to hold entire conversation
session_history = "User-Bot Conversation History:\n"

# Request body structure for the user's input
class UserInput(BaseModel):
    text: str

def chat_with_llm(user_input):
    """
    Process the user's input using LLM to determine the next action and provide responses.
    """
    global session_history
    session_history += f"User: {user_input}\n"

    prompt = (
        "use to the point and concise, easy-to-understand language"
        "note that the user may only ask for simple things like just book something, then don't unnecessarily extend the conversation and just ask for crucial parameters"
        "but if user asks for suggestions or if is ot sure about something then suggest"
        "Based on the following conversation, continue the discussion to help the user finalize travel details. "
        "Guide the user by suggesting destinations, asking for required inputs, and extracting final preferences when ready. "
        "Keep adding the information to the json format parameters if you feel that the user has confirmed something also note that we may change this parameter later"
        "the parameters can be destination, check_in_date, check_out_date, budget, hotel_rating, amenities"
        "If enough information is provided, extract and summarize travel preferences in JSON format.\n\n"
        f"Conversation:\n{session_history}"
    )

    response = client.chat.completions.create(
        model=GROQ_MODEL,
        messages=[{"role": "user", "content": prompt}],
        temperature=1,
        max_tokens=1024,
        top_p=1,
        stream=False
        
    )

    bot_response = response.choices[0].message.content.strip()
    session_history += f"Bot: {bot_response}\n"
    return bot_response

@newTBOfeedback.post("/")
def chatbot(input: UserInput):
    """
    Main chatbot loop to interact with the user.
    """
    global session_history
    print("Welcome to the Travel Chatbot! Type 'exit' to end the session.")

    while True:

        user_input = input.text
        # user_input = input("You: ")
        if user_input.lower() in ["exit", "quit"]:
            print("Goodbye! Hope to assist you again.")
            break

        bot_response = chat_with_llm(user_input)

        if bot_response.lower().startswith("{") and bot_response.lower().endswith("}"):
            # If LLM provides structured JSON response, extract parameters
            try:
                travel_params = json.loads(bot_response)
                print(f"Here are the extracted details:\n{json.dumps(travel_params, indent=2)}")
                confirmation = input("Do you confirm these details? (yes/no): ")

                if confirmation.lower() == "yes":
                    print("Great! Your travel preferences have been finalized.")
                    break
                else:
                    print("Please provide missing or updated details.")
            except json.JSONDecodeError:
                print("Invalid response received. Continuing the conversation.")
        else:
            print(f"Bot: {bot_response}")

        # Return the bot's response to the frontend
        return {"response": bot_response}


if __name__ == "__main__":
    chatbot()