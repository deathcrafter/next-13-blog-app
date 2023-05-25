import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
	const session = await getServerSession();

	if (!session)
		return NextResponse.json({
			status: "failed",
			error: "No session detected!",
		});

	return NextResponse.json({ status: "success", session });
}
