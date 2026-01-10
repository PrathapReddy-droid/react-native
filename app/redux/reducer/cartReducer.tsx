import { createSlice } from '@reduxjs/toolkit';

export const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        cart: [],
    },
    reducers: {
        // ✅ ADD TO CART WITH QUANTITY
        addToCart: (state: any, action: any) => {
            const { product, quantity = 1 } = action.payload;

            const itemInCart = state.cart.find(
                (item: any) => item.product._id === product._id
            );

            if (itemInCart) {
                itemInCart.quantity += quantity;
            } else {
                state.cart.push({
                    product,
                    quantity,
                });
            }
        },

        // ✅ REMOVE FROM CART
        removeFromCart: (state: any, action: any) => {
            state.cart = state.cart.filter(
                (item: any) => item.product._id !== action.payload
            );
        },

        // ✅ INCREMENT QUANTITY
incrementQuantity: (state: any, action: any) => {
    const item = state.cart.find(
        (i: any) => i.product._id === action.payload
    );

    if (item) {
        item.quantity += 1;
    }
},

decrementQuantity: (state: any, action: any) => {
    const item = state.cart.find(
        (i: any) => i.product._id === action.payload
    );

    if (!item) return;

    if (item.quantity === 1) {
        state.cart = state.cart.filter(
            (i: any) => i.product._id !== action.payload
        );
    } else {
        item.quantity -= 1;
    }
},


    },
});

export const {
    addToCart,
    removeFromCart,
    incrementQuantity,
    decrementQuantity,
} = cartSlice.actions;

export default cartSlice.reducer;
