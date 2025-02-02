import { useState } from "react";
import handleSearch from "../api/searchrooms";
import useParamsStore from "../store/store";
import HotelList from "./hotellist"; // Import the HotelList component
import axios from "axios";
import cityData from "../data/citycodes.json"; // Import city JSON file
import { Loader2 } from "lucide-react";

const SearchForm = () => {
  const { dateRange, setDateRange } = useParamsStore();
  // const {rooms, setRooms} = useParamsStore();
  // const {adults, setAdults} = useParamsStore();
  // const {children, setChildren} = useParamsStore();
  const { cityName, setCityName } = useParamsStore();
  const { rooms, incrementRooms, decrementRooms } = useParamsStore();
  const { adults, incrementAdults, decrementAdults } = useParamsStore();
  const { children, incrementChildren, decrementChildren } = useParamsStore();
  const {
    childrenAges,
    setChildrenAges,
    // incrementChildAge,
    // decrementChildAge,
  } = useParamsStore();
  // const [hotels, setHotels] = useState<any[]>([]); // State to store detailed hotel data
  const { hotels, setHotels } = useParamsStore();
  // const { allHotels, setallHotels } = useParamsStore();
  // const { avairooms, setavaiRooms } = useParamsStore();

  // Handle adding or subtracting children
  // const handleIncrementChild = () => {
  //   incrementChildren; // Increase local children count
  //   incrementChildAge(); // Increase all children's age in the store
  // };

  // const handleDecrementChild = () => {
  //   if (children > 0) {
  //     decrementChildren; // Decrease local children count
  //     decrementChildAge(); // Decrease all children's age in the store
  //   }
  // };

  // Handle updating the age of a specific child
  const handleChildAgeChange = (index: number, age: number) => {
    const updatedAges = [...childrenAges];
    updatedAges[index] = age;
    setChildrenAges(updatedAges);
  };

  const [image, setImage] = useState<Blob | null>(null);

  const getCityCode = (cityName: string): string | null => {
    const city = cityData.find(
      // (c) => c.Name.toLowerCase() === cityName.toLowerCase()
      (c) => c.Name.toLowerCase().includes(cityName.toLowerCase())
    );
    return city ? city.Code : null;
  };

  // Handle the file selection
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setisLoadingUploadImage(true);
      const uploadedImage = e.target.files[0];
      console.log("Uploaded image:", uploadedImage);
      setImage(uploadedImage);
      // console.log("image:",image);

      // Convert the uploaded file to a Blob (you can skip this step if you already have a Blob)
      const imageBlob = new Blob([uploadedImage], { type: uploadedImage.type });

      // Create FormData and append the file
      const formData = new FormData();
      // formData.append("city_code", getCityCode(cityName) || "");
      formData.append("image", imageBlob, "image.jpg");

      // Get the city_code (assuming getCityCode returns the correct value)
      const cityCode = getCityCode(cityName) || "";

      // Log the FormData
      formData.forEach((value, key) => {
        console.log("here");
        console.log(key, value);
      });

      try {
        const response = await axios.post(
          `http://127.0.0.1:8000/image?city_code=${cityCode}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        // Send the input text to the API
        // const response = await fetch("http://127.0.0.1:8000/image", {
        //   // Update this URL with your API
        //   method: "POST", // Change the method to POST
        //   headers: {
        //     "Content-Type": "application/json",
        //   },
        //   body: JSON.stringify({ code: getCityCode(cityName), image: uploadedImage }), // Send the input text in the request body
        // });

        console.log("Image uploaded successfully:", response.data);
        setisLoadingUploadImage(false);
        alert("Image uploaded successfully!");
      } catch (error) {
        console.error("Error uploading image:", error);
        setisLoadingUploadImage(false);
        alert("Failed to upload image.");
      }
    }
  };

  // Trigger the file input click when the button is clicked
  const handleButtonClick = () => {
    document.getElementById("imageInput")?.click();
  };

  const handleRoomSearch = async () => {
    if (!isFormValid()) {
      return;
    }
    // const data = {
    //   hotel_code: getCityCode(cityName),
    // };
    const similarityMap: Record<string, number> = {};

    try {
      setisLoadingSearch(true);

      if (image) {
        const response = await axios.post(
          `http://127.0.0.1:8000/imagesearch?hotel_code=${getCityCode(
            cityName
          )}`,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        console.log("response data of image match:", response.data);

        // Similarity data from response
        // const similarityData: Record<string, { score: number, image_paths: any }> =
        //   response.data.results; // Assumes the response includes hotel codes with similarity scores
        const similarityData: Record<string, number> =
          response.data.results;
        console.log("similarityData:", similarityData);

        // Create a similarity map from the response
        // const similarityMap: Record<string, number> = {};

        Object.keys(similarityData).forEach((key) => {
          similarityMap[key] = similarityData[key];
        });
        // similarityMap = similarityData;
        // console.log("Similarity map:", similarityMap);
      }

      console.log("here1");
      const avaihotels = await handleSearch(cityName, {
        checkIn: dateRange.from,
        checkOut: dateRange.to,
        rooms,
        adults,
        children,
        childrenAges,
      });
      console.log("hotels:", avaihotels);
      // console.log("herex:", response);

      // Step 2: Extract hotel codes from the JSON response
      // const hotelCodes = response.data.map((hotel: { hotelCode: string }) => hotel.hotelCode);
      // console.log("here2:", hotelCodes);

      // Step 3: Make a POST request using axios to fetch hotel details in bulk
      // const detailResponse = await axios.post(
      //   // 'http://api.tbotechnology.in/TBOHolidays_HotelAPI/Hoteldetails',
      //   "/hoteldetails",
      //   {
      //     Hotelcodes: hotelCodes.join(','),
      //     Language: 'en',
      //   },
      //   {
      //     headers: {
      //       "Content-Type": "application/json",
      //       Authorization: `Basic ${btoa("hackathontest:Hac@98910186")}`
      //     }
      //   }
      // );
      // console.log("here3:", detailResponse);

      // Step 4: Extract data from the axios response
      // const hotelDetails = detailResponse.data;

      // Step 5: Set the fetched data in state

      // Function to sort hotels by similarity

      const sortHotelsBySimilarity = (hotels: any[], similarityMap: any) => {
        return hotels.sort((a, b) => {
          const similarityA = similarityMap[a.HotelCode] || 0;
          const similarityB = similarityMap[b.HotelCode] || 0;
          return similarityB - similarityA; // Descending order
        });
      };

      // const hotelsWithSimilarity: any = [];
      // if (Object.keys(similarityMap).length !== 0) {
      //   // Add similarity parameter to each hotel
      //   const hotelsWithSimilarity = avaihotels.map((hotel: any) => ({
      //     ...hotel,
      //     similarity: parseFloat(
      //       (similarityMap[hotel.HotelCode] || 0).toFixed(2) // Crop similarity to 2 decimals
      //     ),
      //   }));
      //   console.log("Hotels with similarity:", hotelsWithSimilarity);
      // }

      // Add similarity parameter to each hotel
      const hotelsWithSimilarity = avaihotels.map((hotel: any) => ({
        ...hotel,
        similarity: parseFloat(
          (similarityMap[hotel.HotelCode] || 0).toFixed(2) // Crop similarity to 2 decimals
        ),
      }));
      console.log("Hotels with similarity:", hotelsWithSimilarity);

      // Sort hotels based on similarity
      const sortedHotels = sortHotelsBySimilarity(
        hotelsWithSimilarity,
        similarityMap
      );
      console.log("Hotels after sorting:", sortedHotels);

      // setHotels(avaihotels);
      if (image) {
        setHotels(sortedHotels);
        // setallHotels(avaihotels);
      } else {
        setHotels(avaihotels);
      }
      // setHotels(sortedHotels);
      setisLoadingSearch(false);

      // setavaiRooms(avaihotels);
    } catch (error) {
      alert("Failed to fetch room data. Please try again.");
      setisLoadingSearch(false);
    }
  };

  const [isLoadingSearch, setisLoadingSearch] = useState(false);
  const [isLoadingUploadImage, setisLoadingUploadImage] = useState(false);

  const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format

  // Validation Logic
  const isFormValid = () => {
    if (cityName.trim() === "") {
      alert("Please enter a city name.");
      return false;
    }
    if (dateRange.from === "") {
      alert("Please select a Check In date.");
      return false;
    }
    if (dateRange.from < today) {
      alert("The Check In date cannot be earlier than today.");
      return false;
    }
    if (dateRange.to === "") {
      alert("Please select a Check Out date.");
      return false;
    }
    if (dateRange.to < dateRange.from) {
      alert("The Check Out date cannot be earlier than the Check In date.");
      return false;
    }
    if (rooms === 0) {
      alert("Please select at least one room.");
      return false;
    }
    if (adults === 0) {
      alert("Please select at least one adult.");
      return false;
    }
    return true;
  };

  // const { hotels, setHotels } = useParamsStore();
  // const { allHotels, setallHotels } = useParamsStore();
  // const [showAllHotels, setShowAllHotels] = useState(true);

  return (
    <div>
      <div className="max-w-4xl mx-auto p-6 rounded-lg shadow-lg bg-black/70 text-xs">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <p className="text-white">Destination</p>
            <input
              type="text"
              placeholder="Enter City/Location"
              className="w-full p-3 rounded-lg bg-white"
              value={cityName}
              onChange={(e) => setCityName(e.target.value)}
            />
          </div>
          {/* <input
          type="text"
          placeholder="Destination"
          className="w-full p-3 rounded-lg bg-white"
        /> */}

          <div>
            <p className="text-white">Check In Date</p>
            <input
              type="date"
              className="w-full p-3 rounded-lg bg-white"
              value={dateRange.from}
              onChange={(e) =>
                setDateRange({ ...dateRange, from: e.target.value })
              }
              placeholder="Check-in"
            />
          </div>

          <div>
            <p className="text-white">Check Out Date</p>
            <input
              type="date"
              className="w-full p-3 rounded-lg bg-white"
              value={dateRange.to}
              onChange={(e) =>
                setDateRange({ ...dateRange, to: e.target.value })
              }
              placeholder="Check-out"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-4">
          {/* Number of rooms */}
          <div className="flex items-center bg-white rounded-lg p-3">
            <span>No. of rooms</span>
            <button className="ml-auto px-2" onClick={decrementRooms}>
              -
            </button>
            <span className="w-8 text-center">{rooms}</span>
            <button className="px-2" onClick={incrementRooms}>
              +
            </button>
          </div>

          {/* Number of adults */}
          <div className="flex items-center bg-white rounded-lg p-3">
            <span>No. of adults</span>
            <button className="ml-auto px-2" onClick={decrementAdults}>
              -
            </button>
            <span className="w-8 text-center">{adults}</span>
            <button className="px-2" onClick={incrementAdults}>
              +
            </button>
          </div>

          {/* Number of children */}
          <div className="flex items-center bg-white rounded-lg p-3">
            <span>No. of children</span>
            <button className="ml-auto px-2" onClick={decrementChildren}>
              -
            </button>
            <span className="w-8 text-center">{children}</span>
            <button className="px-2" onClick={incrementChildren}>
              +
            </button>
          </div>
        </div>

        {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="flex items-center bg-white rounded-lg p-3">
          <span>No. of people</span>
          <button
            className="ml-auto px-2"
            onClick={() => setGuests((prev) => Math.max(1, prev - 1))}
          >
            -
          </button>
          <span className="w-8 text-center">{guests}</span>
          <button
            className="px-2"
            onClick={() => setGuests((prev) => prev + 1)}
          >
            +
          </button>
        </div>

        {/* <input
          type="date"
          className="w-full p-3 rounded-lg bg-white"
          placeholder="Destination"
        /> }
      </div> */}

        <div className="grid grid-cols-3 md:grid-cols-2 gap-4 mb-4">
          {children > 0 && (
            <div>
              {Array.from({ length: children }).map((_, index) => (
                <div
                  className="flex row-auto bg-white rounded-lg p-3 gap-4 mb-4"
                  key={index + 1}
                >
                  <div key={index + 1}>Age of Child {index + 1}:</div>
                  <input
                    className="w-15 text-center"
                    key={index}
                    type="number"
                    min="0"
                    value={childrenAges[index] || ""}
                    // onChange={(e) => {
                    //   const age = parseInt(e.target.value, 10);
                    //   setChildrenAges((prev) => {
                    //     const updated = [...prev];
                    //     updated[index] = age;
                    //     return updated;
                    //   });
                    // }}
                    onChange={(e) =>
                      handleChildAgeChange(index, parseInt(e.target.value, 10))
                    }
                    placeholder={"0"}
                  />
                  years
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mb-4 flex items-center gap-4">
          {image && (
            <div className="mt-2">
              <img
                src={URL.createObjectURL(image)}
                alt="Preview"
                className="max-w-full h-auto rounded-lg"
              />
            </div>
          )}
          <input
            type="file"
            id="imageInput"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            disabled={isLoadingUploadImage}
          />
          <button
            onClick={handleButtonClick}
            className="w-full text-white p-3 rounded-lg bg-[#f26b25] hover:bg-[#2a7de1] cursor-pointer transition"
          >
            {isLoadingUploadImage ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              "Attach image"
            )}
          </button>
        </div>

        {/* <div className="mb-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="w-full p-3 rounded-lg bg-white"
        />
        {image && (
          <div className="mt-2">
            <img
              src={URL.createObjectURL(image)}
              alt="Preview"
              className="max-w-full h-auto rounded-lg"
            />
          </div>
        )}
      </div>

      <button className="w-full text-white p-3 rounded-lg bg-[#f26b25] hover:bg-[#2a7de1] cursor-pointer transition">
        Upload hotel image
      </button> */}

        <button
          className="w-full bg-[#2a7de1] text-white p-3 rounded-lg mt-4 hover:bg-[#f26b25] transition cursor-pointer flex justify-center items-center"
          onClick={handleRoomSearch}
          disabled={isLoadingSearch}
        >
          {/* Search Hotels */}
          {isLoadingSearch ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            "Search Hotels"
          )}
        </button>

        {/* Display hotel list */}
        {/* {hotels.length > 0 && <HotelList hotels={hotels} />} */}
      </div>

      <div className="w-full px-2 py-4 font-['Poppins']">
        {/* {allHotels && (
          <div className="flex justify-center gap-4 mb-4">
            <button
              className={`px-14 py-6 rounded-lg text-white ${
                showAllHotels ?  "bg-gray-400": "bg-[#f26b25] border border-blue-950"
              }`}
              onClick={() => setShowAllHotels(false)}
            >
              <p className="text-xs">Show Hotels simialar to image</p>
            </button>
            <button
              className={`px-14 py-6 rounded-lg text-white ${
                !showAllHotels ?  "bg-gray-400": "bg-[#f26b25]"
              }`}
              onClick={() => setShowAllHotels(true)}
            >
              <p className="text-xs">Show All Available Hotels</p>
            </button>
          </div>
        )} */}
        {/* {showAllHotels
          ? allHotels.length > 0 && <HotelList hotels={allHotels} />
          : hotels.length > 0 && <HotelList hotels={hotels} />
        } */}
        {(hotels.length > 0 && <HotelList hotels={hotels} />)}

      </div>
    </div>
  );
};

export default SearchForm;
