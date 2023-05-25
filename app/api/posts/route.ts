import dbConnect from "@/lib/dbConnect";
import Post from "@/models/post";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
	// const session = await getServerSession(authOptions);

	await dbConnect();

	const posts = await Post.find().populate("author", "name _id");

	return NextResponse.json(posts);
}
