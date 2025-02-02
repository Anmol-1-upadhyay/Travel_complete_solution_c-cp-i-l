// import React, { useState, useEffect } from "react";

// interface Room {
//   BookingCode: string;
//   Inclusion: string;
//   IsRefundable: boolean;
//   MealType: string;
//   Name: string[];
//   RoomPromotion: string[];
//   TotalFare: number;
//   TotalTax: number;
//   WithTransfers: boolean;
// }

// interface RoomDetails {
//   Currency: string;
//   HotelCode: string;
//   Rooms: Room[];
// }

// interface RoomCardProps {
//   rooms: RoomDetails[];
// }

// const RoomCards: React.FC<RoomCardProps> = ({ rooms }) => {
//   return (
//     <div>
//       {rooms.map((room) => (
//         <div className="bg-white shadow-lg rounded-lg p-4 mb-4">
//           <h3 className="text-xl font-semibold mb-2">{room.Rooms[0].Name}</h3>
//           <p className="text-sm text-gray-600">{room.Currency}</p>
//           <div className="mt-2">
//             <span className="text-lg font-bold text-green-600">
//               {room.Rooms[0].TotalFare}
//             </span>
//             <p className="text-sm text-gray-600">
//               Check-in: {room.Rooms[0].MealType} | Check-out:{" "}
//               {room.Rooms[0].BookingCode}
//             </p>
//           </div>
//           <div className="mt-2">
//             <h4 className="text-sm font-semibold">Amenities:</h4>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default RoomCards;
