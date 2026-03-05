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
    hydrateUser(state, action: PayloadAction<any>) {
      state.selectedUser = action.payload;
    },
    clearUser(state) {
      state.selectedUser = null;
    },
  },
});

export const { setselectedUser, hydrateUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
