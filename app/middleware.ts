import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest, params: any) {
	console.log({ req, params });
	return NextResponse.next();
}
