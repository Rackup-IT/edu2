import dbConnect from '../../../../lib/db';
import Testimonial from '../../../../models/Testimonial';
import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  await dbConnect();
  try {
    const { id } = await params;
    const testimonial = await Testimonial.findById(id);
    if (!testimonial) return NextResponse.json({ success: false }, { status: 404 });
    return NextResponse.json({ success: true, data: testimonial });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 400 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  await dbConnect();
  try {
    const { id } = await params;
    const body = await request.json();
    const testimonial = await Testimonial.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });
    if (!testimonial) return NextResponse.json({ success: false }, { status: 404 });
        return NextResponse.json({ success: true, data: testimonial });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 400 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  await dbConnect();
  try {
    const { id } = await params;
    const deletedTestimonial = await Testimonial.deleteOne({ _id: id });
    if (!deletedTestimonial) return NextResponse.json({ success: false }, { status: 404 });
        return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 400 });
  }
}
