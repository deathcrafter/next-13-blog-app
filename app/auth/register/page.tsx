"use client";

import { signIn, getSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useSearchParams, redirect, useRouter } from "next/navigation";
import Link from "next/link";

export default function Page({}) {
	const searchParams = useSearchParams();
	const router = useRouter();
	const [formData, setFormData] = useState<{
		email: string;
		password: string;
	}>({ email: "", password: "" });
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		getSession().then((session) => {
			if (session) router.push(searchParams.get("callbackUrl") || "/");
		});
	}, []);

	const onSubmit = async function (e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		console.log("posting...");
		console.log(formData);

		setError(null);
		setLoading(true);
		const res = await fetch("/api/register", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(formData),
		});
		setLoading(false);

		if (res?.ok) {
			router.push(
				"/auth/login?callbackUrl=" +
					encodeURIComponent(searchParams.get("callbackUrl") || "/")
			);
		} else {
			console.log(res?.statusText);
			setError(res?.statusText);
		}
	};
	const handleChange = function (e: React.ChangeEvent<HTMLInputElement>) {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
		if (error) setError(null);
	};
	return (
		<main className="relative flex w-full h-full justify-center items-center pt-16">
			{error ? (
				<div className="absolute top-6 left-1/2 -translate-x-1/2 max-w-sm alert alert-error shadow-lg">
					<div>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="stroke-current flex-shrink-0 h-6 w-6"
							fill="none"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
						<span>{error}</span>
					</div>
				</div>
			) : null}
			<form
				className="card gap-4 w-full max-w-md p-5 bg-neutral text-neutral-content"
				// action={"/api/auth/callback/credentials"}
				// method="POST"
				onSubmit={onSubmit}
			>
				<div className="mb-6">
					<h1 className="text-2xl font-semibold text-center">
						Welcome to{" "}
						<span className="text-primary font-bold">NextBlog</span>
					</h1>
					<p className="text-sm text-center">
						Register to get started!
					</p>
				</div>
				<div className="form-control w-full max-w-xs m-auto">
					<input
						type="Text"
						name="name"
						placeholder="Name"
						className="input input-bordered w-full max-w-sm"
						autoComplete="off"
						onInput={handleChange}
					/>
				</div>
				<div className="form-control w-full max-w-xs m-auto">
					<input
						type="email"
						name="email"
						placeholder="Email"
						className="input input-bordered w-full max-w-sm"
						autoComplete="off"
						onInput={handleChange}
					/>
				</div>
				<div className="form-control w-full max-w-xs m-auto">
					<input
						type="password"
						name="password"
						placeholder="Password"
						className="input input-bordered w-full max-w-sm"
						autoComplete="off"
						onInput={handleChange}
					/>
				</div>
				<button
					type="submit"
					className={`btn btn-md m-auto ${
						loading ? "loading btn-disabled" : "btn-primary"
					}`}
					disabled={loading}
				>
					Register
				</button>
				<p className="text-center">
					Already an user?{" "}
					<Link
						href={"/auth/login?" + searchParams.toString()}
						className="btn-link"
					>
						Log In
					</Link>
				</p>
			</form>
		</main>
	);
}
