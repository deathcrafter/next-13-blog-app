import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import slug from "slug";
import { randomBytes } from "crypto";
import dbConnect from "@/lib/dbConnect";
import Post from "@/models/post";

export async function POST(request: NextRequest) {
	const session = await getServerSession(authOptions);
	if (!session)
		return NextResponse.json(
			{},
			{ status: 401, statusText: "Unauthorized access!" }
		);

	console.log(session);

	const { title, headerImage, body } = (await request.json()) as {
		title: string;
		headerImage: string;
		body: string;
	};

	const randomStr: string = randomBytes(4).toString("hex");
	const titleSlug =
		slug(title, { lower: true }).substring(0, 18) + "-" + randomStr;

	await dbConnect();

	await Post.create({
		author: session.id,
		title,
		headerImage,
		body,
		slug: titleSlug,
		date: new Date(),
	});

	return NextResponse.json({ slug: titleSlug });
}
