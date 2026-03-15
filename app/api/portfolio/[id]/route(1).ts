import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/db';
import Portfolio from '../../../../models/Portfolio';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await dbConnect();
  const { id } = await params;

  try {
    const portfolio = await Portfolio.findById(id);
    if (!portfolio) {
      return NextResponse.json({ success: false }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: portfolio });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 400 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await dbConnect();
  const { id } = await params;
  const body = await request.json();

  try {
    const portfolio = await Portfolio.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });
    if (!portfolio) {
      return NextResponse.json({ success: false }, { status: 404 });
    }
        return NextResponse.json({ success: true, data: portfolio });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 400 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await dbConnect();
  const { id } = await params;

  try {
    const deletedPortfolio = await Portfolio.deleteOne({ _id: id });
    if (!deletedPortfolio) {
      return NextResponse.json({ success: false }, { status: 404 });
    }
        return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 400 });
  }
}
