import { useState } from "react";
import "./App.css";
import ChatInterface from "./components/chatbot";
import HotelList from "./components/hotellist";
import SearchForm from "./components/searchform";
import useParamsStore from "./store/store";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { AnimatedButton } from "./components/homebutton";

function Home() {

    const navigate = useNavigate(); // Initialize the navigate function

  const handleExploreNowClick = () => {
    // Navigate to the '/hotels' page when the button is clicked
    navigate('/chatbot/searchhotels');
  };
  
  return (
    <div className="h-[80vh] flex flex-col items-center justify-center text-white p-6">
      <motion.h1
  className="text-5xl md:text-7xl font-extrabold mb-6 text-center"
  initial={{ opacity: 0, y: -20 }}
  animate={{ opacity: 1, y: [0, -10, 0] }}  // Continuous bouncing animation
  transition={{
    opacity: { duration: 1.2, ease: "easeInOut" },  // Animate only opacity once
    y: {
      duration: 1.2,
      ease: "easeInOut",
      repeat: Infinity,  // Makes the bounce continuous
      repeatType: "loop",  // Loops the animation
    },
  }}
>
  Discover Your Stays
</motion.h1>
      <p className="text-lg md:text-2xl mb-8 text-center max-w-2xl">
      Let our AI chatbot help you find the perfect hotel for your next trip with personalized recommendations.
      </p>

      <div className="btn-cont">
            <AnimatedButton
              
            />
          </div>
      <motion.div
        className="mt-12 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
      >
        <p className="text-lg italic">Your journey begins here.</p>
      </motion.div>
    </div>
  );
}

export default Home;
