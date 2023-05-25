import PostViewer, { Post as TPost } from "@/components/post-viewer";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/dbConnect";
import Post from "@/models/post";
import mongoose, { Types } from "mongoose";
import User from "@/models/user";
import PostInteractions from "@/components/post-interactions";

type ExtendedPost = TPost & {
	likes: number;
	liked: boolean;
	comments: {
		author: { name: string; _id: string };
		body: string;
	}[];
	isAuthor: boolean;
};

async function getPost(slug: string): Promise<ExtendedPost> {
	const session = await getServerSession(authOptions);

	await dbConnect();

	const post = await Post.aggregate([
		{
			$match: {
				slug: slug,
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
		{
			$project: {
				author: true,
				isAuthor: true,
				title: true,
				headerImage: true,
				body: true,
				date: true,
				liked: true,
				likes: true,
				comments: true,
			},
		},
	]);

	if (!post.length) throw new Error("Post not found!");

	await User.populate(post[0], { path: "author", select: "name _id" });
	await User.populate(post[0], {
		path: "comments.author",
		select: "name _id",
	});

	return post[0] as ExtendedPost;
}

export default async function Page({ params }: { params: { slug: string } }) {
	const post = await getPost(params.slug);

	return (
		<main className="max-w-7xl p-4 m-auto">
			<PostViewer post={JSON.stringify(post)} isJSON={true} />
			<PostInteractions post={JSON.stringify(post)} slug={params.slug} />
		</main>
	);
}
