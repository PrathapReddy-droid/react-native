import { combineReducers } from 'redux';
import drawerReducer from './drawerReducer';
import cartReducer from './cartReducer';
import wishListReducer from './wishListReducer';
import addressReducer from './addressSlice'
import userReducer from './User'
import paymentReducer from './paymentReducer'

const rootReducer = combineReducers({
    drawer: drawerReducer,
    cart: cartReducer,
    wishList : wishListReducer,
    address: addressReducer,
    user: userReducer,
    payment:paymentReducer

});

export default rootReducer;