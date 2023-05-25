"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import PostViewer from "@/components/post-viewer";
import { signIn, useSession } from "next-auth/react";

async function getPostEditInfo(slug: string) {
	const uri = "/api/posts/id/" + slug + "/edit";
	const res = await fetch(uri);
	if (res.ok)
		return (await res.json()) as {
			title: string;
			headerImage: string;
			body: string;
		};
	else if (res.status == 403) {
		throw Error("forbidden");
	} else if (res.status == 401) {
		throw Error("unauthorized");
	}
}

export default function Page({ params }: { params: { slug: string } }) {
	const pathname = usePathname();
	const router = useRouter();
	const session = useSession({
		required: true,
		onUnauthenticated: () =>
			signIn("credentials", { callbackUrl: pathname }),
	});
	const [formData, setFormData] = useState<
		{
			title: string;
			headerImage: string;
			body: string;
		} & { [key: string]: string }
	>();

	const [loading, setLoading] = useState(false);
	const [previewMode, setPreviewMode] = useState(false);

	const handleInput = function (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) {
		const { name, value } = e.target as { name: string; value: string };
		setFormData((data) => ({ ...data, [name]: value } as any));
	};
	const onSubmit = async function (e: React.FormEvent) {
		e.preventDefault();
		setLoading(true);
		const res = await fetch("/api/posts/id/" + params.slug + "/edit", {
			method: "POST",
			body: JSON.stringify(formData),
		});
		setLoading(false);
		if (res.ok) {
			const { slug } = (await res.json()) as { slug: string };
			router.push("/posts/id/" + slug + "?action=edit-success");
		} else {
			console.error(res.statusText);
		}
	};

	useEffect(() => {
		getPostEditInfo(params.slug)
			.then((val) => setFormData(val!))
			.catch((err) => {
				if (err.message == "unauthorized")
					router.push(
						"/auth/login?callbackUrl" + encodeURIComponent(pathname)
					);
				else router.push("/posts/id/" + params.slug);
			});
	}, []);

	return (
		<main className="max-w-7xl mx-auto p-4">
			{formData ? (
				<>
					<div className="flex justify-between mb-5">
						<h1 className="text-3xl font-semibold">
							Edit Your Blog
						</h1>
						<div className="form-control">
							<label
								className={`cursor-pointer flex items-center gap-2 ${
									!formData.title.length ||
									!formData.body.length
										? "pointer-events-hover opacity-60"
										: ""
								}`}
							>
								<span className="label-text text-base font-medium">
									Preview Mode
								</span>{" "}
								<input
									type="checkbox"
									id="preview-checkbox"
									name="preview-checkbox"
									defaultChecked={previewMode}
									onChange={(e) => {
										console.log(formData);
										if (
											!formData.title.length ||
											!formData.body.length
										) {
											e.target.checked = false;
											return;
										}
										setPreviewMode(e.target.checked);
									}}
									className="toggle toggle-primary"
								/>
							</label>
						</div>
					</div>
					{previewMode ? (
						<PostViewer
							post={{
								...formData,
								author: { name: "xxx", _id: "xxxx" },
								date: new Date(),
							}}
						/>
					) : (
						<form
							className="flex flex-col gap-5"
							onSubmit={onSubmit}
						>
							<div className="w-full form-control">
								<label htmlFor="title" className="label">
									Title
								</label>
								<input
									type="text"
									name="title"
									id="post-title"
									className="input input-bordered w-full"
									placeholder="A catchy title for your blog"
									onInput={
										handleInput as React.FormEventHandler<HTMLInputElement>
									}
									defaultValue={formData.title}
								/>
							</div>
							<div className="w-full form-control">
								<label htmlFor="title" className="label">
									Header Image
								</label>
								<input
									type="text"
									name="headerImage"
									id="post-image"
									className="input input-bordered w-full"
									placeholder="Link to a flashy header image"
									onInput={
										handleInput as React.FormEventHandler<HTMLInputElement>
									}
									defaultValue={formData.headerImage}
								/>
							</div>
							<div className="w-full form-control">
								<label htmlFor="title" className="label">
									<span className="label-text">Body</span>
									<a
										target="_blank"
										href="https://rb.gy/8en9h"
										className="label-text-alt tooltip tooltip-left tooltip-info"
										data-tip="Supports GitHub Flavoured Markdown. For more info, click the label."
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
											className="feather feather-info inline-block"
										>
											<circle
												cx="12"
												cy="12"
												r="10"
											></circle>
											<line
												x1="12"
												y1="16"
												x2="12"
												y2="12"
											></line>
											<line
												x1="12"
												y1="8"
												x2="12.01"
												y2="8"
											></line>
										</svg>{" "}
										Supports markdown
									</a>
								</label>
								<textarea
									name="body"
									id="post-body"
									className="textarea textarea-bordered w-full h-96 text-base"
									placeholder="Your awesome blog post"
									onInput={
										handleInput as React.FormEventHandler<HTMLTextAreaElement>
									}
									defaultValue={formData.body}
								></textarea>
							</div>
							<div className="flex justify-end gap-5 w-full mt-5">
								<Link href={"/"} className="btn btn-outline">
									Cancel
								</Link>
								<button
									className={`btn btn-wide btn-primary ${
										loading ? "loading" : ""
									}`}
									disabled={loading}
								>
									Save
								</button>
							</div>
						</form>
					)}
				</>
			) : (
				<p className="text-center">
					<progress className="progress progress-primary w-56"></progress>
				</p>
			)}
		</main>
	);
}
