// store/addressSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AddressState {
  selectedAddress: any | null;
}

const initialState: AddressState = {
  selectedAddress: null,
};

const addressSlice = createSlice({
  name: 'address',
  initialState,
  reducers: {
    setSelectedAddress(state, action: PayloadAction<any>) {
      state.selectedAddress = action.payload;
    },
  },
});

export const { setSelectedAddress } = addressSlice.actions;
export default addressSlice.reducer;
