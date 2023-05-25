"use client";

import "@sweetalert2/theme-dark/dark.css";

export type Post = {
	author: { name: string; _id: string };
	date: Date | string;
	title: string;
	body: string;
	headerImage?: string;
	isAuthor?: boolean;
};

import StyledMarkdown from "@/components/styled-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";
import { Poppins } from "next/font/google";
import Link from "next/link";
import { format } from "date-fns";
import { usePathname, useRouter } from "next/navigation";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const poppins = Poppins({
	subsets: ["latin"],
	weight: ["100", "400", "500", "700", "900"],
});

const MySwal = withReactContent(Swal);

export default function PostViewer({
	post: initPost,
	isJSON = false,
}: {
	post: Post | string;
	isJSON?: boolean;
}) {
	const post: Post = (
		isJSON ? JSON.parse(initPost as string) : initPost
	) as Post;

	const router = useRouter();
	const pathname = usePathname();

	return (
		<section>
			<section id="post-head">
				{post.headerImage?.length ? (
					<div className="w-full h-[20rem] max-h-[20rem] rounded-lg overflow-hidden">
						<img
							className="h-full w-full object-cover object-center"
							src={post.headerImage}
							alt="post_header_image"
						/>
					</div>
				) : null}
				<div className="flex">
					<div className="grow">
						<h1 className="font-semibold text-4xl my-5">
							{post.title}
						</h1>
						<div className="flex gap-2 items-center">
							<Link
								className="text-sm link link-hover"
								href={"#"}
							>
								{post.author.name}
							</Link>
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
									{format(
										new Date(post.date),
										"MMMM dd, yyyy"
									)}
								</span>
							</p>
						</div>
					</div>
					{post.isAuthor ? (
						<div className="flex items-center">
							<div className=" dropdown dropdown-end dropdown-left z-[500]">
								<label
									tabIndex={0}
									className="btn btn-ghost btn-circle"
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
										className="feather feather-more-vertical"
									>
										<circle cx="12" cy="12" r="1"></circle>
										<circle cx="12" cy="5" r="1"></circle>
										<circle cx="12" cy="19" r="1"></circle>
									</svg>
								</label>
								<ul
									tabIndex={0}
									className="mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-300 rounded-box w-52"
								>
									<li>
										<Link
											href={pathname + "/edit"}
											className=""
										>
											Edit
										</Link>
									</li>
									<li>
										<button
											className=""
											onClick={() => {
												MySwal.fire({
													title: "Delete this post?",
													confirmButtonText: "Delete",
													confirmButtonColor: "red",
													icon: "warning",
													showDenyButton: true,
													denyButtonText: "Cancel",
													denyButtonColor: "#242933",
													background: "#242933",
													color: "#fefefe",
													focusDeny: true,
													showLoaderOnConfirm: true,
													preConfirm: async (i) => {
														const res = await fetch(
															pathname + "/delete"
														);

														if (res.redirected)
															router.push(
																res.url
															);

														return true;
													},
												}).then((val) => {});
											}}
										>
											Delete
										</button>
									</li>
								</ul>
							</div>
						</div>
					) : null}
				</div>
			</section>
			<hr className="mt-2" />
			<section className={`prose`} style={{ all: "initial" }}>
				<div className={poppins.className}>
					<StyledMarkdown
						remarkPlugins={[remarkGfm]}
						remarkRehypeOptions={{ allowDangerousHtml: true }}
						rehypePlugins={[rehypeHighlight]}
					>
						{post.body.trim()}
					</StyledMarkdown>
				</div>
			</section>
		</section>
	);
}
