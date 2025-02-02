import { useState } from "react";
// import "./App.css";
import ChatInterface from "./components/chatbot";
import HotelList from "./components/hotellist";
import SearchForm from "./components/searchform";
import useParamsStore from "./store/store";

function SearchPage() {
  // const { hotels, setHotels } = useParamsStore();
  // const { allHotels, setallHotels } = useParamsStore();
  // const [showAllHotels, setShowAllHotels] = useState(false);

  return (
    <div className="font-['Poppins'] min-h-screen bg-cover bg-center display flex flex-col">
      <div className="flex flex-1 justify-center gap-8 py-8 h-[50vh]">
        <div className="w-4/12">
          <ChatInterface />
        </div>

        <div className="w-6/12 h-1/3">
          <SearchForm />
          {/* <div className="w-full px-2 py-4 font-mono">
            {allHotels && (
              <div className="flex justify-center gap-4 mb-4">
                <button
                  className={`px-4 py-2 rounded-lg text-white ${
                    !showAllHotels ? "bg-[#2a7de1]" : "bg-gray-400"
                  }`}
                  onClick={() => setShowAllHotels(false)}
                >
                  Show Hotels
                </button>
                <button
                  className={`px-4 py-2 rounded-lg text-white ${
                    showAllHotels ? "bg-[#f26b25]" : "bg-gray-400"
                  }`}
                  onClick={() => setShowAllHotels(true)}
                >
                  Show All Hotels
                </button>
              </div>
            )}
            {showAllHotels
              ? allHotels.length > 0 && <HotelList hotels={allHotels} />
              : hotels.length > 0 && <HotelList hotels={hotels} />}
          </div> */}
        </div>
      </div>

      {/* HotelList below the row */}
      {/* <div className="w-full px-8 py-4 font-mono">
        {hotels.length > 0 && <HotelList hotels={hotels} />}
        {/* {/* Pass your hotels data here } }
      </div> */}
    </div>
  );
}

export default SearchPage;
