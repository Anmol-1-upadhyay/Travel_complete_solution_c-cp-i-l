import requests
import json
import os
from fastapi import FastAPI, File, UploadFile, APIRouter
import shutil
from pydantic import BaseModel

image_router = APIRouter()

def save_image_for_city(city_code, image_file: UploadFile):
    # Directory to save the image
    input_images_folder = "tests"
    os.makedirs(input_images_folder, exist_ok=True)

    # Generate the image filename
    image_filename = f"{city_code}_1.jpg"
    image_path = os.path.join(input_images_folder, image_filename)

    # Save the image to the specified path
    try:
         # Open the file in write-binary mode and save the content from the UploadFile
        with open(image_path, "wb") as buffer:
            shutil.copyfileobj(image_file.file, buffer)
        print(f"Image saved as {image_filename} in {input_images_folder} folder.")
    except Exception as e:
        print(f"Error saving image: {e}")

# Request body structure for the user's input
class UserInput(BaseModel):
    text: str

@image_router.post("/")
async def download_hotel_images(city_code: str, image: UploadFile = File(...)):

    save_image_for_city(city_code, image)

    # API Credentials
    username = "hackathontest"
    password = "Hac@98910186"

    # API Endpoints
    city_codes_url = "https://api.tbotechnology.in/TBOHolidays_HotelAPI/CityList"
    hotel_codes_url = "http://api.tbotechnology.in/TBOHolidays_HotelAPI/TBOHotelCodeList"
    hotel_details_url = "http://api.tbotechnology.in/TBOHolidays_HotelAPI/Hoteldetails"

    # Request Headers
    headers = {
        "Content-Type": "application/json",
        "Accept": "application/json"
    }

    payload_for_codes = {
        "CountryCode": "IN",
        "IsDetailedResponse": "true",
        "Language": "en"
    }

    # response_for_codes = requests.post(city_codes_url, headers=headers, json=payload_for_codes, auth=(username, password))
    # if response_for_codes.status_code == 200:
    #     city_data = response_for_codes.json()
    #     print(json.dumps(city_data, indent=4))  # Pretty-print JSON response
    # else:
    #     print(f"Error: {response_for_codes.status_code}, Response: {response_for_codes.text}")


    # Define the city code
    # city_code = "138673"  # Example CityCode

    # Step 1: Request to get the total number of hotels (hotel codes)
    payload_for_codes = {
        "CityCode": city_code,
        "IsDetailedResponse": "true",
        "Language": "en"
    }

    # response_for_codes = requests.post(hotel_codes_url, headers=headers, json=payload_for_codes, auth=(username, password))

    # # Dictionary to keep track of downloaded images
    # downloaded_images = {}

    # # Check if the request was successful
    # if response_for_codes.status_code == 200:
    #     hotel_data = response_for_codes.json()
        
    #     hotels = hotel_data.get("Hotels", [])
    #     total_hotels = len(hotels)
    #     print(f"Total number of hotels: {total_hotels}")

    #     # Create a folder for the city if it doesn't exist
    #     city_folder = f"{city_code}"
    #     os.makedirs(city_folder, exist_ok=True)

    #     # Step 2: Process each hotel
    #     for hotel in hotels:
    #         hotel_code = hotel.get('HotelCode', 'UnknownHotel')
            
    #         # Create a folder for each hotel inside the city folder
    #         hotel_folder = os.path.join(city_folder, hotel_code)
    #         os.makedirs(hotel_folder, exist_ok=True)

    #         # Request hotel details
    #         payload_for_details = {
    #             "Hotelcodes": hotel_code,
    #             "Language": "en"
    #         }

    #         response_for_details = requests.post(hotel_details_url, headers=headers, json=payload_for_details, auth=(username, password))

    #         if response_for_details.status_code == 200:
    #             try:
    #                 hotel_details = response_for_details.json()
    #                 hotel_info = hotel_details.get("HotelDetails", [])
                    
    #                 if not hotel_info:
    #                     print(f"Skipping {hotel_code}: No hotel details found.")
    #                     continue

    #                 hotel_images = hotel_info[0].get("Images", [])

    #                 if not hotel_images:
    #                     print(f"Skipping {hotel_code}: No images found.")
    #                     continue

    #                 downloaded_images[hotel_code] = []

    #                 # Step 3: Download images
    #                 for i, image_url in enumerate(hotel_images):
    #                     image_name = f"image_{i + 1}.jpg"
    #                     image_path = os.path.join(hotel_folder, image_name)

    #                     try:
    #                         image_response = requests.get(image_url, timeout=10)

    #                         if image_response.status_code == 200 and image_response.content:
    #                             # Check for valid image content
    #                             if len(image_response.content) < 100:  # Ignore empty or corrupted images
    #                                 print(f"Skipping {image_url}: Corrupted or empty image.")
    #                                 continue

    #                             with open(image_path, 'wb') as img_file:
    #                                 img_file.write(image_response.content)

    #                             downloaded_images[hotel_code].append(image_name)
    #                             print(f"Downloaded {image_name} for hotel {hotel_code}")
    #                         else:
    #                             print(f"Error downloading {image_url} for hotel {hotel_code}")

    #                     except Exception as e:
    #                         print(f"Error downloading image {image_url} for hotel {hotel_code}: {e}")

    #             except json.JSONDecodeError:
    #                 print(f"Skipping {hotel_code}: Invalid JSON response.")
    #             except Exception as e:
    #                 print(f"Unexpected error processing {hotel_code}: {e}")

    #         else:
    #             print(f"Error {response_for_details.status_code}: {response_for_details.text}")

    # else:
    #     print(f"Error {response_for_codes.status_code}: {response_for_codes.text}")

    # # Final summary of downloaded images
    # print("\nDownloaded images summary:")
    # for hotel_code, images in downloaded_images.items():
    #     print(f"Hotel {hotel_code}: {len(images)} images downloaded.")


    return {"message": "Images downloaded successfully."}
