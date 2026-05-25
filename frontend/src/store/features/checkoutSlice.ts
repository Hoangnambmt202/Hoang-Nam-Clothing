import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ShippingAddress {
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  province: string;
  district: string;
  ward: string;
  detail: string;
}

interface CheckoutState {
  shippingAddress: ShippingAddress | null;
  shippingMethodId: string | null;
  paymentMethod: string;
  notes: string;
  couponCode: string;
}

const initialState: CheckoutState = {
  shippingAddress: null,
  shippingMethodId: null, // Sẽ set mặc định ở component
  paymentMethod: "COD",
  notes: "",
  couponCode: "",
};

const checkoutSlice = createSlice({
  name: "checkout",
  initialState,
  reducers: {
    setShippingAddress: (state, action: PayloadAction<ShippingAddress>) => {
      state.shippingAddress = action.payload;
    },
    setShippingMethod: (state, action: PayloadAction<string>) => {
      state.shippingMethodId = action.payload;
    },
    setPaymentMethod: (state, action: PayloadAction<string>) => {
      state.paymentMethod = action.payload;
    },
    setNotes: (state, action: PayloadAction<string>) => {
      state.notes = action.payload;
    },
    setCouponCode: (state, action: PayloadAction<string>) => {
      state.couponCode = action.payload;
    },
    clearCheckout: (state) => {
      state.shippingAddress = null;
      state.shippingMethodId = null;
      state.paymentMethod = "COD";
      state.notes = "";
      state.couponCode = "";
    },
  },
});

export const {
  setShippingAddress,
  setShippingMethod,
  setPaymentMethod,
  setNotes,
  setCouponCode,
  clearCheckout,
} = checkoutSlice.actions;

export default checkoutSlice.reducer;
