import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],          // [{ id, name, price, qty, size, image }]
  totalQuantity: 0,   // sum of all qty
  totalAmount: 0,     // sum of price * qty
};

const calcTotals = (state) => {
  let qty = 0;
  let amount = 0;

  state.items.forEach((item) => {
    qty += item.qty;
    amount += item.qty * item.price;
  });

  state.totalQuantity = qty;
  state.totalAmount = amount;
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // payload: { id, name, price, quantity, size, image }
    addToCart: (state, action) => {
      const { id, name, price, quantity = 1, size, image } = action.payload;

      if (quantity <= 0) return;

      // Check if item already exists in the cart (using the unique id including the size)
      const existing = state.items.find((it) => it.id === id);

      if (existing) {
        // If item exists, update the quantity
        existing.qty = Math.min(existing.qty + quantity, 10); // max quantity 10
        if (image && !existing.image) {
          existing.image = image; // set image if missing
        }
      } else {
        // If item doesn't exist, add a new item to the cart
        state.items.push({
          id,
          name,
          price,
          qty: Math.min(quantity, 10),
          size,
          image: image || null,
        });
      }

      // Recalculate totals
      calcTotals(state);
    },
  


    // Increase quantity of an item by 1 (max 10)
    increaseQty: (state, action) => {
      const item = state.items.find((it) => it.id === action.payload);
      if (item && item.qty < 10) {
        item.qty += 1;
      }
      calcTotals(state);
    },

    // Decrease quantity of an item by 1 (remove from cart if qty is 0)
    decreaseQty: (state, action) => {
      const item = state.items.find((it) => it.id === action.payload);
      if (!item) return;

      if (item.qty > 1) {
        item.qty -= 1;
      } else {
        // If qty reaches 0, remove item from cart
        state.items = state.items.filter((it) => it.id !== action.payload);
      }
      calcTotals(state);
    },

    // Remove item from cart
    removeFromCart: (state, action) => {
      state.items = state.items.filter((it) => it.id !== action.payload);
      calcTotals(state);
    },

    // Clear the entire cart
    clearCart: (state) => {
      state.items = [];
      state.totalQuantity = 0;
      state.totalAmount = 0;
    },
  },
});

// Export the action creators and reducer
export const {
  addToCart,
  increaseQty,
  decreaseQty,
  removeFromCart,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
