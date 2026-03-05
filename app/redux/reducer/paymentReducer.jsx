const initialState = {
    paymentMethod: ""
};

const paymentReducer = (state = initialState, action) => {
    switch (action.type) {
        case "SET_PAYMENT_METHOD":
            return {
                ...state,
                paymentMethod: action.payload
            };

        default:
            return state;
    }
};

export default paymentReducer;
