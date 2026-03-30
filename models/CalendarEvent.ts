import { InferSchemaType, Model, Schema, Types, model, models } from "mongoose";

const CalendarEventSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    bookingId: {
      type: Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
      index: true
    },
    provider: {
      type: String,
      required: true,
      default: "google-simulated"
    },
    title: {
      type: String,
      required: true
    },
    startTime: {
      type: Date,
      required: true
    },
    endTime: {
      type: Date,
      required: true
    },
    status: {
      type: String,
      default: "confirmed"
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {}
    }
  },
  {
    timestamps: true
  }
);

export type CalendarEventDocument = InferSchemaType<typeof CalendarEventSchema> & {
  _id: Types.ObjectId;
};

const CalendarEvent =
  (models.CalendarEvent as Model<CalendarEventDocument>) ||
  model("CalendarEvent", CalendarEventSchema);

export default CalendarEvent;
