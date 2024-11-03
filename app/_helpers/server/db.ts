import mongoose from 'mongoose';

const Schema = mongoose.Schema;

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI!);
        console.log('MongoDB connected successfully.');
    } catch (error) {
        if (error instanceof Error) {
            console.error('MongoDB connection error:', error.message);
        } else {
            console.error('An unknown error occurred during MongoDB connection.');
        }
        process.exit(1); // Exit the process with failure
    }
}

mongoose.Promise = global.Promise;

export const db = {
    User: userModel()
};

function userModel() {
    const schema = new Schema({
        username: { type: String, unique: true, required: true },
        hash: { type: String, required: true },
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        // Array of sub-user objects with required username, firstName, and lastName
        subUsers: [{
            username: { type: String, required: true },
            firstName: { type: String, required: true },
            lastName: { type: String, required: true }
        }],
        friends: [{ type: mongoose.Schema.Types.ObjectId, ref:'User'}]
    }, {
        timestamps: true
    });

    schema.set('toJSON', {
        virtuals: true,
        versionKey: false,
        transform: function (doc, ret) {
            delete ret._id;
            delete ret.hash;
        }
    });

    return mongoose.models.User || mongoose.model('User', schema);
}

// Function to add a sub-user with uniqueness check
async function addSubUser(mainUserId: string, subUserData: { username: string; firstName: string; lastName: string }) {
    const User = mongoose.model('User');

    // Check if the username already exists in the User collection
    const existingUser = await User.findOne({ username: subUserData.username });
    if (existingUser) {
        throw new Error('Username already exists in another user account.');
    }

    // Check if the username already exists in any subUsers array
    const userWithSubUser = await User.findOne({ 'subUsers.username': subUserData.username });
    if (userWithSubUser) {
        throw new Error('Username already exists in another sub-user.');
    }

    // Add the sub-user to the main user
    await User.findByIdAndUpdate(mainUserId, {
        $push: { subUsers: subUserData }
    });

    console.log('Sub-user added successfully');
}

// Example usage of adding a sub-user
(async () => {
    try {
        await connectDB();
        await addSubUser('mainUserIdHere', {
            username: 'subuser1',
            firstName: 'Sub',
            lastName: 'User'
        });
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
        } else {
            console.error('An unknown error occurred.');
        }
    }
})();
