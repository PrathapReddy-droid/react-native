import { combineReducers } from 'redux';
import drawerReducer from './drawerReducer';
import cartReducer from './cartReducer';
import wishListReducer from './wishListReducer';
import addressReducer from './addressSlice'
import userReducer from './User'

const rootReducer = combineReducers({
    drawer: drawerReducer,
    cart: cartReducer,
    wishList : wishListReducer,
    address: addressReducer,
    user: userReducer

});

export default rootReducer;