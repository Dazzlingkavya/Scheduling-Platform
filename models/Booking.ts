import { InferSchemaType, Model, Schema, Types, model, models } from "mongoose";

const BookingSchema = new Schema(
  {
    slotId: {
      type: Schema.Types.ObjectId,
      ref: "Slot",
      required: true,
      index: true
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    bookedByName: {
      type: String,
      required: true,
      trim: true
    },
    bookedByEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    notes: {
      type: String,
      default: "",
      trim: true
    },
    startTime: {
      type: Date,
      required: true
    },
    endTime: {
      type: Date,
      required: true
    },
    timeZone: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

export type BookingDocument = InferSchemaType<typeof BookingSchema> & {
  _id: Types.ObjectId;
};

const Booking =
  (models.Booking as Model<BookingDocument>) || model("Booking", BookingSchema);

export default Booking;
