import axios from "axios";
import cityData from "../data/citycodes.json"; // Import city JSON file
import useParamsStore from "../store/store";

interface FetchRoomsParams {
  checkIn: string;
  checkOut: string;
  rooms: number;
  adults: number;
  children: number;
  childrenAges?: number[];
}

const getCityCode = (cityName: string): string | null => {
  const city = cityData.find(
    // (c) => c.Name.toLowerCase() === cityName.toLowerCase()
    (c) => c.Name.toLowerCase().includes(cityName.toLowerCase())
  );
  return city ? city.Code : null;
};

const fetchHotelsByCityCode = async (cityCode: string) => {
  try {
    const response = await axios.post(
    //   "http://api.tbotechnology.in/TBOHolidays_HotelAPI/TBOHotelCodeList",
    "/api/rooms",
    {
        "CityCode": cityCode,
        "IsDetailedResponse": "false"
    },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${btoa("hackathontest:Hac@98910186")}`
        }
      }
    );
    console.log("response:", response.data);
    return response.data.Hotels || [];
  } catch (error) {
    if (error instanceof Error) {
        console.error("Error fetching room data:", error.message);
        throw error;
      } else {
        console.error("Unknown error fetching room data:", error);
        throw new Error("An unknown error occurred.");
      }
  }
};

const fetchRooms = async ({
  checkIn,
  checkOut,
  rooms,
  adults,
  children,
  childrenAges = []
}: FetchRoomsParams, hotelCodes: string[]) => {
  try {
    const requestBody = {
      CheckIn: checkIn,
      CheckOut: checkOut,
      HotelCodes: hotelCodes.join(","), // Join hotel codes into a string
      GuestNationality: "IN",
      PaxRooms: [
        {
          Adults: adults,
          Children: children,
          ChildrenAges: childrenAges
        }
      ],
      ResponseTime: 23.0,
      IsDetailedResponse: false,
      Filters: {
        Refundable: false,
        NoOfRooms: rooms,
        MealType: "All"
      }
    };

    const response = await axios.post(
        // "http://api.tbotechnology.in/TBOHolidays_HotelAPI/search",
        "/search",
    requestBody, 
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${btoa("hackathontest:Hac@98910186")}`
      }
    });

    return response.data;
  } catch (error) {
    if (error instanceof Error) {
        console.error("Error fetching room data:", error.message);
        throw error;
      } else {
        console.error("Unknown error fetching room data:", error);
        throw new Error("An unknown error occurred.");
      }
  }
};

const handleSearch = async (cityName: string, fetchParams: FetchRoomsParams) => {

  try {
    // Get city code
    const cityCode = getCityCode(cityName);
    if (!cityCode) {
      console.error("City not found");
      return;
    }

    console.log("fetchParams:", fetchParams);

    // Fetch hotels in the city
    const hotels = await fetchHotelsByCityCode(cityCode);
    const hotelCodes = hotels.map((hotel: any) => hotel.HotelCode);

    if (hotelCodes.length === 0) {
      console.log("No hotels found in the selected city.");
      return;
    }

    // Fetch available rooms for the hotels
    const roomsData = await fetchRooms(fetchParams, hotelCodes);
    console.log("herex:", roomsData);

    // Step 2: Extract hotel codes from the JSON response
    const availablehotelCodes = roomsData.HotelResult.map((hotel: { HotelCode: string }) => hotel.HotelCode);
    console.log("here2:", availablehotelCodes);

    const detailResponse = await axios.post(
      // 'http://api.tbotechnology.in/TBOHolidays_HotelAPI/Hoteldetails', 
      "/hoteldetails",
      {
        Hotelcodes: availablehotelCodes.join(','),
        Language: 'en',
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${btoa("hackathontest:Hac@98910186")}`
        }
      }
    );
    // console.log("Available rooms:", roomsData);
    console.log("here3:", detailResponse);

    // setavaiRooms(roomsData.HotelResult);
    // return detailResponse.data.HotelDetails;
    // return roomsData.HotelResult;

    const hotelDetails = detailResponse.data.HotelDetails;

    // Create a map of HotelDetails by HotelCode for quick lookup
    const hotelDetailsMap = hotelDetails.reduce((acc: any, detail: any) => {
      acc[detail.HotelCode] = detail;
      return acc;
    }, {});

    // Combine the data from roomsData and hotelDetails
    const combinedData = roomsData.HotelResult.map((room: any) => ({
      ...room,
      HotelDetails: hotelDetailsMap[room.HotelCode] || null, // Add matching hotel details or null if not found
    }));

    console.log("Combined data:", combinedData);

    return combinedData;
    
  } catch (error) {
    if (error instanceof Error) {
        console.error("Error fetching room data:", error.message);
        alert(error)
        throw error;
    } else {
        console.error("Unknown error fetching room data:", error);
        throw new Error("An unknown error occurred.");
    }
  }
};

export default handleSearch;
