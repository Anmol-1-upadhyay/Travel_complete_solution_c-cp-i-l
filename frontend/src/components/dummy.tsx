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

//   const settings = {
//     dots: true,
//     infinite: true,
//     speed: 500,
//     slidesToShow: 1,
//     slidesToScroll: 1,
//     autoplay: true,
//     autoplaySpeed: 3000,
//     arrows: true
//   };

//   return (
//     <div className="hotel-list">
//       {hotels.map((hotel) => (
//         <div
//           key={hotel.HotelCode}
//           className="hotel-card p-4 border border-gray-300 rounded-lg bg-white shadow-lg mb-6 cursor-pointer overflow-hidden"
//           onClick={() => handleCardClick(hotel)}
//         >
//           <h2 className="text-xl font-semibold">{hotel.HotelName} - {hotel.HotelRating} Stars</h2>
          
//           {/* Slideshow for first 3 images in non-expanded card */}
//           {/* <div className="slideshow mb-4">
//             {hotel.Images.slice(0, 3).map((img, idx) => (
//               <img
//                 key={idx}
//                 src={img}
//                 alt={`Hotel Image ${idx + 1}`}
//                 className="w-full h-40 object-cover rounded-md mb-2"
//               />
//             ))}
//           </div> */}
          

//           <Slider {...settings}>
//   {hotel.Images.map((img, imgIdx) => (
//     <div key={imgIdx} className="hotel-image">
//       <img
//         src={img}
//         alt={`Hotel Image ${imgIdx + 1}`}
//         className="w-full h-64 object-cover" // Ensure the image has defined height and width
//       />
//     </div>
//   ))}
// </Slider>


//           {/* Show only a few details in non-expanded card */}
//           <p><strong>Address:</strong> {hotel.Address}</p>
//           <p><strong>City:</strong> {hotel.CityName}, {hotel.CountryName}</p>
//           <p><strong>Check-In:</strong> {hotel.CheckInTime}</p>
//           <p><strong>Check-Out:</strong> {hotel.CheckOutTime}</p>
//         </div>
//       ))}

//       {/* Modal to show expanded hotel details */}
//       <Modal
//         open={openModal}
//         onClose={handleCloseModal}
//         aria-labelledby="modal-modal-title"
//         aria-describedby="modal-modal-description"
//       >
//         <Box
//           className="modal-content w-full max-w-4xl p-6 bg-white rounded-lg shadow-lg flex"
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
//               {/* Left section for the image grid */}
//               <div className="w-1/2 mr-6">
//                 <div className="grid grid-cols-2 gap-4">
//                   {selectedHotel.Images.map((img, idx) => (
//                     <img
//                       key={idx}
//                       src={img}
//                       alt={`Hotel Image ${idx + 1}`}
//                       className="w-full h-48 object-cover rounded-md"
//                     />
//                   ))}
//                 </div>
//               </div>

//               {/* Right section for hotel details */}
//               <div className="w-1/2">
//                 <Typography variant="h4" component="h2" className="mb-4">
//                   {selectedHotel.HotelName} - {selectedHotel.HotelRating} Stars
//                 </Typography>
//                 <div
//                   className="hotel-details mb-4"
//                   dangerouslySetInnerHTML={{ __html: selectedHotel.Description }}
//                 />
//                 <p><strong>Address:</strong> {selectedHotel.Address}</p>
//                 <p><strong>City:</strong> {selectedHotel.CityName}, {selectedHotel.CountryName}</p>
//                 <p><strong>Check-In Time:</strong> {selectedHotel.CheckInTime}</p>
//                 <p><strong>Check-Out Time:</strong> {selectedHotel.CheckOutTime}</p>
//                 <p><strong>Facilities:</strong></p>
//                 <ul>
//                   {selectedHotel.HotelFacilities.map((facility, idx) => (
//                     <li key={idx}>{facility}</li>
//                   ))}
//                 </ul>
//                 <Button onClick={handleCloseModal} className="mt-4" variant="contained" color="primary">
//                   Close
//                 </Button>
//               </div>
//             </>
//           )}
//         </Box>
//       </Modal>
//     </div>
//   );
// };

// export default HotelList;