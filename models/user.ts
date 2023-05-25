import mongoose, { Model, Schema, Types, model } from "mongoose";

interface IUser {
	name: string;
	email: string;
	password: string;
	saved: Types.ObjectId[];
}

const UserSchema = new Schema({
	name: { type: String, required: true },
	email: { type: String, required: true },
	password: { type: String, required: true },
	saved: [{ type: Types.ObjectId, ref: "post" }],
});

const User = mongoose.models.user || model<IUser>("user", UserSchema);

export default User as Model<IUser>;
