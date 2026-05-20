import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SearchState {
  isOpen: boolean;
  query: string;
  results: string[];
}

const initialState: SearchState = {
  isOpen: false,
  query: "",
  results: [],
};

const mockData = [
  "React",
  "Next.js",
  "Vue",
  "Laravel",
  "Tailwind CSS",
  "Redux Toolkit",
  "TypeScript",
  "Node.js",
];

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    toggleSearch: (state) => {
      state.isOpen = !state.isOpen;
      if (!state.isOpen) {
        state.query = "";
        state.results = [];
      }
    },
    setQuery: (state, action: PayloadAction<string>) => {
      state.query = action.payload;
      state.results = action.payload
        ? mockData.filter((item) =>
            item.toLowerCase().includes(action.payload.toLowerCase()),
          )
        : [];
    },
    closeSearch: (state) => {
      state.isOpen = false;
      state.query = "";
      state.results = [];
    },
  },
});

export const { toggleSearch, setQuery, closeSearch } = searchSlice.actions;
export default searchSlice.reducer;
