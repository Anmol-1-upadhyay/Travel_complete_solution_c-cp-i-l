import requests
from requests.auth import HTTPBasicAuth
import re  

api_endpoint = "https://api.tbotechnology.in/TBOHolidays_HotelAPI/CountryList"  
username = "hackathontest" 
password = "Hac@98910186"  


def normalize_country_name(country_name):
    """
    Normalize the country name by removing extra spaces, commas, and normalizing multiple spaces.
    Also, removes everything inside square or round brackets.
    """
    country_name = country_name.strip().lower()  # Remove leading/trailing spaces and convert to lowercase
    country_name = re.sub(r'\s+', ' ', country_name)  # Replace multiple spaces with a single space
    country_name = re.sub(r'\[.*?\]|\(.*?\)', '', country_name)  # Remove everything inside square or round brackets
    country_name = country_name.strip()  # Remove any leading/trailing spaces that might be left after removing brackets
    return country_name


def get_country_code(country_name, country_data):
    # Normalize the input country name
    country_name = normalize_country_name(country_name)

    # Check if 'CountryList' exists and iterate through it to match the country name
    if 'CountryList' in country_data:
        for country in country_data['CountryList']:
            # Normalize the country name from the response
            response_country_name = normalize_country_name(country['Name'])
            
            # Check if there's a partial match (to handle cases where the input is a substring of the full name)
            # Checking if the normalized country name from input contains the response country's name (and vice versa)
            if response_country_name in country_name or country_name in response_country_name:
                return country['Code']
    
    return "Country not found"

def extract_country_code(country_name):
    try:
        response = requests.get(api_endpoint, auth=HTTPBasicAuth(username, password))

        # Check if the request was successful
        if response.status_code == 200:
            # Parse the JSON response
            response_data = response.json()  # This will convert the JSON response to a Python dictionary
            return get_country_code(country_name, response_data)

    except requests.exceptions.RequestException as e:
        print(f"An error occurred: {e}")

# Test the function with several countries
# countries_to_test = [
#     "United States of America",
#     "United States (USA)",
#     "United States",
#     "Canada",
#     "Mexico",
#     "Germany",
#     "United Kingdom",
#     "France",
#     "India",
#     "Australia",
#     "Brazil",
#     "Ireland"
# ]

# for country_name in countries_to_test:
#     country_code = extract_country_code(country_name)
#     print(f"The country code for '{country_name}' is: {country_code}")


#country_codes={"albania": "AL", "andorra": "AD", "antigua": "AG", "argentina": "AR", "aruba": "AW", "australia": "AU", "austria": "AT", "azerbaijan": "AZ", "bahamas": "BS", "bahrain": "BH", "barbados": "BB", "belarus": "BY", "belgium": "BE", "bolivia": "BO", "bosnia herzegovina": "BA", "botswana": "BW", "brazil": "BR", "brunei darussalam": "BN", "bulgaria": "BG", "cambodia": "KH", "cameroon": "CM", "canada": "CA", "chile": "CL", "china": "CN", "colombia": "CO", "cook islands": "CK", "costa rica": "CR", "croatia": "HR", "cyprus": "CY", "czech republic": "CZ", "denmark": "DK", "dominican republic": "DO", "ecuador": "EC", "egypt": "EG", "estonia": "EE", "ethiopia": "ET", "fiji": "FJ", "finland": "FI", "france": "FR", "french polynesia": "PF", "germany": "DE", "gibraltar": "GI", "greece": "GR", "grenada": "GD", "guadeloupe": "GP", "guam": "GU", "guatemala": "GT", "hong kong": "HK", "hungary": "HU", "iceland": "IS", "india": "IN", "indonesia": "ID", "ireland(republic of)": "IE", "israel": "IL", "italy": "IT", "jamaica": "JM", "japan": "JP", "jordan": "JO", "kenya": "KE", "kuwait": "KW", "laos": "LA", "latvia": "LV", "lebanon": "LB", "libya": "LY", "liechtenstein": "LI", "lithuania": "LT", "luxembourg": "LU", "macau": "MO", "malaysia": "MY", "malta": "MT", "mauritius": "MU", "mexico": "MX", "monaco": "MC", "mongolia": "MN", "morocco": "MA", "myanmar": "MM", "namibia": "NA", "nepal": "NP", "netherlands": "NL", "netherlands antilles": "AN", "new caledonia": "NC", "new zealand": "NZ", "nigeria": "NG", "northern mariana isl": "MP", "norway": "NO", "oman": "OM", "palau": "PW", "panama": "PA", "paraguay": "PY", "peru": "PE", "philippines": "PH", "poland": "PL", "portugal": "PT", "puerto rico": "PR", "qatar": "QA", "romania": "RO", "russia": "RU", "russian federation": "RU", "samoa": "WS", "san marino": "SM", "saudi arabia": "SA", "senegal": "SN", "serbia": "RS", "seychelles": "SC", "singapore": "SG", "slovakia": "SK", "slovenia": "SI", "south africa": "ZA", "south korea": "KR", "spain": "ES", "sri lanka": "LK", "st kitts & nevis": "KN", "st lucia": "LC", "st vincent & grenadi": "VC", "swaziland": "SZ", "sweden": "SE", "switzerland": "CH", "taiwan": "TW", "thailand": "TH", "trinidad & tobago": "TT", "tunisia": "TN", "turkey": "TR", "uganda": "UG", "ukraine": "UA", "united arab emirates": "AE", "united kingdom": "GB", "united states": "US", "uruguay": "UY", "venezuela": "VE", "vietnam": "VN", "zimbabwe": "ZW"}
