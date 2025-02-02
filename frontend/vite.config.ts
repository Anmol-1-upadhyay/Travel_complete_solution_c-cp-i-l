import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/api": {
        target: "http://api.tbotechnology.in/TBOHolidays_HotelAPI/TBOHotelCodeList",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },

      "/search": {
        target: "http://api.tbotechnology.in/TBOHolidays_HotelAPI/search",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api2/, ""),
      },

      "/hoteldetails": {
        target: "http://api.tbotechnology.in/TBOHolidays_HotelAPI/Hoteldetails",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api3/, ""),
      },
    },
  },
  plugins: [
    react(),
    tailwindcss(),
  ],
})
