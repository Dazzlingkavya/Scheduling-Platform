import CalendarEvent from "@/models/CalendarEvent";

type SyncCalendarEventInput = {
  userId: string;
  bookingId: string;
  title: string;
  startTime: Date;
  endTime: Date;
  attendeeName: string;
  attendeeEmail: string;
};

export async function syncCalendarEvent(input: SyncCalendarEventInput) {
  return CalendarEvent.create({
    userId: input.userId,
    bookingId: input.bookingId,
    provider: "google-simulated",
    title: input.title,
    startTime: input.startTime,
    endTime: input.endTime,
    status: "confirmed",
    metadata: {
      attendeeName: input.attendeeName,
      attendeeEmail: input.attendeeEmail
    }
  });
}
