import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import About from '@/models/About';

export async function GET() {
  try {
    await dbConnect();
    const about = await About.findOne();
    return NextResponse.json(about || {});
  } catch (error) {
    console.error('Error fetching about data:', error);
    return NextResponse.json({ error: 'Failed to fetch about data' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();

    let about = await About.findOne();

    if (about) {
      Object.assign(about, body);
      await about.save();
    } else {
      about = await About.create(body);
    }

    
    return NextResponse.json(about);
  } catch (error) {
    console.error('Error updating about data:', error);
    return NextResponse.json({ error: 'Failed to update about data' }, { status: 500 });
  }
}
