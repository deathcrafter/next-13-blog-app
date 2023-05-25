"use client";

import { signOut } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
	const router = useRouter();
	const searchParams = useSearchParams();
	useEffect(() => {
		signOut({ redirect: false }).then(() => {
			router.push(searchParams.get("callbackUrl") || "/auth/login");
		});
	}, []);

	return <></>;
}
