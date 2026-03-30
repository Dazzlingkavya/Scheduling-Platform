import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

import { connectToDatabase } from "@/lib/mongodb";
import User, { type UserDocument } from "@/models/User";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}

export const AUTH_COOKIE_NAME = "calendlite_token";

type SessionPayload = {
  userId: string;
  email: string;
  username: string;
};

export function signSessionToken(payload: SessionPayload) {
  return jwt.sign(payload, JWT_SECRET as string, {
    expiresIn: "7d",
  });
}

export function verifySessionToken(token: string) {
  return jwt.verify(token, JWT_SECRET as string) as SessionPayload;
}

export function getTokenFromRequest(request: NextRequest) {
  return request.cookies.get(AUTH_COOKIE_NAME)?.value;
}

export async function getSessionUserFromCookies() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  try {
    const payload = verifySessionToken(token);
    await connectToDatabase();
    return (await User.findById(payload.userId).lean()) as UserDocument | null;
  } catch {
    return null;
  }
}

export async function requireSessionUser() {
  const user = await getSessionUserFromCookies();

  if (!user) {
    redirect("/login");
  }

  return user;
}

export async function requireApiUser(request: NextRequest) {
  const token = getTokenFromRequest(request);

  if (!token) {
    return null;
  }

  try {
    const payload = verifySessionToken(token);
    await connectToDatabase();
    return (await User.findById(payload.userId)) as UserDocument | null;
  } catch {
    return null;
  }
}