// app/api/subusers/route.ts

import { NextRequest, NextResponse } from 'next/server';
import {db} from '../../../_helpers/server/db'

const User = db.User;

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

export async function GET(req: Request) {
    const currentUserId = req.headers.get('userId');  // Get the current user ID from the headers/session
    
    try {
        // Fetch the current user and populate the subUsers field
        const user = await User.findById(currentUserId).populate('subUsers').exec();

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json(user.subUsers, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch sub-users' }, { status: 500 });
    }
}