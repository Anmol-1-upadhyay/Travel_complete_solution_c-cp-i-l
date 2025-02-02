import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export const AnimatedButton = () => {
  const navigate = useNavigate();
  
  return (
    <motion.button
      className="animated-button"
      initial={{
        background: "rgba(0, 0, 0, 0.25)",
        border: "1px solid rgba(255, 255, 255, 0.5)",
        color: "rgba(255, 255, 255, 0.5)",
        borderRadius: "25px", // Round borders
        padding: "12px 24px", // Padding
      }}
      whileHover={{
        boxShadow: "-5px 5px 40px #000", // Black glow effect
        background: "rgba(0, 0, 0, 0.35)", // Dark background
        color: "rgba(255, 255, 255)", // White text on hover
      }}
      whileTap={{
        scale: 0.99,
      }}
      onClick={() => {
        // delay the navigation by 1s
        setTimeout(() => {
            navigate('/chatbot/searchhotels');
        }, 500);
      }}
    >
      <motion.div
        className="button-gradient"
        initial={{
          opacity: 0,
        }}
        whileHover={{
          opacity: 1,
        }}
        transition={{
          duration: 0.8,
          ease: "easeOut",
        }}
      />
      Search Now
    </motion.button>
  );
};
