import dbConnect from "@/lib/dbConnect";
import Post from "@/models/post";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { Types } from "mongoose";
import User from "@/models/user";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(
	req: NextRequest,
	{ params }: { params: { slug: string } }
) {
	const session = await getServerSession(authOptions);

	await dbConnect();

	const post = await Post.aggregate([
		{
			$match: {
				slug: params.slug,
			},
		},
		{
			$addFields: {
				isAuthor: {
					$eq: [new Types.ObjectId(session?.id), "$author"],
				},
				liked: {
					$in: [new Types.ObjectId(session?.id), "$likes"],
				},
				likes: {
					$size: "$likes",
				},
			},
		},
	]);

	if (!post.length)
		return NextResponse.json(
			{},
			{ status: 404, statusText: "Blog post not found!" }
		);

	await User.populate(post[0], { path: "author", select: "name _id" });
	await User.populate(post[0], {
		path: "comments.author",
		select: "name _id",
	});

	return NextResponse.json(post[0]);
}

export async function POST(
	req: NextRequest,
	{ params }: { params: { slug: string } }
) {
	const { action, data } = (await req.json()) as {
		action: "like" | "comment" | "share";
		data: boolean | string;
	};

	const session = await getServerSession(authOptions);

	if (!session)
		return NextResponse.json(
			{},
			{ status: 401, statusText: "Unauthorized request!" }
		);

	await dbConnect();

	const post = await Post.findOne({ slug: params.slug });

	if (!post)
		return NextResponse.json(
			{},
			{ status: 404, statusText: "Blog post not found!" }
		);

	switch (action) {
		case "like": {
			const liked = data as boolean;
			if (!liked) {
				post.likes = post.likes.filter(
					(id) => id.toString() !== session.id
				);
			} else {
				post.likes = [...post.likes, new Types.ObjectId(session.id)];
			}
			await post.save();
			return NextResponse.json({ action, data: liked });
		}
		case "comment": {
			const body = data as string;
			post.comments.push({
				author: new Types.ObjectId(session.id),
				body,
			});
			console.log(post);
			await post.save();
			const comments = post.comments.slice();
			await User.populate(comments, {
				path: "author",
				select: "name _id",
			});
			return NextResponse.json({ action, data: comments });
		}
		case "share":
			break;
	}
}
