import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Hero from '@/models/Hero';

export async function GET() {
  try {
    await dbConnect();
    // Find the first document (singleton)
    const hero = await Hero.findOne();

    // Return empty object if no hero settings exist yet, client will handle defaults
    return NextResponse.json(hero || {});
  } catch (error) {
    console.error('Error fetching hero settings:', error);
    return NextResponse.json({ error: 'Failed to fetch hero settings' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();

    // We only want one Hero document, so we update the first one we find, or create it if it doesn't exist.
    // upsert: true creates it if it doesn't match anything.
    // Since we don't have a unique ID to search for, we can search for an empty criteria {} which matches everything,
    // but to be safe and ensure we only ever have one, we can check count or just use findOneAndUpdate.

    // However, findOneAndUpdate with {} might match any document. If we want a strict singleton, we should probably
    // use a fixed ID or just delete all others. But simple approach:

    // Check if one exists
    let hero = await Hero.findOne();

    if (hero) {
      // Update existing
      Object.assign(hero, body);
      await hero.save();
    } else {
      // Create new
      hero = await Hero.create(body);
    }

    
    return NextResponse.json(hero);
  } catch (error) {
    console.error('Error updating hero settings:', error);
    return NextResponse.json({ error: 'Failed to update hero settings' }, { status: 500 });
  }
}
