// import React from "react";
// import { Link } from "react-router-dom";
// // import "./navbar.css";

// const Navbar: React.FC = () => {
//   return (
//     <div className="navbar">
//       <ul className="navlist">
//         <li className="nav-item">
//           <img className="dream-logo" src="/logo.png"></img>
//         </li>
//         <li className="nav-item">
//           <Link to="/" className="nav-link">Home</Link>
//         </li>
//         <li className="navItem">
//           <Link to="/search" className="nav-link">Search</Link>
//         </li>
//       </ul>
//     </div>
//   );
// };

// export default Navbar;

import React from "react";
import { Link } from "react-router-dom";

const Navbar: React.FC = () => {
  return (
    <header className="text-white py-4 flex justify-around items-center px-6">
  <Link to="/" className="text-4xl font-semibold">
    <span className="text-[#2a7de1]">Con</span>
    <span className="text-[#f26b25]">QIT</span>
  </Link>
  
  <nav className="flex w-full max-w-md justify-between">
    <Link to="/" className="text-lg text-black hover:text-[#00AEEF]">
      Home
    </Link>
    <Link to="/chatbot/searchhotels" className="text-lg text-black hover:text-[#00AEEF]">
      Search
    </Link>
    <Link to="/about" className="text-lg text-black hover:text-[#00AEEF]">
      About Us
    </Link>
  </nav>
  
</header>

  );
};

export default Navbar;
