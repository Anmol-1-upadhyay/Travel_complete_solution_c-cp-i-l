import React, { useState } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { Box, Button, Modal, Typography } from "@mui/material";


interface Room {
    BookingCode: string;
    Inclusion: string;
    IsRefundable: boolean;
    MealType: string;
    Name: string[];
    RoomPromotion: string[];
    TotalFare: number;
    TotalTax: number;
    WithTransfers: boolean;
}

// HotelDetails interface to represent the shape of the hotel data
interface HotelDetail {
  Address: string;
  Attractions: { [key: string]: string };
  CheckInTime: string;
  CheckOutTime: string;
  CityId: string;
  CityName: string;
  CountryCode: string;
  CountryName: string;
  Description: string;
  FaxNumber: string;
  HotelCode: string;
  HotelFacilities: string[];
  HotelName: string;
  HotelRating: number;
  Images: string[];
  Map: string;
  PhoneNumber: string;
  PinCode: string;
}
interface HotelDetailData {
    Currency: string;
    HotelCode: string;
    HotelDetails: HotelDetail;
    Rooms: Room[];
    similarity: number;
}

interface HotelListProps {
  hotels: HotelDetailData[];
}
// Sample hotel data
// const hotelList: HotelDetail[] = [
//   {
//     Address:
//       "4 129 Mount Poonamallee Road Manapakkam, ManappakkamChennai 600089, Chennai, 600089, India",
//     Attractions: {
//       "1)": "Distances are displayed to the nearest 0.1 mile an… International Airport (MAA) - 9.7 km / 6 mi",
//     },
//     CheckInTime: "2:00 PM",
//     CheckOutTime: "12:00 PM",
//     CityId: "127343",
//     CityName: "Chennai",
//     CountryCode: "IN",
//     CountryName: "India",
//     Description: `
//         <p>HeadLine: In Chennai (Manapakkam)</p>
//         <p>Location: With a stay at Feathers - A Radha Hotel in Chennai (Manapakkam), you'll be within a 5-minute drive of MIOT International Hospital and Chennai Trade Centre. This luxury hotel is 4.4 mi (7.1 km) from Guindy Race Course and 4.7 mi (7.5 km) from Anna University.</p>
//         <p>Rooms: Make yourself at home in one of the 186 air-conditioned rooms featuring minibars and LED televisions. Complimentary wired and wireless internet access keeps you connected, and cable programming provides entertainment. Private bathrooms with separate bathtubs and showers feature complimentary toiletries and bathrobes. Conveniences include safes and desks, and housekeeping is provided daily.</p>
//         <p>Dining: Grab a bite to eat at one of the hotel’s 3 restaurants, or stay in and take advantage of the 24-hour room service. Snacks are also available at the coffee shop/café. Wrap up your day with a drink at the bar/lounge. Buffet breakfasts are available daily from 6:30 AM to 10:30 AM for a fee.</p>
//         <p>CheckIn Instructions: Extra-person charges may apply and vary depending on property policy. Government-issued photo identification and a credit card, debit card, or cash deposit may be required at check-in for incidental charges. Special requests are subject to availability upon check-in and may incur additional charges; special requests cannot be guaranteed.</p>
//         <p>Special Instructions: This property offers transfers from the airport (surcharges may apply). Guests must contact the property with arrival details before travel, using the contact information on the booking confirmation. Front desk staff will greet guests on arrival.</p>
//         <b>Disclaimer notification: Amenities are subject to availability and may be chargeable as per the hotel policy.</b>
//       `,
//     FaxNumber: "91-44-66776900",
//     HotelCode: "1545713",
//     HotelFacilities: [
//       "Dry cleaning/laundry service",
//       "Banquet hall",
//       "Number of meeting rooms - 1",
//       "Free wired Internet",
//       "Free WiFi",
//       "Number of bars/lounges - 1",
//       "Designated smoking areas",
//       "Health club",
//       "Number of outdoor pools - 1",
//       "Braille or raised signage",
//       "Wheelchair accessible parking",
//       "Free newspapers in lobby",
//       "Tours/ticket assistance",
//       "Area shuttle (surcharge)",
//       "Rooftop terrace",
//       "Airport transportation (surcharge)",
//       "Accessible airport shuttle",
//       "Luggage storage",
//       "Business center",
//       "24-hour front desk",
//       "Breakfast available (surcharge)",
//       "Spa services on site",
//       "Safe-deposit box at front desk",
//       "Number of coffee shops/cafes - 1",
//       "Designated smoking areas (fines apply)",
//       "Laundry facilities",
//       "Free self parking",
//       "Elevator",
//       "Fitness facilities",
//       "Free valet parking",
//       "Terrace",
//       "Hair salon",
//       "Pool sun loungers",
//       "Wheelchair accessible path of travel",
//       "Concierge services",
//     ],
//     HotelName: "Feathers A Radha Hotel Chennai",
//     HotelRating: 5,
//     Images: [
//       "https://api.tbotechnology.in/imageresource.aspx?im…18m20/X12HuFH5Rd1nTdv4uCxNFBejh0vJDyYSJfEpR5qsw==",
//       "https://api.tbotechnology.in/imageresource.aspx?im…18m20/X12HuFH5QYeySQyjWQcIZbQ8nzUAnQ7hX7+297Q2Q==",
//       "https://api.tbotechnology.in/imageresource.aspx?im…18m20/X12HuFH5RGWs2K7F0Zn5Ed7EkTRrzHCfTouKhyHmQ==",
//     ],
//   },
// ];

// Rendering the hotel list
const HotelList: React.FC<HotelListProps> = ({ hotels }) => {
  const [expandedHotel, setExpandedHotel] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState<HotelDetailData | null>(null);

  const handleCardClick = (hotel: HotelDetailData) => {
    setSelectedHotel(hotel); // Store the selected hotel
    setOpenModal(true); // Open modal on click
  };

  const handleCloseModal = () => {
    setOpenModal(false); // Close the modal
    setSelectedHotel(null); // Reset selected hotel
  };

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
  };

  

  const generateLink = (coordinates:string) => {
    if (coordinates.includes("|")) {
      const [latitude, longitude] = coordinates.split("|");
      return `https://www.google.com/maps?q=${latitude},${longitude}`;
    }
    return "#";
  };

  return (
    
    <div className="hotel-list p-1 font-['Poppins']">
      {hotels.map((hotel) => (
        <div
          //   key={index}
          key={hotel.HotelCode}
          className="hotel-card bg-black/50 shadow-lg rounded-lg overflow-hidden mb-6 cursor-pointer"
          onClick={() => handleCardClick(hotel)}
        >
          {hotel.HotelDetails && (
          <div className="flex w-full">
            <div className="w-1/3">
            {hotel.HotelDetails && hotel.HotelDetails.Images &&(
              <Slider {...settings}>
                {hotel.HotelDetails.Images.slice(0, 3).map((img, imgIdx) => (
                  <div key={imgIdx} className="hotel-image">
                    <img
                      src={img}
                      alt={`Hotel Image ${imgIdx + 1}`}
                      className="w-full h-64 object-cover"
                    />
                  </div>
                ))}
              </Slider>
            )}
            </div>

            <div className="w-2/3 p-4">
              <div className="hotel-details p-4">
                <h2 className="text-xl font-semibold text-white">
                  {hotel.HotelDetails.HotelName} - {hotel.HotelDetails.HotelRating} Stars
                </h2>
                {/* <p className="text-sm text-gray-600">{hotel.Description}</p> */}
                {/* <div
              className="hotel-description"
              dangerouslySetInnerHTML={{ __html: hotel.Description }}
            /> */}
                <p className="text-white">
                  <strong>Name:</strong> {hotel.Rooms[0].Name}
                </p>
                <p className="text-white">
                  <strong>City:</strong> {hotel.HotelDetails.CityName}, {hotel.HotelDetails.CountryName}
                </p>
                <p className="text-white">
                  <strong>Check-In:</strong> {hotel.HotelDetails.CheckInTime} |{" "}
                  <strong>Check-Out:</strong> {hotel.HotelDetails.CheckOutTime}
                </p>
                <p className="text-white">
                  <strong>Currency:</strong> {hotel.Currency}
                </ p>
                <p className="text-white">
                  <strong>Total Fare:</strong> {hotel.Rooms[0].TotalFare}
                </ p>
                <p className="text-white">
                  <strong>Total Tax:</strong> {hotel.Rooms[0].TotalTax}
                </p>
                <p className="text-green-500">
                  {hotel.similarity ? <strong>Similarity: {hotel.similarity}</strong>  : null}
                </p>
                {/* <p>
              <strong>Facilities:</strong>
            </p>
            <ul className="list-disc pl-5 text-sm">
              {hotel.HotelFacilities.map((facility, idx) => (
                <li key={idx}>{facility}</li>
              ))}
            </ul> */}
              </div>
            </div>
          </div>)}
        </div>
      ))}

      {/* Modal to show expanded hotel details */}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          className="modal-content w-full max-w-4xl p-6 bg-black rounded-lg shadow-lg flex font-['Poppins']"
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            overflowY: "auto",
            maxHeight: "90%",
          }}
        >
          {selectedHotel && (
            <>
              {/* Left section for the image grid */}
              <div
                className="w-1/2 mr-6 overflow-y-auto"
                style={{ maxHeight: "calc(90vh - 100px)" }}
              >
                <div className="grid grid-cols-2 gap-4">
                  {selectedHotel.HotelDetails.Images.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`Hotel Image ${idx + 1}`}
                      className="w-full h-48 object-cover rounded-md"
                    />
                  ))}
                </div>
              </div>

              {/* Right section for hotel details */}
              <div
                className="w-1/2 overflow-y-auto text-white"
                style={{
                  maxHeight: "calc(90vh - 100px)", // Adjust the height as needed
                }}
              >
                <Typography variant="h4" component="h2" className="mb-4 font-['Poppins'] text-white">
                  {selectedHotel.HotelDetails.HotelName} - {selectedHotel.HotelDetails.HotelRating} Stars
                </Typography>

                <p>
                  <strong className="text-[#f26b25]">Room Details:</strong>
                </p>
                <p>
                  <strong className="text-[#f26b25]">Name:</strong> {selectedHotel.Rooms[0].Name}
                </p>
                <p>
                  <strong className="text-[#f26b25]">Inclusion:</strong> {selectedHotel.Rooms[0].Inclusion}, {selectedHotel.HotelDetails.CountryName}
                </p>
                <p>
                  <strong className="text-[#f26b25]">IsRefundable:</strong> {selectedHotel.Rooms[0].IsRefundable}
                </p>
                <p>
                  <strong className="text-[#f26b25]">MealType:</strong> {selectedHotel.Rooms[0].MealType}
                </p>
                <p>
                  <strong className="text-[#f26b25]">RoomPromotion:</strong> {selectedHotel.Rooms[0].RoomPromotion}
                </p>
                <p>
                  <strong className="text-[#f26b25]">WithTransfers:</strong> {selectedHotel.Rooms[0].WithTransfers}
                </p>
                <p>
                  <strong className="text-[#f26b25]">Currency:</strong> {selectedHotel.Currency}
                </p>
                <p>
                  <strong className="text-[#f26b25]">Total Fare:</strong> {selectedHotel.Rooms[0].TotalFare}
                </p>
                <strong className="text-[#f26b25]">Total Tax:</strong> {selectedHotel.Rooms[0].TotalTax}
    
                <div
                  className="hotel-details mb-4"
                  dangerouslySetInnerHTML={{
                    __html: selectedHotel.HotelDetails.Description,
                  }}
                />
                <p>
                  <strong className="text-[#f26b25]">Address:</strong> {selectedHotel.HotelDetails.Address}
                </p>
                <p>
                  <strong className="text-[#f26b25]">City:</strong> {selectedHotel.HotelDetails.CityName},{" "}
                  {selectedHotel.HotelDetails.CountryName}
                </p>
                <p>
                  <strong className="text-[#f26b25]">Check-In Time:</strong> {selectedHotel.HotelDetails.CheckInTime}
                </p>
                <p>
                  <strong className="text-[#f26b25]">Check-Out Time:</strong> {selectedHotel.HotelDetails.CheckOutTime}
                </p>
                <p>
                  <strong className="text-[#f26b25]">Facilities:</strong>
                </p>
                <ul>
                  {selectedHotel.HotelDetails.HotelFacilities.map((facility, idx) => (
                    <li key={idx}>{facility}</li>
                  ))}
                </ul>
                <p>
                  <strong className="text-[#f26b25]">Attractions:</strong>
                </p>

                {selectedHotel.HotelDetails.Attractions && (
                <div
                  className="attractions mb-4"
                  dangerouslySetInnerHTML={{
                    __html: selectedHotel.HotelDetails.Attractions["1) "],
                  }}
                />)}
                <p>
                  <strong className="text-[#f26b25]">Country:</strong> {selectedHotel.HotelDetails.CountryName} - {selectedHotel.HotelDetails.CountryCode}
                </p>
                <p>
                  <strong className="text-[#f26b25]">CityId:</strong> {selectedHotel.HotelDetails.CityId}
                </p>
                <p>
                  <strong className="text-[#f26b25]">HotelCode:</strong> {selectedHotel.HotelDetails.HotelCode}
                </p>
                <p>
                  <strong className="text-[#f26b25]">FaxNumber:</strong> {selectedHotel.HotelDetails.FaxNumber}
                </p>
                <p>
                  <strong className="text-[#f26b25]">PhoneNumber:</strong> {selectedHotel.HotelDetails.PhoneNumber}
                </p>
                <p>
                  <strong className="text-[#f26b25]">PinCode:</strong> {selectedHotel.HotelDetails.PinCode}
                </p>
                <p>
                  <strong className="text-[#f26b25]">Location:</strong>
                  <a href={generateLink(selectedHotel.HotelDetails.Map)} className="text-blue-500 hover:text-blue-900"> Open google maps</a>
                </p>

                <Button
                  onClick={handleCloseModal}
                  className="mt-4"
                  variant="contained"
                  sx={{
                    fontFamily: "", // Use the same font as the parent
                    backgroundColor: "red", // Custom background color
                    color: "#fff", // Custom text color
                    "&:hover": {
                      backgroundColor: "orange", // Hover state
                    },
                  }}
                >
                  Close
                </Button>
              </div>
            </>
          )}
        </Box>
      </Modal>
    </div>
  );
};

export default HotelList;

// import React, { useState } from "react";
// import { Modal, Box, Button, Typography } from "@mui/material";

// // HotelDetails interface to represent the shape of the hotel data
// interface HotelDetail {
//   Address: string;
//   Attractions: { [key: string]: string };
//   CheckInTime: string;
//   CheckOutTime: string;
//   CityId: string;
//   CityName: string;
//   CountryCode: string;
//   CountryName: string;
//   Description: string;
//   FaxNumber: string;
//   HotelCode: string;
//   HotelFacilities: string[];
//   HotelName: string;
//   HotelRating: number;
//   Images: string[];
// }

// interface HotelListProps {
//   hotels: HotelDetail[];
// }

// // Sample hotel data
// const hotelList: HotelDetail[] = [
//   {
//     Address: "4 129 Mount Poonamallee Road Manapakkam, ManappakkamChennai 600089, Chennai, 600089, India",
//     Attractions: {
//       "1)": "Distances are displayed to the nearest 0.1 mile an… International Airport (MAA) - 9.7 km / 6 mi",
//     },
//     CheckInTime: "2:00 PM",
//     CheckOutTime: "12:00 PM",
//     CityId: "127343",
//     CityName: "Chennai",
//     CountryCode: "IN",
//     CountryName: "India",
//     Description: `
//       <p>HeadLine: In Chennai (Semmencherry)</p>
//       <p>Location: A stay at Four Points by Sheraton Chennai OMR places you in the heart of Chennai...</p>
//     `,
//     FaxNumber: "91-44-66776900",
//     HotelCode: "1545713",
//     HotelFacilities: ["Dry cleaning/laundry service", "Banquet hall", "Free self parking"],
//     HotelName: "Feathers A Radha Hotel Chennai",
//     HotelRating: 5,
//     Images: [
//       "https://api.tbotechnology.in/imageresource.aspx?im…18m20/X12HuFH5Rd1nTdv4uCxNFBejh0vJDyYSJfEpR5qsw==",
//       "https://api.tbotechnology.in/imageresource.aspx?im…18m20/X12HuFH5QYeySQyjWQcIZbQ8nzUAnQ7hX7+297Q2Q==",
//       "https://api.tbotechnology.in/imageresource.aspx?im…18m20/X12HuFH5RGWs2K7F0Zn5Ed7EkTRrzHCfTouKhyHmQ==",
//       "https://api.tbotechnology.in/imageresource.aspx?im…18m20/X12HuFH5Q1eRjQ7TqF4O6Djp8HL7eYOzBvqKYZYj=="
//     ],
//   },
// ];

// // HotelList Component
// const HotelList: React.FC<HotelListProps> = ({ hotels }) => {
//   const [expandedHotel, setExpandedHotel] = useState<string | null>(null);
//   const [openModal, setOpenModal] = useState(false);
//   const [selectedHotel, setSelectedHotel] = useState<HotelDetail | null>(null);

//   const handleCardClick = (hotel: HotelDetail) => {
//     setSelectedHotel(hotel); // Store the selected hotel
//     setOpenModal(true); // Open modal on click
//   };

//   const handleCloseModal = () => {
//     setOpenModal(false); // Close the modal
//     setSelectedHotel(null); // Reset selected hotel
//   };

//   return (
//     <div className="hotel-list">
//       {hotels.map((hotel) => (
//         <div
//           key={hotel.HotelCode}
//           className="hotel-card p-4 border border-gray-300 rounded-lg mb-4 cursor-pointer"
//           onClick={() => handleCardClick(hotel)}
//         >
//           <h2 className="text-xl font-semibold">{hotel.HotelName} - {hotel.HotelRating} Stars</h2>
//           {/* Slideshow for top 3 images */}
//           <div className="slideshow mb-4">
//             {hotel.Images.slice(0, 3).map((img, idx) => (
//               <img
//                 key={idx}
//                 src={img}
//                 alt={`Hotel Image ${idx + 1}`}
//                 className="w-full h-40 object-cover rounded-md mb-2"
//               />
//             ))}
//           </div>
//           {/* Show only a few details */}
//           <p><strong>Address:</strong> {hotel.Address}</p>
//           <p><strong>City:</strong> {hotel.CityName}, {hotel.CountryName}</p>
//           <p><strong>Check-In:</strong> {hotel.CheckInTime}</p>
//           <p><strong>Check-Out:</strong> {hotel.CheckOutTime}</p>
//         </div>
//       ))}

//       {/* Modal to show full hotel details */}
//       <Modal
//         open={openModal}
//         onClose={handleCloseModal}
//         aria-labelledby="modal-modal-title"
//         aria-describedby="modal-modal-description"
//       >
//         <Box
//           className="modal-content w-full max-w-4xl p-6 bg-white rounded-lg shadow-lg"
//           sx={{
//             position: "absolute",
//             top: "50%",
//             left: "50%",
//             transform: "translate(-50%, -50%)",
//             overflowY: "auto",
//             maxHeight: "90%",
//           }}
//         >
//           {selectedHotel && (
//             <>
//               <Typography variant="h4" component="h2" className="mb-4">
//                 {selectedHotel.HotelName} - {selectedHotel.HotelRating} Stars
//               </Typography>
//               {/* Show the slideshow in the modal */}
//               <div className="slideshow mb-4">
//                 {selectedHotel.Images.map((img, idx) => (
//                   <img
//                     key={idx}
//                     src={img}
//                     alt={`Hotel Image ${idx + 1}`}
//                     className="w-full h-60 object-cover rounded-md mb-2"
//                   />
//                 ))}
//               </div>
//               {/* Full hotel details */}
//               <div
//                 className="hotel-details"
//                 dangerouslySetInnerHTML={{ __html: selectedHotel.Description }}
//               />
//               <p><strong>Address:</strong> {selectedHotel.Address}</p>
//               <p><strong>City:</strong> {selectedHotel.CityName}, {selectedHotel.CountryName}</p>
//               <p><strong>Check-In Time:</strong> {selectedHotel.CheckInTime}</p>
//               <p><strong>Check-Out Time:</strong> {selectedHotel.CheckOutTime}</p>
//               <p><strong>Facilities:</strong></p>
//               <ul>
//                 {selectedHotel.HotelFacilities.map((facility, idx) => (
//                   <li key={idx}>{facility}</li>
//                 ))}
//               </ul>
//               <Button onClick={handleCloseModal} className="mt-4" variant="contained" color="primary">
//                 Close
//               </Button>
//             </>
//           )}
//         </Box>
//       </Modal>
//     </div>
//   );
// };

// export default HotelList;
