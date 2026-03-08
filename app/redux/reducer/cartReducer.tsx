import { createSlice } from '@reduxjs/toolkit';

const normalizeProduct = (product: any) => {
  if (!product) return null;
  const id = product._id || product.id;
  if (!id) return null;
  return { ...product, _id: id, id: id };
};

const isSameVariant = (v1: any = {}, v2: any = {}) => {
  return JSON.stringify(v1) === JSON.stringify(v2);
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    cart: [] as any[],
    buyNowItem: null as any,
  },
  reducers: {

    /* ── ADD TO CART ── */
    addToCart: (state: any, action: any) => {
      const rawProduct = action.payload?.product || action.payload;
      const quantity = action.payload?.quantity || 1;
      const selectedVariant = action.payload?.selectedVariants || {};

      const product = normalizeProduct(rawProduct);
      if (!product) return;

      const itemInCart = state.cart.find(
        (item: any) =>
          item.product._id === product._id &&
          isSameVariant(item.selectedVariant, selectedVariant)
      );

      if (itemInCart) {
        itemInCart.quantity += quantity;
      } else {
        state.cart.push({ product, quantity, selectedVariant });
      }
    },

    /* ── BUY NOW ── quantity now read from payload, not hardcoded */
    setBuyNowItem: (state: any, action: any) => {
      const rawProduct = action.payload?.product;
      const selectedVariant = action.payload?.selectedVariant || {};
      const quantity = action.payload?.quantity || 1; // ✅ FIXED — was hardcoded 1

      const product = normalizeProduct(rawProduct);
      if (!product) return;

      state.buyNowItem = { product, quantity, selectedVariant };
    },

    clearBuyNowItem: (state: any) => {
      state.buyNowItem = null;
    },

    /* ── REMOVE FROM CART ── */
    removeFromCart: (state: any, action: any) => {
      const productId =
        action.payload?.product?._id ||
        action.payload?.product?.id ||
        action.payload?._id ||
        action.payload?.id ||
        action.payload;

      const selectedVariant = action.payload?.selectedVariant || {};
      if (!productId) return;

      state.cart = state.cart.filter(
        (item: any) =>
          !(
            item.product._id === productId &&
            isSameVariant(item.selectedVariant, selectedVariant)
          )
      );
    },

    /* ── REMOVE ORDERED PRODUCTS ── */
    removeOrderedProducts: (state: any, action: any) => {
      const orderedProductIds = action.payload;
      if (!Array.isArray(orderedProductIds)) return;
      state.cart = state.cart.filter(
        (item: any) => !orderedProductIds.includes(item.product._id)
      );
    },

    /* ── INCREMENT ── */
    incrementQuantity: (state: any, action: any) => {
      const productId =
        action.payload?.product?._id ||
        action.payload?.product?.id ||
        action.payload?._id ||
        action.payload?.id ||
        action.payload;

      const selectedVariant = action.payload?.selectedVariant || {};

      const item = state.cart.find(
        (i: any) =>
          i.product._id === productId &&
          isSameVariant(i.selectedVariant, selectedVariant)
      );

      if (item) item.quantity += 1;
    },

    /* ── DECREMENT ── */
    decrementQuantity: (state: any, action: any) => {
      const productId =
        action.payload?.product?._id ||
        action.payload?.product?.id ||
        action.payload?._id ||
        action.payload?.id ||
        action.payload;

      const selectedVariant = action.payload?.selectedVariant || {};

      const item = state.cart.find(
        (i: any) =>
          i.product._id === productId &&
          isSameVariant(i.selectedVariant, selectedVariant)
      );

      if (!item) return;

      if (item.quantity === 1) {
        state.cart = state.cart.filter(
          (i: any) =>
            !(
              i.product._id === productId &&
              isSameVariant(i.selectedVariant, selectedVariant)
            )
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
  removeOrderedProducts,
  setBuyNowItem,
  clearBuyNowItem,
} = cartSlice.actions;

export default cartSlice.reducer;