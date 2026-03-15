import dbConnect from '../../../lib/db';
import Subscriber from '../../../models/Subscriber';
import { NextResponse } from 'next/server';

const isValidEmail = (value: string) => {
  const email = value.trim();
  if (email.length === 0) return false;
  if (email.length > 254) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export async function GET() {
  await dbConnect();
  try {
    const subscribers = await Subscriber.find({})
      .sort({ createdAt: -1 })
      .select({ email: 1, createdAt: 1 });
    return NextResponse.json({ success: true, data: subscribers });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 400 });
  }
}

export async function POST(request: Request) {
  await dbConnect();
  try {
    const body = await request.json();
    const rawEmail = typeof body?.email === 'string' ? body.email : '';
    const email = rawEmail.trim().toLowerCase();

    if (!isValidEmail(email)) {
      return NextResponse.json({ success: false, error: 'Invalid email' }, { status: 400 });
    }

    const existing = await Subscriber.findOne({ email }).select({ email: 1, createdAt: 1 });
    if (existing) {
      return NextResponse.json({ success: true, data: existing, alreadySubscribed: true });
    }

    const created = await Subscriber.create({ email });
    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    const isDuplicate =
      typeof message === 'string' &&
      (message.includes('E11000 duplicate key error') || message.toLowerCase().includes('duplicate key'));

    if (isDuplicate) {
      return NextResponse.json({ success: true, alreadySubscribed: true });
    }

    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
