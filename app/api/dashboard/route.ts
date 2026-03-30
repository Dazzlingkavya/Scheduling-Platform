import { NextRequest, NextResponse } from "next/server";

import { suggestBestMeetingSlot } from "@/lib/ai";
import { requireApiUser } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { serializeDocument } from "@/lib/serializers";
import Booking from "@/models/Booking";
import Slot from "@/models/Slot";

export async function GET(request: NextRequest) {
  try {
    const user = await requireApiUser(request);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    await connectToDatabase();

    const [slots, bookings] = await Promise.all([
      Slot.find({ userId: user._id }).sort({ startTime: 1 }).lean(),
      Booking.find({ userId: user._id }).sort({ startTime: 1 }).lean()
    ]);

    const suggestion = suggestBestMeetingSlot(
      slots
        .filter((slot) => !slot.isBooked && new Date(slot.startTime).getTime() > Date.now())
        .map((slot) => ({
          _id: slot._id.toString(),
          date: slot.date,
          startTime: slot.startTime,
          endTime: slot.endTime
        }))
    );

    return NextResponse.json({
      user: {
        name: user.name,
        email: user.email,
        username: user.username
      },
      bookingLink: `${process.env.NEXT_PUBLIC_APP_URL ?? ""}/book/${user.username}`,
      slots: slots.map((slot) =>
        serializeDocument({
          ...slot,
          startTime: slot.startTime.toISOString(),
          endTime: slot.endTime.toISOString()
        })
      ),
      bookings: bookings.map((booking) =>
        serializeDocument({
          ...booking,
          startTime: booking.startTime.toISOString(),
          endTime: booking.endTime.toISOString()
        })
      ),
      suggestion: suggestion
        ? {
            reasoning: suggestion.reasoning,
            slot: {
              ...suggestion.slot,
              startTime: new Date(suggestion.slot.startTime).toISOString(),
              endTime: new Date(suggestion.slot.endTime).toISOString()
            }
          }
        : null
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Could not load dashboard."
      },
      { status: 500 }
    );
  }
}
