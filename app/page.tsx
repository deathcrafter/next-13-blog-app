// "use client";
// import { useSession } from "next-auth/react";

import { Post as TPost } from "@/components/post-viewer";
import dbConnect from "@/lib/dbConnect";
import Post from "@/models/post";
import { format } from "date-fns";
import Link from "next/link";

async function getPosts() {
	await dbConnect();

	const posts = await Post.find().populate("author", "name _id");

	return posts;
}

export function PostCard({ post }: { post: TPost & { slug: string } }) {
	return (
		<Link
			href={"/posts/id/" + post.slug}
			className="card min-h-[12rem] justify-stretch overflow-hidden"
			style={{
				backgroundImage: `url('${post.headerImage}')`,
				backgroundRepeat: "no-repeat",
				backgroundSize: "cover",
				backgroundPosition: "center center",
			}}
		>
			<div className="w-full grow flex flex-col justify-end p-4 backdrop-brightness-75 backdrop-blur-sm">
				<h2 className="text-3xl font-semibold">{post.title}</h2>
				<div className="flex gap-2">
					<span>{post.author.name}</span>
					<span>•</span>
					<p className="text-xs flex items-center gap-1">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
							className="feather feather-calendar inline-block"
						>
							<rect
								x="3"
								y="4"
								width="18"
								height="18"
								rx="2"
								ry="2"
							></rect>
							<line x1="16" y1="2" x2="16" y2="6"></line>
							<line x1="8" y1="2" x2="8" y2="6"></line>
							<line x1="3" y1="10" x2="21" y2="10"></line>
						</svg>
						<span>
							{format(new Date(post.date), "MMMM dd, yyyy")}
						</span>
					</p>
				</div>
			</div>
		</Link>
	);
}

export default async function Home() {
	const posts = (await getPosts()) as unknown as (TPost & { slug: string })[];

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
