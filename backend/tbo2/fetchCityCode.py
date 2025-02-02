import requests
from requests.auth import HTTPBasicAuth
import re 

api_endpoint = "https://api.tbotechnology.in/TBOHolidays_HotelAPI/CityList"  
username = "hackathontest" 
password = "Hac@98910186"  


def normalize_city_name(city_name):
    """
    Normalize the city name by removing extra spaces, commas, and normalizing multiple spaces.
    Also, removes everything after the first comma and everything inside brackets.
    """
    city_name = city_name.strip().lower()  # Remove leading/trailing spaces and convert to lowercase
    city_name = city_name.split(",")[0].strip()  # Remove everything after the first comma
    city_name = re.sub(r'\s+', ' ', city_name)  # Replace multiple spaces with a single space
    city_name = re.sub(r'\[.*?\]|\(.*?\)', '', city_name)  # Remove everything inside square or round brackets
    city_name = city_name.strip()  # Remove any leading/trailing spaces that might be left after removing brackets
    return city_name

def get_city_code(city_name, city_data):
    # Normalize the input city name
    city_name = normalize_city_name(city_name)

    # Check if 'CityList' exists and iterate through it to match the city name
    if 'CityList' in city_data:
        for city in city_data['CityList']:
            # Normalize the city name from the response
            response_city_name = normalize_city_name(city['Name'])
            
            # Check if the input city name partially matches the stored name (case insensitive)
            if city_name in response_city_name or response_city_name in city_name:
                return city['Code']
    
    return "City not found"


def extract_city_code(city_name,country_code):

    # payload to send in the body of the POST request
    payload = {
        'CountryCode': country_code 
    }

    # Sending POST request with Basic Authentication and the payload
    try:
        response = requests.post(api_endpoint, json=payload, auth=HTTPBasicAuth(username, password))

        # Check if the request was successful
        if response.status_code == 200:
            # Parse the JSON response
            response_data = response.json()  # This will convert the JSON response to a Python dictionary
            return get_city_code(city_name,response_data)
        
    except requests.exceptions.RequestException as e:
        print(f"An error occurred: {e}")


# Test the function 

# city_name = "New York"
# city_code = extract_city_code(city_name, "US")
# print(f"The city code for '{city_name}' is: {city_code}")

# city_name = "New York, New York"
# city_code = extract_city_code(city_name, "US")
# print(f"The city code for '{city_name}' is: {city_code}")

# city_name = "San Francisco"
# city_code = extract_city_code(city_name, "US")
# print(f"The city code for '{city_name}' is: {city_code}")

# city_name = "Chicago"
# city_code = extract_city_code(city_name, "US")
# print(f"The city code for '{city_name}' is: {city_code}")

# city_name = "Houston"
# city_code = extract_city_code(city_name, "US")
# print(f"The city code for '{city_name}' is: {city_code}")

# city_name = "Miami"
# city_code = extract_city_code(city_name, "US")
# print(f"The city code for '{city_name}' is: {city_code}")
