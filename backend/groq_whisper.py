from groq import Groq
# from api_key import groq_api_key
from api_key import GROQ_WHISPER_API_KEY

# API_KEY = groq_api_key

# Initialize the Groq client with the API key
client = Groq(api_key=GROQ_WHISPER_API_KEY)

# Specify the path to the audio file
filename = "recording.mp3"  # Replace with the path to your audio file

try:
    # Open the audio file
    with open(filename, "rb") as file:
        # Create a transcription of the audio file
        transcription = client.audio.transcriptions.create(
            file=(filename, file.read()),  # Required audio file
            model="whisper-large-v3",  # Specify the correct model
            prompt="Specify context or spelling",  # Optional
            response_format="json",  # Optional
            temperature=0.0  # Optional
        )
        # Print the transcription text
        print("Transcription Text:", transcription.text)
except Exception as e:
    print(f"An error occurred: {e}")
