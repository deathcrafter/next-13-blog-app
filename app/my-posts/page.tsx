import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { Types, isValidObjectId } from "mongoose";
import { redirect } from "next/navigation";
import Post from "@/models/post";
import { Post as TPost } from "@/components/post-viewer";
import { PostCard } from "../page";

async function getMyPosts() {}

export default async function Page() {
	const session = await getServerSession(authOptions);
	if (!isValidObjectId(session?.id)) redirect("/");
	await dbConnect();

	const posts = (await Post.find({
		author: new Types.ObjectId(session?.id),
	})) as (TPost & { slug: string })[];

	return (
		<main className="h-full w-full max-w-7xl m-auto">
			<section className="flex flex-col gap-4 p-5">
				{posts.map((post) => (
					<PostCard post={post} />
				))}
			</section>
		</main>
	);
}
