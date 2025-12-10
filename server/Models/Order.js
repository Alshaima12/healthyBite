// Models/Order.js
import mongoose from 'mongoose';

const OrderItemSchema = new mongoose.Schema(
  {
    productId: { type: String, required: true },   // e.g. 'power-salad'
    name:      { type: String, required: true },
    price:     { type: Number, required: true },
    qty:       { type: Number, required: true },
    image:     { type: String },                  // optional
  },
  { _id: false }
);

const OrderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'HealthyBiteUsers',                   // link to your user collection
      required: true,
    },
    items: {
      type: [OrderItemSchema],
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      default: 'completed', 
    },
  },
  { collection: 'HealthyBiteOrders' }             // collection name in MongoDB
);

const OrderModel = mongoose.model('HealthyBiteOrders', OrderSchema);

export default OrderModel;
