import dbConnect from '../../../lib/db';
import Post from '../../../models/Post';
import { NextResponse } from 'next/server';

export async function GET() {
  await dbConnect();
  try {
    const posts = await Post.find({}).sort({ date: -1 });
    return NextResponse.json({ success: true, data: posts });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 400 });
  }
}

export async function POST(request: Request) {
  await dbConnect();
  try {
    const body = await request.json();
    const post = await Post.create(body);
        return NextResponse.json({ success: true, data: post }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
