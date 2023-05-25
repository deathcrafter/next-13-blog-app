import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function Loading() {
	return (
		<div className="max-w-7xl flex flex-col gap-5">
			<SkeletonTheme baseColor="#242933" highlightColor="#2a303c">
				<section id="head-loader">
					<Skeleton height={"20rem"} />

					<Skeleton height={"2.5rem"} className="my-5" />

					<Skeleton width={"5rem"} height={"1rem"} />
				</section>
				<hr className="mt-3" />
				<section id="body-loader">
					<Skeleton count={12} />
				</section>
			</SkeletonTheme>
		</div>
	);
}
