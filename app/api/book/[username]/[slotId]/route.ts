import { Types } from "mongoose";
import { NextResponse } from "next/server";

import { syncCalendarEvent } from "@/lib/calendar";
import { connectToDatabase } from "@/lib/mongodb";
import Booking from "@/models/Booking";
import Slot from "@/models/Slot";
import User from "@/models/User";

export async function POST(
  request: Request,
  {
    params
  }: {
    params: Promise<{ username: string; slotId: string }>;
  }
) {
  try {
    const { username, slotId } = await params;
    const { bookedByName, bookedByEmail, notes, timeZone } = await request.json();

    if (!bookedByName || !bookedByEmail || !timeZone) {
      return NextResponse.json(
        { error: "Name, email, and time zone are required." },
        { status: 400 }
      );
    }

    if (!Types.ObjectId.isValid(slotId)) {
      return NextResponse.json({ error: "Invalid slot id." }, { status: 400 });
    }

    await connectToDatabase();

    const user = await User.findOne({ username: username.toLowerCase() });

    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    const slot = await Slot.findOneAndUpdate(
      {
        _id: slotId,
        userId: user._id,
        isBooked: false,
        startTime: { $gt: new Date() }
      },
      {
        $set: {
          isBooked: true
        }
      },
      {
        new: true
      }
    );

    if (!slot) {
      return NextResponse.json(
        { error: "This slot is no longer available." },
        { status: 409 }
      );
    }

    const booking = await Booking.create({
      slotId: slot._id,
      userId: user._id,
      bookedByName: String(bookedByName).trim(),
      bookedByEmail: String(bookedByEmail).toLowerCase().trim(),
      notes: String(notes ?? "").trim(),
      startTime: slot.startTime,
      endTime: slot.endTime,
      timeZone
    });

    await syncCalendarEvent({
      userId: user._id.toString(),
      bookingId: booking._id.toString(),
      title: `${user.name} meeting with ${booking.bookedByName}`,
      startTime: slot.startTime,
      endTime: slot.endTime,
      attendeeName: booking.bookedByName,
      attendeeEmail: booking.bookedByEmail
    });

    return NextResponse.json({
      success: true,
      booking: {
        _id: booking._id.toString(),
        bookedByName: booking.bookedByName,
        bookedByEmail: booking.bookedByEmail,
        startTime: booking.startTime.toISOString(),
        endTime: booking.endTime.toISOString()
      }
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Could not create booking."
      },
      { status: 500 }
    );
  }
}
