import React from "react";

interface paraprops {
    City: string;
    CheckIn: string;
    CheckOut: string;
    HotelCodes: string;
    GuestNationality: string;
    CityCode: string;
    PaxRooms: Array<{ Adults: number; Children: number; ChildrenAges: number[] }>;
    ResponseTime: number;
    IsDetailedResponse: boolean;
    Filters: {
      MealType: string;
      NoOfRooms: number;
      Refundable: boolean;
    };
    Budget: number;
    Amenities: string[];
    Attractions: string[];
  };
interface ParameterProps {
  parameters: paraprops
}

const ParameterDisplay: React.FC<ParameterProps> = ({ parameters }) => {
    if (!parameters || Object.keys(parameters).length === 0) {
      return null;
    }
  
    return (
      <div className="p-4 bg-black/50 rounded-lg shadow-md my-4">
        <h1 className="text-2xl font-bold mb-4 text-white">Input Parameters in Chatbot</h1>
        <div className="space-y-2 text-white">
          {/* {parameters.City && <p><span className="font-semibold">City:</span> {parameters.City}</p>}
          {parameters.CheckIn && <p><span className="font-semibold">CheckIn:</span> {parameters.CheckIn}</p>}
          {parameters.CheckOut && <p><span className="font-semibold">CheckOut:</span> {parameters.CheckOut}</p>}
          {parameters.HotelCodes && <p><span className="font-semibold">HotelCodes:</span> {parameters.HotelCodes}</p>}
          {parameters.GuestNationality && <p><span className="font-semibold">GuestNationality:</span> {parameters.GuestNationality}</p>}
          {parameters.CityCode && <p><span className="font-semibold">CityCode:</span> {parameters.CityCode}</p>}
          {parameters.ResponseTime !== undefined && <p><span className="font-semibold">ResponseTime:</span> {parameters.ResponseTime}</p>}
          {parameters.IsDetailedResponse !== undefined && <p><span className="font-semibold">IsDetailedResponse:</span> {parameters.IsDetailedResponse ? 'True' : 'False'}</p>} */}
          {/* {parameters.PaxRooms && parameters.PaxRooms.length > 0 && (
            <div>
              <p className="font-semibold">PaxRooms:</p>
              {parameters.PaxRooms.map((room, index) => (
                <div key={index} className="ml-4">
                  {room.Adults !== undefined && <p>Adults: {room.Adults}</p>}
                  {room.Children !== undefined && <p>Children: {room.Children}</p>}
                  {room.ChildrenAges && <p>ChildrenAges: {room.ChildrenAges.join(", ") || "N/A"}</p>}
                </div>
              ))}
            </div>
          )} */}
          {parameters.Filters && (
            <div>
              <p className="font-semibold">Filters:</p>
              <div className="ml-4">
                {parameters.Filters.MealType && <p>MealType: {parameters.Filters.MealType}</p>}
                {parameters.Filters.NoOfRooms !== undefined && <p>NoOfRooms: {parameters.Filters.NoOfRooms}</p>}
                {parameters.Filters.Refundable !== undefined && <p>Refundable: {parameters.Filters.Refundable ? 'Yes' : 'No'}</p>}
              </div>
            </div>
          )}
          {parameters.Budget !== undefined && <p><span className="font-semibold">Budget:</span> {parameters.Budget}</p>}
          {parameters.Amenities && parameters.Amenities.length > 0 && (
            <div>
              <p className="font-semibold">Amenities:</p>
              <ul className="list-disc ml-6">
                {parameters.Amenities.map((amenity, index) => (
                  <li key={index}>{amenity}</li>
                ))}
              </ul>
            </div>
          )}
          {parameters.Attractions && parameters.Attractions.length > 0 && (
            <div>
              <p className="font-semibold">Attractions:</p>
              <ul className="list-disc ml-6">
                {parameters.Attractions.map((attraction, index) => (
                  <li key={index}>{attraction}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    );
  };
  
  export default ParameterDisplay;
  