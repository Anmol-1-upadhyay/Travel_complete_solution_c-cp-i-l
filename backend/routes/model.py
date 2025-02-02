# from flask import Flask, request, jsonify
from typing import List
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, APIRouter
from PIL import Image
import torch
from llava.model.builder import load_pretrained_model
from llava.mm_utils import process_images, tokenizer_image_token
from llava.constants import IMAGE_TOKEN_INDEX, DEFAULT_IMAGE_TOKEN
from llava.conversation import conv_templates
import copy
import os
from routes.chatbot import chatbot

# Initialize Flask app
# app = Flask(__name__)
# app = FastAPI()
imagedesc_router = APIRouter()


# # CORS middleware setup
# origins = [
#     "http://localhost",
#     "http://localhost:3000",
#     "*",
# ]

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=origins,
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# Load the pretrained Llava model
pretrained = "lmms-lab/llava-onevision-qwen2-0.5b-si"
model_name = "llava_qwen"
device = "cuda"
device_map = "auto"
llava_model_args = {
    "multimodal": True,
    "attn_implementation": "sdpa",
}

tokenizer, model, image_processor, max_length = load_pretrained_model(
    pretrained, None, model_name, device_map=device_map, **llava_model_args
)

model.eval()

# Process the image
def process_image(image_path):
    image = Image.open(image_path)
    image_tensor = process_images([image], image_processor, model.config)
    # device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    image_tensor = [_image.to(dtype=torch.float16, device=device) for _image in image_tensor]

    # image_tensor = [_image.to(dtype=torch.float16, device=device) for _image in image_tensor]
    return image_tensor

# Generate description from the model
def generate_description(image, image_tensor):
    # Create the conversation template
    conv_template = "qwen_1_5"
    question = DEFAULT_IMAGE_TOKEN + "\nDescribe the image and scene shown in it (examples - beaches, hills, mountain ,snow)."
    conv = copy.deepcopy(conv_templates[conv_template])
    conv.append_message(conv.roles[0], question)
    conv.append_message(conv.roles[1], None)
    prompt_question = conv.get_prompt()

    # device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

    # Tokenize the input
    input_ids = tokenizer_image_token(prompt_question, tokenizer, IMAGE_TOKEN_INDEX, return_tensors="pt").unsqueeze(0).to(device)
    image_sizes = [image.size]

    # Generate output from Llava model
    cont = model.generate(
        input_ids,
        images=image_tensor,
        image_sizes=image_sizes,
        do_sample=False,
        temperature=0,
        max_new_tokens=4096,
    )
    text_outputs = tokenizer.batch_decode(cont, skip_special_tokens=True)
    description = text_outputs[0]  # Assuming the first output contains the description
    return description



# # API endpoint to upload images
# @app.route('/upload_images', methods=['POST'])
# def upload_images():
#     if 'images' not in request.files:
#         return jsonify({"error": "No images found"}), 400
    
#     images = request.files.getlist('images')
#     descriptions = []
    
#     for image_file in images:
#         image_path = os.path.join('uploads', image_file.filename)
#         image_file.save(image_path)
#         image = Image.open(image_path)
#         image_tensor = process_image(image_path)
#         description = generate_description(image, image_tensor)
#         descriptions.append(description)
    
#     return jsonify({"descriptions": descriptions}), 200

# Run the Flask app
# if __name__ == '__main__':
#     app.run(debug=False, host='0.0.0.0', port=5000)


@imagedesc_router.post("/")
async def upload_images(images: List[UploadFile] = File(...)):
    if not images:
        raise HTTPException(status_code=400, detail="No images found")
    
    descriptions = []
    
    for image_file in images:
        # Save the image to a file
        image_path = os.path.join('uploads', image_file.filename)
        with open(image_path, "wb") as buffer:
            buffer.write(await image_file.read())
        
        # Open image and process it
        image = Image.open(image_path)
        image_tensor = process_image(image_path)
        description = generate_description(image, image_tensor)
        descriptions.append(description)
    
    # chatbot_response = chatbot(descriptions[0])
    # print("Chatbot Response for image description..", chatbot_response)
    
    # return {"descriptions": descriptions, "chatbot_response": chatbot_response}
    return {"descriptions": descriptions}

# # Run the FastAPI app
# if __name__ == '__main__':
#     import uvicorn
#     uvicorn.run(app, host="0.0.0.0", port=5000)
