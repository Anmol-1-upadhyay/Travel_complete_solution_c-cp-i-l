import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface ParamsStore {
  dateRange: { from: string; to: string };
  rooms: number;
  adults: number;
  children: number;
  cityName: string;
  childrenAges: number[];
  setDateRange: (range: { from: string; to: string }) => void;

  setRooms: (rooms: number) => void;
  incrementRooms: () => void;
  decrementRooms: () => void;

  setAdults: (adults: number) => void;
  incrementAdults: () => void;
  decrementAdults: () => void;

  setChildren: (children: number) => void;
  incrementChildren: () => void;
  decrementChildren: () => void;

  setChildrenAges: (childrenAges: number[]) => void;
  incrementChildAge: () => void; // Increment all children's age
  decrementChildAge: () => void; // Decrement all children's age

  setCityName: (cityName: string) => void;
  //   setChildrenAges: (ages: number[]) => void;

  hotels: any[];
  allHotels: any[];

  setHotels: (hotels: any[]) => void; // State to store detailed hotel data
  setallHotels: (allHotels: any[]) => void; // State to store detailed hotel data

  avairooms: any[];

  setavaiRooms: (avairooms: any[]) => void; // State to store detailed hotel data


  parameters: any;
  setParameters: (parameters: any) => void; // State to store detailed hotel data

}

const useParamsStore = create<ParamsStore>()(
  (set, get) => ({
  dateRange: { from: "", to: "" },
  rooms: 1,
  adults: 1,
  children: 0,
  cityName: "",
  childrenAges: [],
  setDateRange: (range) => set(() => ({ dateRange: range })),

  setRooms: (rooms) => set(() => ({ rooms })),
  incrementRooms: () => set((state) => ({ rooms: state.rooms + 1 })), // Increment rooms based on previous value
  decrementRooms: () => set((state) => ({ rooms: state.rooms - 1 })), // Decrement rooms based on previous value

  setAdults: (adults) => set(() => ({ adults })),
  incrementAdults: () => set((state) => ({ adults: state.adults + 1 })), // Increment adults based on previous value
  decrementAdults: () => set((state) => ({ adults: state.adults - 1 })), // Decrement adults based on previous value

  setChildren: (children) => set(() => ({ children })),
  incrementChildren: () => set((state) => ({ children: state.children + 1 })), // Increment children based on previous value
  decrementChildren: () => set((state) => ({ children: state.children - 1 })), // Decrement children based on previous value

  setCityName: (cityName) => set(() => ({ cityName })),

  setChildrenAges: (childrenAges) => set({ childrenAges }),

  incrementChildAge: () =>
    set((state) => {
      const updatedAges = state.childrenAges.map((age) => age + 1);
      return { childrenAges: updatedAges };
    }),

  decrementChildAge: () =>
    set((state) => {
      const updatedAges = state.childrenAges.map((age) => age - 1);
      return { childrenAges: updatedAges };
    }),

  hotels: [],
  setHotels: (hotels) => set({ hotels }),

  allHotels: [],
  setallHotels: (allHotels) => set({ allHotels }),

  avairooms: [],
  setavaiRooms: (avairooms) => set({ avairooms }),

  parameters: [],
  setParameters: (parameters) => set({ parameters }),
}),
);

export default useParamsStore;
