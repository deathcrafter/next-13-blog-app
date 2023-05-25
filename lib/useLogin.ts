"use client";
import { useRouter } from "next/navigation";

export default function useLogin() {
	const router = useRouter();
	return (callbackUrl: string) => {
		router.push(
			"/auth/login?callbackUrl=" + encodeURIComponent(callbackUrl)
		);
	};
}
