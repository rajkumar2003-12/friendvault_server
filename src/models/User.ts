import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    _id: mongoose.Types.ObjectId;
    username: string;
    password: string;
    friends: mongoose.Types.ObjectId[];
    friendRequests: mongoose.Types.ObjectId[];
}

const UserSchema: Schema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    friendRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

export default mongoose.model<IUser>('User', UserSchema);
