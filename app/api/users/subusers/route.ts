// app/api/subusers/route.ts

import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    const body = await req.json();
    const { username, firstName, lastName } = body;

    // Validate input
    if (!username || !firstName || !lastName) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Example logic for creating a sub-user
    const newSubUser = { id: Date.now(), username, firstName, lastName };

    return NextResponse.json({ message: 'Sub-user created', subUser: newSubUser }, { status: 201 });
}
