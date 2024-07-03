"use client";
import { configureStore } from "@reduxjs/toolkit";
import cartsliceReducer from "@/app/globalstore/reduxslices/cartslice/Cart";
import pageReducer from "@/app/globalstore/reduxslices/pageSlice/Pageslice";

const Reduxstore = configureStore({
  reducer: {
    cart: cartsliceReducer,
    page: pageReducer,
  },
});

export default Reduxstore;
