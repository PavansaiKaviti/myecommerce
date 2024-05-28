"use client";
import addDecimals from "@/utils/decimalpoint/Decimal";

const cartUpdate = (state) => {
  //calculate  items price
  state.itemsPrice = addDecimals(
    state.items.reduce((acc, item) => {
      return (acc += item.price * item.qty);
    }, 0)
  );
  //calculate shipping price
  state.shippingPrice = addDecimals(state.itemsPrice > 100 ? 0 : 10);
  //tax price
  state.taxPrice = addDecimals(Number(0.15 * state.itemsPrice).toFixed(2));
  //total price
  state.totalPrice = (
    Number(state.itemsPrice) +
    Number(state.shippingPrice) +
    Number(state.taxPrice)
  ).toFixed(2);
  localStorage.setItem("cart", JSON.stringify(state));

  return state;
};

export default cartUpdate;
