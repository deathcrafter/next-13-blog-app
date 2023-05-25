import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import User from "@/models/user";
import dbConnect from "@/lib/dbConnect";

export async function POST(req: NextRequest) {
	const { name, email, password } = (await req.json()) as {
		name: string;
		email: string;
		password: string;
	};

	await dbConnect();

	const foundUser = await User.findOne({ email });
	if (foundUser) {
		return NextResponse.json(
			{
				error: "User with the same email exists!",
			},
			{ status: 400, statusText: "User with the same email exists!" }
		);
	}

	const encryptedPass = await bcrypt.hash(password, 10);

	await User.create({
		name,
		email,
		password: encryptedPass,
	});

	return NextResponse.json({});
}
