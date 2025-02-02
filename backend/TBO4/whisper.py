import whisper
import warnings

# Suppress specific warnings
warnings.filterwarnings("ignore", category=UserWarning)  # Ignores all UserWarnings
warnings.filterwarnings("ignore", category=FutureWarning)  # Ignores all FutureWarnings

def transcribe_audio(audio_path):
    # Load the Whisper model (choose model size: tiny, base, small, medium, large)
    model = whisper.load_model("small")

    # Transcribe the audio file
    result = model.transcribe(audio_path)

    # Store the transcribed text in a string
    transcription_text = result["text"]

    return transcription_text

# Path to your audio file
audio_file = "recording.mp3"  # Ensure the path is correct

# Transcribe the audio and store the result
transcription = transcribe_audio(audio_file)

# Print the stored transcription
print(transcription)
