"use client";
import { getInitialState } from "@/utils/localstorage/Localstorage";
import cartUpdate from "@/utils/updatestocart/Updatecart";
import { createSlice } from "@reduxjs/toolkit";

const initialState = getInitialState("cart", {
  items: [],
  shippingAddress: {},
  paymentMethod: "cash",
});

const cartSlice = createSlice({
  name: "Cart",
  initialState,
  reducers: {
    additems: (state, action) => {
      // 1.adding payload to item
      const product = action.payload;
      // 2.check if item exist
      const itemExists = state.items.find((item) => item._id === product._id);
      // 3. if exists will update with new one else add new one
      if (itemExists) {
        state.items = state.items.map((e) =>
          e._id === itemExists._id ? product : e
        );
      } else {
        state.items = [...state.items, product];
      }
      return cartUpdate(state);
    },
    removecartitems: (state, action) => {
      //find item
      const index = action.payload;
      //remove item from state
      state.items = state.items.filter((element) => element._id !== index._id);
      return cartUpdate(state);
    },
    addshippingaddress: (state, action) => {
      const address = action.payload;
      state.shippingAddress = address;
      return cartUpdate(state);
    },
    clearCart: (state) => {
      state.items = [];
      state.shippingAddress = {};
      state.paymentMethod = "cash";
      if (typeof window !== "undefined") {
        localStorage.removeItem("cart");
      }
      return cartUpdate(state);
    },
  },
});

export const { addshippingaddress, additems, removecartitems, clearCart } =
  cartSlice.actions;
export default cartSlice.reducer;
