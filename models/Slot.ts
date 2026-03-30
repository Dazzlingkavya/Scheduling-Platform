import { InferSchemaType, Model, Schema, Types, model, models } from "mongoose";

const SlotSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    date: {
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
    timeZone: {
      type: String,
      required: true
    },
    isBooked: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

export type SlotDocument = InferSchemaType<typeof SlotSchema> & {
  _id: Types.ObjectId;
};

const Slot = (models.Slot as Model<SlotDocument>) || model("Slot", SlotSchema);

export default Slot;
