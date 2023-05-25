import dbConnect from "@/lib/dbConnect";
import clientPromise from "@/lib/mongoConnect";
import User from "@/models/user";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import { compare } from "bcrypt";
import { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
	session: {
		strategy: "jwt",
	},
	providers: [
		CredentialsProvider({
			name: "NextBlog",
			credentials: {
				email: {
					label: "Email",
					type: "email",
					placeholder: "john@doe.com",
				},
				password: {
					label: "Password",
					type: "password",
				},
			},
			async authorize(credentials) {
				if (!credentials?.email || !credentials.password) return null;

				await dbConnect();

				const user = await User.findOne({ email: credentials.email });
				if (!user) return null;

				const verified = await compare(
					credentials.password,
					user.password!
				);
				if (!verified) return null;

				return {
					name: user.name,
					email: user.email,
					id: user._id.toString(),
				};
			},
		}),
	],
	callbacks: {
		async session({ session }) {
			await dbConnect();
			const user = await User.findOne({ email: session.user!.email });

			return { ...session, id: user?._id.toString() };
		},
	},
	adapter: MongoDBAdapter(clientPromise, {
		databaseName: "nextblog",
		collections: {
			Users: "users",
			Sessions: "nextauth_sessions",
			Accounts: "nextauth_accounts",
			VerificationTokens: "nextauth_verification_tokens",
		},
	}),
	pages: {
		signIn: "/auth/login",
		signOut: "/auth/logout",
	},
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
