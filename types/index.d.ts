import NextAuth, { type DefaultSession } from "next-auth";

declare module "next-auth" {
	interface Session {
		user: {
			id: string;
			username: string;
			email: string;
			[key: string]: string;
		} & DefaultSession["user"];
		id: string;
	}
}
