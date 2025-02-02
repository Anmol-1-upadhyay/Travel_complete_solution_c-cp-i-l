# from groq import Groq
# from fastapi import FastAPI, File, UploadFile

# app = FastAPI()

# # Set the API key either directly or via environment variable
# API_KEY = "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"  # Replace with your actual API key

# # Initialize the Groq client with the API key
# client = Groq(api_key=API_KEY)

# Specify the path to the audio file
# filename = "5.mp3"  # Replace with the path to your audio file

# @app.post("/transcribe/")
# async def transcribe_audio(file: UploadFile = File(...)):
#     try:

#         # Open the audio file
#         with open(filename, "rb") as file:
#             # Create a transcription of the audio file
#             transcription = client.audio.transcriptions.create(
#                 file=(filename, file.read()),  # Required audio file
#                 model="whisper-large-v3",  # Specify the correct model
#                 prompt="Specify context or spelling",  # Optional
#                 response_format="json",  # Optional
#                 temperature=0.0  # Optional
#             )
#             # Print the transcription text
#             print("Transcription Text:", transcription.text)

#             # Return the transcription text as a response
#             return {"transcription": transcription.text}
#     except Exception as e:
#         print(f"An error occurred: {e}")
#         # Handle any errors that occur during the process
#         return {"error": str(e)}




from fastapi import FastAPI, File, UploadFile, APIRouter
from groq import Groq
from fastapi.middleware.cors import CORSMiddleware
from routes.chatbot import chatbot
from api_key import GROQ_WHISPER_API_KEY

voice_router = APIRouter()

# Initialize FastAPI app
# voicebot = FastAPI()

# # CORS middleware setup
# origins = [
#     "http://localhost",  # Allow your frontend (if it runs on localhost)
#     "http://localhost:3000",  # React (or any other frontend) running on a different port
#     "*",  # To allow all origins (use with caution in production)
# ]

# voicebot.add_middleware(
#     CORSMiddleware,
#     allow_origins=origins,  # Allows the specified origins
#     allow_credentials=True,
#     allow_methods=["*"],  # Allows all HTTP methods
#     allow_headers=["*"],  # Allows all headers
# )

# Set the API key either directly or via environment variable
# API_KEY = "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"  # Replace with your actual API key

# Initialize the Groq client with the API key
# client = Groq(api_key=API_KEY)
client = Groq(api_key=GROQ_WHISPER_API_KEY)

@voice_router.post("/")
async def transcribe_audio(file: UploadFile = File(...)):
    try:
        # Check that the uploaded file is an MP3 file
        # if file.content_type != "audio/mpeg":
        #     return {"error": "Please upload a valid MP3 file."}

        # Read the uploaded audio file
        contents = await file.read()

        # Use Groq to transcribe the audio (sending the MP3 content)
        transcription = client.audio.transcriptions.create(
            file=("audio.mp3", contents),  # Send the MP3 file content to Groq
            model="whisper-large-v3",  # Specify the transcription model
            prompt="Specify context or spelling",  # Optional prompt
            response_format="json",  # Get JSON response
            temperature=0.0  # Optional: Set transcription temperature
        )

        print("Transcription..", transcription)


        # # Get the transcribed text
        # transcribed_text = transcription.text
        # print("Transcription..", transcription)

        # Pass the transcription text to the chatbot function and get a response
        chatbot_response = chatbot(transcription)
        print("Chatbot Response..", chatbot_response)
        # if(chatbot_response["combined_data"]):
        #     print("Chatbot Response..", chatbot_response["combined_data"])

        # Return the chatbot response to the frontend
        return {"transcription": transcription.text, "chatbot_response": chatbot_response}


    except Exception as e:
        # Handle any errors that occur during the process
        return {"error": str(e)}