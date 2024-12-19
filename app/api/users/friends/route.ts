import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../_helpers/server/db';
import mongoose from 'mongoose';

const User = db.User;

// Utility function to validate MongoDB ObjectIds
const isValidObjectId = (id: string) => mongoose.Types.ObjectId.isValid(id);

// Add a friend
export async function POST(req: NextRequest) {
    try {
        const { userId, friendId } = await req.json();

        if (!userId || !friendId) {
            return NextResponse.json(
                { error: 'User ID and Friend ID are required' },
                { status: 400 }
            );
        }

        if (!isValidObjectId(userId) || !isValidObjectId(friendId)) {
            return NextResponse.json(
                { error: 'Invalid User ID or Friend ID format' },
                { status: 400 }
            );
        }

        await User.findByIdAndUpdate(userId, {
            $addToSet: { friends: friendId }, // Add friendId to friends array if not already present
        });

        return NextResponse.json({ message: 'Friend added successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error adding friend:', error);
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
    try {
        const userId = req.headers.get('userId');

        if (!userId) {
            return NextResponse.json(
                { error: 'User ID is required' },
                { status: 400 }
            );
        }

        if (!isValidObjectId(userId)) {
            return NextResponse.json(
                { error: 'Invalid User ID format' },
                { status: 400 }
            );
        }

        const user = await User.findById(userId).populate(
            'friends',
            'username firstName lastName'
        );

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(user.friends || [], { status: 200 });
    } catch (error) {
        console.error('Error fetching friends:', error);
        return NextResponse.json({ error: 'Failed to fetch friends' }, { status: 500 });
    }
}
