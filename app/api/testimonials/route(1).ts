import dbConnect from '../../../lib/db';
import Testimonial from '../../../models/Testimonial';
import { NextResponse } from 'next/server';

export async function GET() {
  await dbConnect();
  try {
    const testimonials = await Testimonial.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: testimonials });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 400 });
  }
}

export async function POST(request: Request) {
  await dbConnect();
  try {
    const body = await request.json();
    const testimonial = await Testimonial.create(body);
        return NextResponse.json({ success: true, data: testimonial }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
