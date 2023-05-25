"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Post as TPost } from "@/components/post-viewer";

type ExtendedPost = TPost & {
	likes: number;
	liked: boolean;
	comments: {
		author: { name: string; _id: string };
		body: string;
	}[];
	isAuthor: boolean;
};

export default function PostInteractions({
	post: initPost,
	slug,
}: {
	post: string;
	slug: string;
}) {
	const [post, setPost] = useState<ExtendedPost>(JSON.parse(initPost));
	const [commentForm, setCommentForm] = useState<boolean>(false);
	const commentFormRef = useRef<HTMLElement>(null);
	const [commentBody, setCommentBody] = useState<string>("");

	const router = useRouter();
	const pathname = usePathname();

	useEffect(() => {
		if (commentForm)
			commentFormRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [commentForm]);

	return (
		<>
			<section id="post-interactions" className="grid grid-cols-3">
				<button
					type="button"
					className="col-span-1 btn btn-ghost"
					onClick={async () => {
						setPost(
							(_post) =>
								({
									..._post,
									liked: !_post?.liked,
								} as ExtendedPost)
						);
						const res = await fetch("/api/posts/id/" + slug, {
							method: "POST",
							body: JSON.stringify({
								action: "like",
								data: !post.liked,
							}),
						});
						if (res.ok) {
							const liked = (
								(await res.json()) as { data: boolean }
							).data;
							setPost(
								(_post) =>
									({
										..._post,
										liked,
										likes: _post!.likes + (liked ? 1 : -1),
									} as ExtendedPost)
							);
						} else if (res.status == 401) {
							router.push(
								"/auth/login?callbackUri=" +
									encodeURIComponent(pathname)
							);
						} else {
							console.error(res.statusText);
						}
					}}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="28"
						height="28"
						viewBox="0 0 24 24"
						fill={post.liked ? "currentColor" : "none"}
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
						className={`feather feather-heart ${
							post.liked
								? "text-secondary"
								: "text-neutral-content"
						}`}
					>
						<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
					</svg>
					<span className="ml-2 countdown">
						<span style={{ "--value": post.likes } as any}></span>
					</span>
				</button>
				<button
					type="button"
					className="col-span-1 btn btn-ghost"
					onClick={() => {
						setCommentForm((_) => !_);
					}}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="28"
						height="28"
						viewBox="0 0 24 24"
						fill={commentForm ? "currentColor" : "none"}
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
						className="feather feather-message-square text-neutral-content"
					>
						<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
					</svg>
				</button>
				<button className="col-span-1 btn btn-ghost">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="28"
						height="28"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
						className="feather feather-share-2 text-neutral-content"
					>
						<circle cx="18" cy="5" r="3"></circle>
						<circle cx="6" cy="12" r="3"></circle>
						<circle cx="18" cy="19" r="3"></circle>
						<line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
						<line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
					</svg>
				</button>
			</section>
			{commentForm ? (
				<section
					ref={commentFormRef}
					id="post-comment"
					className="card bg-base-300 mt-5"
				>
					<form
						className="card-body"
						onSubmit={async (e) => {
							e.preventDefault();

							const res = await fetch("/api/posts/id/" + slug, {
								method: "POST",
								body: JSON.stringify({
									action: "comment",
									data: commentBody,
								}),
							});

							if (res.ok) {
								const comments = ((await res.json()) as any)
									.data;

								setPost(
									(_post) => ({ ..._post, comments } as any)
								);
								setCommentForm(false);
							}
						}}
					>
						<div className="form-control">
							<label htmlFor="comment-input" className="label">
								<span className="label-text">
									Add New Comment
								</span>
							</label>
							<input
								type="text"
								id="comment-input"
								className="input input-bordered"
								placeholder="Your comment"
								onInput={(
									e: React.ChangeEvent<HTMLInputElement>
								) => {
									setCommentBody(e.target.value);
								}}
							/>
						</div>

						<div className="flex justify-end gap-4 mt-5">
							<button
								type="button"
								className="btn btn-ghost"
								onClick={() => {
									setCommentForm(false);
								}}
							>
								Cancel
							</button>
							<button className="btn btn-primary btn-wide">
								Submit
							</button>
						</div>
					</form>
				</section>
			) : null}
			{post.comments.length ? (
				<section id="post-comments" className="card bg-base-300 mt-5">
					<div className="card-body">
						<h1 className="card-title">Comments</h1>
						{post.comments.map(({ author: { name }, body }, i) => (
							<div
								key={"comm-" + i}
								className="card card-compact bg-base-200"
							>
								<div className="card-body">
									<h3 className="font-medium text-base-content text-sm my-2">
										{name}
									</h3>
									<p>{body}</p>
								</div>
							</div>
						))}
					</div>
				</section>
			) : null}
		</>
	);
}
