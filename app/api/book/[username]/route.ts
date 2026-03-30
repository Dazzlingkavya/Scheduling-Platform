import { NextResponse } from "next/server";

import { suggestBestMeetingSlot } from "@/lib/ai";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import Slot from "@/models/Slot";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;

    await connectToDatabase();

    const user = await User.findOne({ username: username.toLowerCase() }).lean();

    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    const slots = await Slot.find({
      userId: user._id,
      isBooked: false,
      startTime: { $gt: new Date() }
    })
      .sort({ startTime: 1 })
      .lean();

    const suggestion = suggestBestMeetingSlot(
      slots.map((slot) => ({
        _id: slot._id.toString(),
        date: slot.date,
        startTime: slot.startTime,
        endTime: slot.endTime
      }))
    );

    return NextResponse.json({
      user: {
        name: user.name,
        username: user.username
      },
      slots: slots.map((slot) => ({
        _id: slot._id.toString(),
        date: slot.date,
        startTime: slot.startTime.toISOString(),
        endTime: slot.endTime.toISOString(),
        timeZone: slot.timeZone
      })),
      suggestedSlotId: suggestion?.slotId ?? null
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Could not load booking slots."
      },
      { status: 500 }
    );
  }
}
