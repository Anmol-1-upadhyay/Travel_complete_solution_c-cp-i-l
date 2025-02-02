# import json
# import re
# from groq import Groq
# from fastapi import FastAPI, APIRouter
# from fastapi.middleware.cors import CORSMiddleware
# from pydantic import BaseModel

# # chatbot_router = APIRouter()
# # chatbotapi = FastAPI()

# # # CORS middleware setup
# # origins = [
# #     "http://localhost",  # Allow your frontend (if it runs on localhost)
# #     "http://localhost:3000",  # React (or any other frontend) running on a different port
# #     "*",  # To allow all origins (use with caution in production)
# # ]

# # chatbotapi.add_middleware(
# #     CORSMiddleware,
# #     allow_origins=origins,  # Allows the specified origins
# #     allow_credentials=True,
# #     allow_methods=["*"],  # Allows all HTTP methods
# #     allow_headers=["*"],  # Allows all headers
# # )

# GROQ_API_KEY = "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"
# GROQ_MODEL = "llama-3.3-70b-versatile"

# # Initialize GROQ API client
# client = Groq(api_key=GROQ_API_KEY)

# # Session string to hold entire conversation
# session_history = "User-Bot Conversation History:\n"

# travel_preferences = {}

# # # Request body structure for the user's input
# # class UserInput(BaseModel):
# #     text: str

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
#         "The 'check-in date' parameter should indicate the specific date (day, month, and year) when a guest intends to arrive at the hotel or accommodation to start their stay. If the user provides relative inputs such as 'next Monday', 'next week', 'next month', 'next year' or mentions a festival day, calculate the exact date based on today's date. Confirm the calculated date with the user to ensure accuracy. Once confirmed, store the date in the format day-month-year."
#         "The 'check-out date' parameter should specify the exact date (day, month, and year) when a guest plans to leave the hotel or accommodation at the end of their stay. If the user provides relative inputs such as 'next Friday', 'after two weeks', 'end of next month', 'next year' or mentions a festival day, calculate the corresponding date based on today's date and the specified duration of the stay. Confirm the calculated date with the user to ensure it aligns with their intent. Once confirmed, store the date in the format day-month-year."
#         "'Number of Adults' parameter should reflect the number of Adults travelling. It should be a positive integer. "
#         "'Number of Children' parameter should reflect the number of Children travelling. It should be a non negative integer. "
#         "'Children Ages' parameter should reflect the ages of Children travelling(ask only if number of children are non zero). It should be a non negative integer. "
#         "'Number of Rooms' parameter should reflect the number of Rooms required. It should be a non negative integer. "
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

# # @chatbot_router.post("/")
# def chatbot():
#     """
#     Main chatbot loop to interact with the user.
#     """
#     global session_history
#     print("Welcome to the Travel Chatbot! Type 'exit' to end the session.")
#     print(input)

#     while True:
#         user_input = input.text
#         # user_input = input("You: ")
#         if user_input.lower() in ["exit", "quit"]:
#             print("Goodbye! Hope to assist you again.")
#             break

#         bot_response = chat_with_llm(user_input)

#         if bot_response.lower() == "done":
#                 # Ask the bot to provide travel details in a structured format
#                 prompt_for_details = (
#                     "Provide travel details strictly in a dictionary format as follows. Do not include any additional text or explanation, only the dictionary:\n"
#                     "['destination: city_name', 'check_in: day-month-year', 'check_out: day-month-year', "
#                     "'Adults: a positive integer', 'Children: a non negative integer, 'ChildrenAges: a non negative integer'"
#                     "'NoOfRooms: a non negative integer\n"
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
#                 print(travel_preferences)
#                 break
#         else:
#             print(f"Bot: {bot_response}")

#         # Return the bot's response to the frontend
#         return {"response": bot_response}

# if __name__ == "__main__":
#     chatbot()