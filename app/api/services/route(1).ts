import dbConnect from '../../../lib/db';
import Service from '../../../models/Service';
import { NextResponse } from 'next/server';

export async function GET() {
  await dbConnect();
  try {
    const services = await Service.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: services });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 400 });
  }
}

export async function POST(request: Request) {
  await dbConnect();
  try {
    const body = await request.json();
    const service = await Service.create(body);
        return NextResponse.json({ success: true, data: service }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
