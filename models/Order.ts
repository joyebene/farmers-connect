import mongoose, { Schema, Document, models, model } from "mongoose";

export interface IOrder extends Document {
  buyer: mongoose.Types.ObjectId;
  farmer: mongoose.Types.ObjectId;
  product: mongoose.Types.ObjectId;
  quantity: number;
  totalPrice: number;
  status: "pending" | "accepted" | "rejected" | "delivered";
  createdAt: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
    },

    totalPrice: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "delivered"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

const Order = models.Order || model<IOrder>("Order", OrderSchema);

export default Order;