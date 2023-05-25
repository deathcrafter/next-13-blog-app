import Link from "next/link";
import "./globals.css";
import { Poppins, Nerko_One } from "next/font/google";
import Providers from "./providers";
import { Session, getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";

const poppins = Poppins({
	weight: ["400", "500", "600", "800", "900"],
	subsets: ["latin"],
});
const dokdo = Nerko_One({
	weight: ["400"],
	subsets: ["latin"],
});

export const metadata = {
	title: "Next.js Blog",
	description: "Next.js Blog App as Assignment",
};

function Navbar({ session }: { session: Session | null }) {
	return (
		<div className="w-full sticky top-0 bg-base-200 z-[500]">
			<div className="navbar max-w-7xl m-auto">
				<div className="flex-1">
					<Link
						href="/"
						className="btn btn-ghost normal-case text-3xl font-semibold"
					>
						<span className="text-primary">Next</span>
						<span
							className={`text-secondary text-4xl font-bold ${dokdo.className}`}
						>
							Blog
						</span>
					</Link>
				</div>
				{session ? (
					<div className="flex-none gap-2">
						<Link
							href={"/posts/create"}
							className="btn btn-primary normal-case"
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
								className="feather feather-plus-square"
							>
								<rect
									x="3"
									y="3"
									width="18"
									height="18"
									rx="2"
									ry="2"
								></rect>
								<line x1="12" y1="8" x2="12" y2="16"></line>
								<line x1="8" y1="12" x2="16" y2="12"></line>
							</svg>
							<span className="ml-2">Create New</span>
						</Link>
						<div className="dropdown dropdown-end z-[500]">
							<label
								tabIndex={0}
								className="btn btn-ghost btn-square"
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
									className="feather feather-menu"
								>
									<line x1="3" y1="12" x2="21" y2="12"></line>
									<line x1="3" y1="6" x2="21" y2="6"></line>
									<line x1="3" y1="18" x2="21" y2="18"></line>
								</svg>
							</label>
							<ul
								tabIndex={0}
								className="mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-300 rounded-box w-52"
							>
								<li>
									<a className="justify-between">
										Profile
										<span className="badge">New</span>
									</a>
								</li>
								<li>
									<a>Settings</a>
								</li>
								<li>
									<Link href={"/auth/logout"}>Logout</Link>
								</li>
							</ul>
						</div>
					</div>
				) : (
					<div className="flex-none">
						<Link
							href={"/auth/register"}
							className="btn btn-outline"
						>
							Get Started
						</Link>
					</div>
				)}
			</div>
		</div>
	);
}

export default async function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const session = await getServerSession(authOptions);
	return (
		<html lang="en">
			<body
				className={`flex flex-col min-h-screen overflow-y-auto bg-neutral ${poppins.className}`}
			>
				<Providers session={session}>
					<Navbar session={session} />
					<div className="grow w-full">{children}</div>
				</Providers>
			</body>
		</html>
	);
}
