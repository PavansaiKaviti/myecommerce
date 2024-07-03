"use client";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: 1,
  pages: 0,
};

const pageSlice = createSlice({
  name: "Page",
  initialState,
  reducers: {
    addpage: (state, action) => {
      const data = action.payload;
      state.value = data;
      return state;
    },
    nextPage: (state) => {
      // adding payload to item
      state.value = state.value === state.pages ? state.value : state.value + 1;
      return state;
    },
    prevPage: (state) => {
      // adding payload to item
      state.value = state.value === 1 ? 1 : state.value - 1;
      return state;
    },
    addpages: (state, action) => {
      const data = action.payload;
      state.pages = data;
      return state;
    },
  },
});

export const { nextPage, prevPage, addpages, addpage } = pageSlice.actions;
export default pageSlice.reducer;
