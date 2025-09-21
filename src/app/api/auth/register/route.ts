import { NextResponse } from "next/server";

import { User } from "@/models/User";
import { hashPassword } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const { username, email, password } = await req.json();

    if (!username || !email || !password) {
      return NextResponse.json({ error: "All fields required" }, { status: 400 });
    }

    //@ts-expect-error // Fix mongoose typing issue
    const existing = await User.findOne({ email });
    if (existing) {
      return NextResponse.json({ error: "Email already in use" }, { status: 400 });
    }

    const hashedPassword = await hashPassword(password);
    //@ts-expect-error // Fix mongoose typing issue
    const user = await User.create({ username, email, password: hashedPassword });

    return NextResponse.json({ message: "User registered successfully" }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
