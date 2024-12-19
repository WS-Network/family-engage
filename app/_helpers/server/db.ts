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
    User: userModel(),
    GamingProfile: gamingProfileModel()
};

function userModel() {
    const schema = new Schema({
        username: { type: String, unique: true, required: true },
        hash: { type: String, required: true },
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        // Array of sub-user objects with required username, firstName, and lastName
        subUsers: [{
            username: { type: String, unique: true ,required: true },
            firstName: { type: String, required: true },
            lastName: { type: String, required: true }
        }],
        friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
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

function gamingProfileModel() {
    const schema = new Schema({
        username: { type: String, ref: 'User', required: true, unique: true }, // Reference the User model's username
        avatarUrl: { type: String },
        playtime: { type: Number, default: 0 },
        achievements: [{
            gameName: { type: String, required: true },
            name: { type: String, required: true },
            description: { type: String },
            rarity: { type: String, enum: ['Common', 'Rare', 'Epic', 'Legendary'], required: true },
            dateUnlocked: { type: Date },
            icon: { type: String },
            unlockedPercentage: { type: Number },
        }],
        playedGames: [{
            name: { type: String, required: true },
            hoursPlayed: { type: Number, default: 0 },
            lastPlayed: { type: Date },
            achievementsUnlocked: { type: Number, default: 0 },
            totalAchievements: { type: Number, default: 0 },
        }]
    }, {
        timestamps: true // Automatically adds createdAt and updatedAt fields
    });

    return mongoose.models.GamingProfile || mongoose.model('GamingProfile', schema);
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

// Example usage of adding a gaming profile
async function addGamingProfile(username: string, profileData: { avatarUrl?: string; playtime?: number; achievements?: Record<string, any> }) {
    try {
        const GamingProfile = mongoose.model('GamingProfile');

        // Check if the user exists
        const User = mongoose.model('User');
        const userExists = await User.findOne({ username });
        if (!userExists) {
            throw new Error('User does not exist.');
        }

        // Create or update the gaming profile
        const profile = await GamingProfile.findOneAndUpdate(
            { username },
            { username, ...profileData },
            { upsert: true, new: true } // Create if not exists, update otherwise
        );

        console.log('Gaming profile added/updated successfully:', profile);
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error managing gaming profile:', error.message);
        } else {
            console.error('An unknown error occurred while managing the gaming profile.');
        }
    }
}

// Example usage of adding/updating a gaming profile
(async () => {
    try {
        await connectDB();
        await addGamingProfile('subuser1', {
            avatarUrl: 'http://example.com/avatar.png',
            playtime: 120,
            achievements: { level: 5, trophies: 10 }
        });
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
        } else {
            console.error('An unknown error occurred.');
        }
    }
})();
