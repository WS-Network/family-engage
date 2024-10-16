import mongoose from 'mongoose';

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
    const schema = new mongoose.Schema({
        username: { type: String, unique: true, required: true },
        hash: { type: String, required: true },
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        // Array of sub-user objects with required username, firstName, and lastName
        subUsers: [{
            username: { type: String, required: true },
            firstName: { type: String, required: true },
            lastName: { type: String, required: true }
        }]
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
