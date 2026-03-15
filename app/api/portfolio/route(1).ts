import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/db';
import Portfolio from '../../../models/Portfolio';

export async function GET() {
  await dbConnect();
  try {
    const portfolios = await Portfolio.find({});
    return NextResponse.json({ success: true, data: portfolios });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 400 });
  }
}

export async function POST(request: Request) {
  await dbConnect();
  try {
    const body = await request.json();
    const portfolio = await Portfolio.create(body);
        return NextResponse.json({ success: true, data: portfolio }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error }, { status: 400 });
  }
}
