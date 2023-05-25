import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/dbConnect";
import Post from "@/models/post";
import { Types, isValidObjectId } from "mongoose";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Page({ params }: { params: { slug: string } }) {
	const session = await getServerSession(authOptions);

	await dbConnect();

	if (!isValidObjectId(session?.id))
		return redirect("/posts/id/" + params.slug);

	const post = await Post.findOne({
		author: new Types.ObjectId(session?.id),
		slug: params.slug,
	});

	if (!post) return redirect("/");

	await post.deleteOne();

	return redirect("/");
}
