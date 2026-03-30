import { NextRequest, NextResponse } from "next/server";

import { zonedDateTimeToUtc, isValidTimeZone } from "@/lib/dates";
import { requireApiUser } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import Slot from "@/models/Slot";

export async function POST(request: NextRequest) {
  try {
    const user = await requireApiUser(request);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const { date, startTime, endTime, timeZone } = await request.json();

    if (!date || !startTime || !endTime || !timeZone) {
      return NextResponse.json(
        { error: "Date, start time, end time, and time zone are required." },
        { status: 400 }
      );
    }

    if (!isValidTimeZone(timeZone)) {
      return NextResponse.json(
        { error: "Please provide a valid IANA time zone." },
        { status: 400 }
      );
    }

    const start = zonedDateTimeToUtc(date, startTime, timeZone);
    const end = zonedDateTimeToUtc(date, endTime, timeZone);

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      return NextResponse.json({ error: "Invalid date or time." }, { status: 400 });
    }

    if (end <= start) {
      return NextResponse.json(
        { error: "End time must be after start time." },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const overlappingSlot = await Slot.findOne({
      userId: user._id,
      startTime: { $lt: end },
      endTime: { $gt: start }
    });

    if (overlappingSlot) {
      return NextResponse.json(
        { error: "This slot overlaps with an existing availability block." },
        { status: 409 }
      );
    }

    const slot = await Slot.create({
      userId: user._id,
      date,
      startTime: start,
      endTime: end,
      timeZone
    });

    return NextResponse.json({
      success: true,
      slot: {
        _id: slot._id.toString(),
        date: slot.date,
        startTime: slot.startTime.toISOString(),
        endTime: slot.endTime.toISOString(),
        timeZone: slot.timeZone,
        isBooked: slot.isBooked
      }
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Could not create slot."
      },
      { status: 500 }
    );
  }
}
