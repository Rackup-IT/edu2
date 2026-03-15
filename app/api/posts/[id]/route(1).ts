import dbConnect from '../../../../lib/db';
import Post from '../../../../models/Post';
import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  await dbConnect();
  try {
    const { id } = await params;
    const post = await Post.findById(id);
    if (!post) return NextResponse.json({ success: false }, { status: 404 });
    return NextResponse.json({ success: true, data: post });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 400 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  await dbConnect();
  try {
    const { id } = await params;
    const body = await request.json();
    const post = await Post.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });
    if (!post) return NextResponse.json({ success: false }, { status: 404 });
        return NextResponse.json({ success: true, data: post });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 400 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  await dbConnect();
  try {
    const { id } = await params;
    const deletedPost = await Post.deleteOne({ _id: id });
    if (!deletedPost) return NextResponse.json({ success: false }, { status: 404 });
        return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 400 });
  }
}
