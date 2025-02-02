from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.voice import voice_router
from routes.chatbot import chatbot_router
from routes.api import image_router
from routes.f42 import imagesearch_router
# from routes.model import imagedesc_router

chatbotapi = FastAPI()

# CORS middleware setup
origins = [
    "http://localhost",
    "http://localhost:3000",
    "*",
]

chatbotapi.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routes
chatbotapi.include_router(voice_router, prefix="/voice", tags=["Voice"])
chatbotapi.include_router(chatbot_router, prefix="/chatbot", tags=["Chatbot"])
chatbotapi.include_router(image_router, prefix="/image", tags=["Image"])
chatbotapi.include_router(imagesearch_router, prefix="/imagesearch", tags=["ImageSearch"])
# chatbotapi.include_router(imagedesc_router, prefix="/imagedesc", tags=["ImageDesc"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:chatbotapi", host="0.0.0.0", port=8000, reload=True)
