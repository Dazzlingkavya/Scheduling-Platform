import { NextRequest, NextResponse } from "next/server";

import { suggestBestMeetingSlot } from "@/lib/ai";
import { requireApiUser } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import Slot from "@/models/Slot";

export async function GET(request: NextRequest) {
  try {
    const user = await requireApiUser(request);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    await connectToDatabase();

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

    return NextResponse.json({ suggestion });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Could not generate a meeting suggestion."
      },
      { status: 500 }
    );
  }
}
