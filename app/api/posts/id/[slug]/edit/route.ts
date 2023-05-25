import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/dbConnect";
import Post from "@/models/post";
import { Types } from "mongoose";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
	req: NextRequest,
	{ params }: { params: { slug: string } }
) {
	const session = await getServerSession(authOptions);

	if (!session)
		return NextResponse.json(
			{},
			{ status: 401, statusText: "Unauthorized request!" }
		);

	await dbConnect();

	const post = await Post.findOne({
		slug: params.slug,
		author: new Types.ObjectId(session.id),
	}).select(["title", "headerImage", "body"]);

	if (!post)
		return NextResponse.json(
			{},
			{ status: 403, statusText: "Access denied!" }
		);

	return NextResponse.json(post);
}

export async function POST(
	req: NextRequest,
	{ params }: { params: { slug: string } }
) {
	const session = await getServerSession(authOptions);

	if (!session)
		return NextResponse.json(
			{},
			{ status: 401, statusText: "Unauthorized request!" }
		);

	await dbConnect();

	const post = await Post.findOne({
		slug: params.slug,
		author: new Types.ObjectId(session.id),
	});

	if (!post)
		return NextResponse.json(
			{},
			{ status: 403, statusText: "Access denied!" }
		);

	const { title, headerImage, body } = (await req.json()) as {
		title: string;
		headerImage: string;
		body: string;
	};

	post.title = title;
	post.body = body;
	post.headerImage = headerImage;

	await post.save();

	return NextResponse.json({ slug: post.slug });
}
