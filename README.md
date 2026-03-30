# Calendlite

A simple Calendly-style scheduling app built with Next.js App Router, Tailwind CSS, MongoDB, and JWT authentication.

## Features

- User registration and login with hashed passwords
- Protected dashboard with upcoming meetings and availability management
- Public booking page at `/book/[username]`
- Booking without login
- Simulated calendar sync stored in MongoDB
- Basic AI suggestion for the best meeting slot
- Time zone-aware rendering with the Intl API
- Vercel-ready structure

## Tech Stack

- Next.js App Router
- Tailwind CSS
- MongoDB with Mongoose
- JWT authentication with secure cookies

## Project Structure

```text
app/
  login/
  register/
  dashboard/
  book/[username]/
  api/
components/
lib/
models/
```

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Copy environment variables:

```bash
cp .env.example .env.local
```

3. Add your MongoDB connection string and JWT secret to `.env.local`.

4. Start the development server:

```bash
npm run dev
```

5. Open `http://localhost:3000`.

## Environment Variables

```env
MONGODB_URI=your-mongodb-uri
JWT_SECRET=your-long-random-secret
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## MongoDB Models

- `User`: `name`, `email`, `password`, `username`
- `Slot`: `userId`, `date`, `startTime`, `endTime`
- `Booking`: `slotId`, `bookedByName`, `bookedByEmail`
- `CalendarEvent`: simulated calendar sync record for future Google Calendar integration

## How Booking Works

1. A logged-in user creates availability slots from the dashboard.
2. The app exposes a public booking page at `/book/[username]`.
3. Guests pick an available slot and submit their details without logging in.
4. The booking is stored in MongoDB and the slot is marked as booked.
5. A simulated calendar event is created in the `CalendarEvent` collection.

## AI Suggestion Logic

The AI feature is intentionally lightweight so the project stays realistic for a one-day implementation.

It scores open slots based on:

- Whether the slot is still upcoming
- Whether it falls on a core working day
- Whether it lands in a high-conversion midday or afternoon window

The top-ranked slot is shown on the dashboard and highlighted on the public booking page.

## Deploying to Vercel

1. Push the project to GitHub.
2. Import the repository into Vercel.
3. Add these environment variables in the Vercel dashboard:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `NEXT_PUBLIC_APP_URL`
4. Deploy.

For production, set `NEXT_PUBLIC_APP_URL` to your deployed domain.

## Google Calendar Integration Path

This project stores calendar events in the `CalendarEvent` collection through `syncCalendarEvent`.

To plug in the real Google Calendar API later:

1. Replace the simulated implementation in `lib/calendar.ts`.
2. Add OAuth tokens or service account credentials.
3. Call the Google Calendar API inside `syncCalendarEvent` after a booking is created.

## Notes

- The AI suggestion feature uses simple scoring logic instead of an external model to keep the app buildable within one day.
- All dates are stored in UTC and formatted for each viewer with the browser time zone.
