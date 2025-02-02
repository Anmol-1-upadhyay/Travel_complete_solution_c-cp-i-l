// import { useState } from "react";
// import "./App.css";
// import ChatInterface from "./components/chatbot";
// import HotelList from "./components/hotellist";
// import SearchForm from "./components/searchform";
// import useParamsStore from "./store/store";
// import { BrowserRouter, Routes, Route } from "react-router";
// import Navbar from "./navbar";
// import Home from "./home";
// import SearchPage from "./search";

// function App() {
//   // const { hotels, setHotels } = useParamsStore();
//   // const { allHotels, setallHotels } = useParamsStore();
//   // const [showAllHotels, setShowAllHotels] = useState(false);

//   return (
//     // <div className="font-['Poppins'] min-h-screen bg-cover bg-center display flex flex-col">
//     //   <header className=" text-white py-2 flex items-center justify-between px-6">
//     //     <div className="text-3xl font-semibold">
//     //       <span className="text-[#2a7de1]">Con</span>
//     //       <span className="text-[#f26b25]">QIT</span>
//     //     </div>
//     //     <nav className="space-x-4">
//     //       <a href="#" className="text-lg text-black hover:text-[#00AEEF]">
//     //         Home
//     //       </a>
//     //       <a href="#about" className="text-lg text-black hover:text-[#00AEEF]">
//     //         About Us
//     //       </a>
//     //       <a
//     //         href="#services"
//     //         className="text-lg text-black hover:text-[#00AEEF]"
//     //       >
//     //         Services
//     //       </a>
//     //       <a
//     //         href="#contact"
//     //         className="text-lg text-black hover:text-[#00AEEF]"
//     //       >
//     //         Contact
//     //       </a>
//     //     </nav>
//     //   </header>

//     //   <div className="flex flex-1 justify-center gap-8 py-8 h-[50vh]">
//     //     <div className="w-4/12">
//     //       <ChatInterface />
//     //     </div>

//     //     <div className="w-6/12 h-1/3">
//     //       <SearchForm />
//     //       {/* <div className="w-full px-2 py-4 font-mono">
//     //         {allHotels && (
//     //           <div className="flex justify-center gap-4 mb-4">
//     //             <button
//     //               className={`px-4 py-2 rounded-lg text-white ${
//     //                 !showAllHotels ? "bg-[#2a7de1]" : "bg-gray-400"
//     //               }`}
//     //               onClick={() => setShowAllHotels(false)}
//     //             >
//     //               Show Hotels
//     //             </button>
//     //             <button
//     //               className={`px-4 py-2 rounded-lg text-white ${
//     //                 showAllHotels ? "bg-[#f26b25]" : "bg-gray-400"
//     //               }`}
//     //               onClick={() => setShowAllHotels(true)}
//     //             >
//     //               Show All Hotels
//     //             </button>
//     //           </div>
//     //         )}
//     //         {showAllHotels
//     //           ? allHotels.length > 0 && <HotelList hotels={allHotels} />
//     //           : hotels.length > 0 && <HotelList hotels={hotels} />}
//     //       </div> */}
//     //     </div>
//     //   </div>

//     //   {/* HotelList below the row */}
//     //   {/* <div className="w-full px-8 py-4 font-mono">
//     //     {hotels.length > 0 && <HotelList hotels={hotels} />}
//     //     {/* {/* Pass your hotels data here } }
//     //   </div> */}
//     // </div>

//     <BrowserRouter>
//       <Navbar></Navbar>
//       <div style={{ width: "100%"}}>
//         <Routes>
//           <Route path="/" element={<Home />} />
//           <Route path="/chatbot/searchhotels" element={<SearchPage />} />
//           {/* <Route path="/team" element={<SlidingPanels />} />
//           <Route path="/player-info" element={<PlayerInfo />} />
//           <Route path="/videopage" element={<VideoPage />} /> */}
//         </Routes>
//       </div>
//     </BrowserRouter>
//   );
// }

// export default App;
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import "./App.css";
import Navbar from "./navbar";
import Home from "./home";
import SearchPage from "./search";

function App() {
  const location = useLocation();

  // Define background images for different routes
  const backgroundImages: Record<string, string> = {
    "/": "url('/bg2.jpg')",
    "/chatbot/searchhotels": "url('/bg.jpg')",
  };

  return (
    <div 
      className="min-h-screen bg-no-repeat bg-cover bg-fixed font-['Poppins']" 
      style={{ backgroundImage: backgroundImages[location.pathname] || "url('/default-bg.jpg')" }}
    >
      <Navbar />
      <div style={{ width: "100%" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chatbot/searchhotels" element={<SearchPage />} />
        </Routes>
      </div>
    </div>
  );
}

export default function AppWrapper() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}
