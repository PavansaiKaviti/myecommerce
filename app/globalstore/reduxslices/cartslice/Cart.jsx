"use client";
import cartUpdate from "@/utils/updatestocart/Updatecart";
const { createSlice } = require("@reduxjs/toolkit");

const initialState = localStorage.getItem("cart")
  ? JSON.parse(localStorage.getItem("cart"))
  : {
      items: [],
      shippingAddress: {},
      paymentMethod: "cash",
    };

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
  },
});

export const { additems, removecartitems } = cartSlice.actions;
export default cartSlice.reducer;
