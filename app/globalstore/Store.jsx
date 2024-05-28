"use client";

import { configureStore } from "@reduxjs/toolkit";
import cartsliceReducer from "@/app/globalstore/reduxslices/cartslice/Cart";

const Reduxstore = configureStore({
  reducer: {
    cart: cartsliceReducer,
  },
});

export default Reduxstore;
