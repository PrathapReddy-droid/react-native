// store/addressSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  selectedUser: any | null;
}

const initialState: UserState = {
  selectedUser: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setselectedUser(state, action: PayloadAction<any>) {
      state.selectedUser = action.payload;
    },
  },
});

export const { setselectedUser } = userSlice.actions;
export default userSlice.reducer;
