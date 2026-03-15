import dbConnect from '../../../../lib/db';
import TrustedLogo from '../../../../models/TrustedLogo';
import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  await dbConnect();
  try {
    const { id } = await params;
    const logo = await TrustedLogo.findById(id);
    if (!logo) return NextResponse.json({ success: false }, { status: 404 });
    return NextResponse.json({ success: true, data: logo });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 400 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  await dbConnect();
  try {
    const { id } = await params;
    const body = await request.json();
    const logo = await TrustedLogo.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });
    if (!logo) return NextResponse.json({ success: false }, { status: 404 });
    return NextResponse.json({ success: true, data: logo });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  await dbConnect();
  try {
    const { id } = await params;
    const deletedLogo = await TrustedLogo.deleteOne({ _id: id });
    if (!deletedLogo) return NextResponse.json({ success: false }, { status: 404 });
    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 400 });
  }
}

