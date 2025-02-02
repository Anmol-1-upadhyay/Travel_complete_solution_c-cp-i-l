from llava.model.builder import load_pretrained_model
from llava.mm_utils import process_images, tokenizer_image_token
from llava.constants import IMAGE_TOKEN_INDEX, DEFAULT_IMAGE_TOKEN
from llava.conversation import conv_templates
from PIL import Image
import copy
import torch
import warnings
from groq import Groq

print("1")
warnings.filterwarnings("ignore")

# Initialize Groq client
client = Groq(
    api_key="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",
)

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
print("2")

model.eval()
print("3")

# Process the image
image_path = "test3.png"
image = Image.open(image_path)
image_tensor = process_images([image], image_processor, model.config)
image_tensor = [_image.to(dtype=torch.float16, device=device) for _image in image_tensor]

print("4")

# Create the conversation template
conv_template = "qwen_1_5"  # Make sure you use correct chat template for different models
question = DEFAULT_IMAGE_TOKEN + "\nDescribe the image?"
conv = copy.deepcopy(conv_templates[conv_template])
conv.append_message(conv.roles[0], question)
conv.append_message(conv.roles[1], None)
prompt_question = conv.get_prompt()

# Tokenize the input
input_ids = tokenizer_image_token(prompt_question, tokenizer, IMAGE_TOKEN_INDEX, return_tensors="pt").unsqueeze(0).to(device)
image_sizes = [image.size]

print("5")
# Generate output from Llava model
cont = model.generate(
    input_ids,
    images=image_tensor,
    image_sizes=image_sizes,
    do_sample=False,
    temperature=0,
    max_new_tokens=4096,
)
print("6")
text_outputs = tokenizer.batch_decode(cont, skip_special_tokens=True)
description = text_outputs[0]  # Assuming the first output contains the description
print("Model Output:", description)
print("7")