import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Theme from '@/models/Theme';

export async function GET() {
  try {
    await dbConnect();
    const theme = await Theme.findOne();
    // Return empty object or defaults if not found
    return NextResponse.json(theme || {});
  } catch (error) {
    console.error('Error fetching theme:', error);
    return NextResponse.json({ error: 'Failed to fetch theme' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();

    let theme = await Theme.findOne();

    if (theme) {
      Object.assign(theme, body);
      await theme.save();
    } else {
      theme = await Theme.create(body);
    }

    
    return NextResponse.json(theme);
  } catch (error) {
    console.error('Error updating theme:', error);
    return NextResponse.json({ error: 'Failed to update theme' }, { status: 500 });
  }
}
