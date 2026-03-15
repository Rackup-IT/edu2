import dbConnect from '../../../../lib/db';
import Service from '../../../../models/Service';
import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  await dbConnect();
  try {
    const { id } = await params;
    const service = await Service.findById(id);
    if (!service) return NextResponse.json({ success: false }, { status: 404 });
    return NextResponse.json({ success: true, data: service });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 400 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  await dbConnect();
  try {
    const { id } = await params;
    const body = await request.json();
    const service = await Service.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });
    if (!service) return NextResponse.json({ success: false }, { status: 404 });
        return NextResponse.json({ success: true, data: service });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 400 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  await dbConnect();
  try {
    const { id } = await params;
    const deletedService = await Service.deleteOne({ _id: id });
    if (!deletedService) return NextResponse.json({ success: false }, { status: 404 });
        return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 400 });
  }
}
