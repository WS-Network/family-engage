// app/api/users/friends/route.ts or similar

import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../_helpers/server/db';

const User = db.User;

// Add a friend
export async function POST(req: NextRequest) {
    const { userId, friendId } = await req.json();

    if (!userId || !friendId) {
        return NextResponse.json({ error: 'User ID and Friend ID are required' }, { status: 400 });
    }

    try {
        await User.findByIdAndUpdate(userId, {
            $addToSet: { friends: friendId } // Add friendId to friends array if not already present
        });

        return NextResponse.json({ message: 'Friend added successfully' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to add friend' }, { status: 500 });
    }
}

// Remove a friend
export async function DELETE(req: NextRequest) {
    const { userId, friendId } = await req.json();

    if (!userId || !friendId) {
        return NextResponse.json({ error: 'User ID and Friend ID are required' }, { status: 400 });
    }

    try {
        await User.findByIdAndUpdate(userId, {
            $pull: { friends: friendId } // Remove friendId from friends array
        });

        return NextResponse.json({ message: 'Friend removed successfully' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to remove friend' }, { status: 500 });
    }
}

// Get friends list
export async function GET(req: NextRequest) {
    const userId = req.headers.get('userId');

    if (!userId) {
        return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    try {
        const user = await User.findById(userId).populate('friends', 'username firstName lastName');
        return NextResponse.json(user?.friends || [], { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch friends' }, { status: 500 });
    }
}
