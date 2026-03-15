import dbConnect from '../../../lib/db';
import TrustedLogo from '../../../models/TrustedLogo';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  await dbConnect();
  try {
    const url = new URL(request.url);
    const active = url.searchParams.get('active');

    const filter = active === 'true' ? { isActive: true } : {};

    const logos = await TrustedLogo.find(filter).sort({ position: 1, createdAt: 1 });
    return NextResponse.json({ success: true, data: logos });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 400 });
  }
}

export async function POST(request: Request) {
  await dbConnect();
  try {
    const body = await request.json();

    if (body.position === undefined || body.position === null || Number.isNaN(Number(body.position))) {
      const last = await TrustedLogo.findOne({}).sort({ position: -1, createdAt: -1 });
      const nextPosition = last?.position !== undefined ? Number(last.position) + 1 : 0;
      body.position = nextPosition;
    }

    const logo = await TrustedLogo.create(body);
    return NextResponse.json({ success: true, data: logo }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}

