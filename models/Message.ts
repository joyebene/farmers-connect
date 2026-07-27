import { Schema, model, models, Document, Types } from "mongoose";

export interface IMessage extends Document {
  farmer: Types.ObjectId;

  fullName: string;

  phone: string;

  email?: string;

  message: string;

  status: "unread" | "read";

  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema<IMessage>(
  {
    farmer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: "",
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      enum: ["unread", "read"],
      default: "unread",
    },
  },
  {
    timestamps: true,
  }
);

const Message =
  models.Message || model<IMessage>("Message", MessageSchema);

export default Message;