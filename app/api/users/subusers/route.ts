import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../_helpers/server/db';

const User = db.User;

export async function POST(req: NextRequest) {
    const body = await req.json();
    const { userId, username, firstName, lastName } = body;  // Expect the main user's ID

    // Validate input
    if (!userId || !username || !firstName || !lastName) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    try {
        // Find the main user by userId
        const mainUser = await User.findById(userId);

        if (!mainUser) {
            return NextResponse.json({ error: 'Main user not found' }, { status: 404 });
        }

        // Create a new sub-user object
        const newSubUser = {
            username,
            firstName,
            lastName
        };

        // Add the sub-user to the main user's subUsers array
        mainUser.subUsers.push(newSubUser);

        // Save the updated user document
        await mainUser.save();

        return NextResponse.json({ message: 'Sub-user created', subUser: newSubUser }, { status: 201 });
    } catch (error) {
        console.error('Error creating sub-user:', error);
        return NextResponse.json({ error: 'Failed to create sub-user' }, { status: 500 });
    }
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
