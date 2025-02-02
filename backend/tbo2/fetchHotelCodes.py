import requests
from requests.auth import HTTPBasicAuth

api_endpoint = "https://api.tbotechnology.in/TBOHolidays_HotelAPI/TBOHotelCodeList"  
username = "hackathontest" 
password = "Hac@98910186"  

def extract_hotel_codes(city_code):
    payload = {
        'CityCode': city_code,
        'isDetailedResponse': False 
    }
    try:
        response = requests.post(api_endpoint, json=payload, auth=HTTPBasicAuth(username, password))

        if response.status_code == 200:
            try:
                # Parse the JSON response
                response_data = response.json()  # This will convert the JSON response to a Python dictionary
                hotels = response_data['Hotels']
                hotel_codes_list = [hotel["HotelCode"] for hotel in hotels]
                hotel_codes = ", ".join(hotel_codes_list)  # Join the codes into a comma-separated string
                return hotel_codes
            
            except ValueError as e:
                print(f"Error parsing JSON: {e}")
           
    except requests.exceptions.RequestException as e:
        print(f"An error occurred: {e}")
    return None

#Test
# print(extract_hotel_codes("130452"))
