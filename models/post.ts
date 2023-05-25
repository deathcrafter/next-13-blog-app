import mongoose, { Model, Schema, Types, model } from "mongoose";

interface IPost {
	author: Types.ObjectId;
	date: Date;
	title: string;
	headerImage: string;
	body: string;
	slug: string;
	likes: Types.ObjectId[];
	comments: {
		author: Types.ObjectId;
		body: string;
	}[];
}

const PostSchema = new Schema({
	author: { type: Schema.Types.ObjectId, required: true, ref: "user" },
	date: { type: Date },
	title: { type: String, required: true },
	headerImage: { type: String },
	body: { type: String, required: true },
	slug: { type: String, required: true },
	likes: [{ type: Schema.Types.ObjectId, ref: "user" }],
	comments: [
		{
			author: {
				type: Schema.Types.ObjectId,
				ref: "user",
			},
			body: { type: String },
		},
	],
});

const Post = mongoose.models.post || model("post", PostSchema);

export default Post as Model<IPost>;
