"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Post as TPost } from "@/components/post-viewer";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";

type ExtendedPost = TPost & {
	likes: number;
	liked: boolean;
	comments: {
		author: { name: string; _id: string };
		body: string;
	}[];
	isAuthor: boolean;
};

const MySwal = withReactContent(Swal);

export default function PostInteractions({
	post: initPost,
	slug,
}: {
	post: string;
	slug: string;
}) {
	const session = useSession();

	const [post, setPost] = useState<ExtendedPost>(JSON.parse(initPost));
	const [commentForm, setCommentForm] = useState<boolean>(false);
	const commentFormRef = useRef<HTMLElement>(null);
	const [commentBody, setCommentBody] = useState<string>("");

	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const shareUrl = "https://" + window.location.host + pathname;
	const shareButtonRef = useRef<HTMLButtonElement>(null);

	useEffect(() => {
		if (searchParams.get("action") == "share") {
			shareButtonRef.current?.click();
			router.replace(pathname);
		}
	});

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
						if (session.status != "authenticated")
							return signIn("credentials", {
								callbackUrl: pathname,
							});
						setPost(
							(_post) =>
								({
									..._post,
									liked: !_post?.liked,
									likes:
										_post!.likes + (!_post.liked ? 1 : -1),
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
						if (session.status != "authenticated")
							return signIn("credentials", {
								callbackUrl: pathname,
							});
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
				<button
					ref={shareButtonRef}
					className="col-span-1 btn btn-ghost"
					onClick={() => {
						MySwal.fire({
							background: "#242933",
							html: (
								<div className="">
									<h1 className="text-3xl font-medium text-center text-white mb-6">
										Share Blog
									</h1>
									<p className="relative flex items-center bg-neutral text-neutral-content rounded-lg text-sm p-3 w-full max-w-full whitespace-nowrap overflow-ellipsis overflow-hidden">
										{shareUrl}
										<button
											type="button"
											className="absolute right-2 btn btn-sm btn-square btn-secondary"
											onClick={() => {
												navigator.clipboard.writeText(
													shareUrl
												);
											}}
										>
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
												className="feather feather-clipboard"
											>
												<path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
												<rect
													x="8"
													y="2"
													width="8"
													height="4"
													rx="1"
													ry="1"
												></rect>
											</svg>
										</button>
									</p>
									<div className="flex justify-around mt-6">
										<a
											href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
												shareUrl
											)}`}
											target="_blank"
											className="btn btn-square"
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												width="24"
												height="24"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												strokeWidth="2"
												strokeLinecap="round"
												strokeLinejoin="round"
												className="feather feather-facebook"
											>
												<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
											</svg>
										</a>
										<a
											href={`whatsapp://send?text=${encodeURIComponent(
												"Checkout this blogpost on NextBlog: " +
													shareUrl
											)}`}
											target="_blank"
											className="btn btn-square"
										>
											<svg
												role="img"
												viewBox="0 0 24 24"
												fill="currentColor"
												stroke="currentColor"
												xmlns="http://www.w3.org/2000/svg"
												className="scale-[0.5]"
											>
												<title>WhatsApp</title>
												<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
											</svg>
										</a>
										<a
											href={`mailto:?subject=${
												encodeURIComponent(
													"Check out this blog"
												) +
												"&body=" +
												encodeURIComponent(
													"Checkout this awesome blogpost on NextBlog: " +
														shareUrl
												)
											}`}
											target="_blank"
											className="btn btn-square"
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												width="24"
												height="24"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												strokeWidth="2"
												strokeLinecap="round"
												strokeLinejoin="round"
												className="feather feather-mail"
											>
												<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
												<polyline points="22,6 12,13 2,6"></polyline>
											</svg>
										</a>
									</div>
								</div>
							),
						});
					}}
				>
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
