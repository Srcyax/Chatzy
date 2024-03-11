import { Skeleton } from "@/components/ui/skeleton";

export default function Page({ params }: any) {
	return (
		<div>
			<main className="m-16 flex flex-col gap-5">
				<div className="flex laptop:flex-row tablet:flex-col smartphone:flex-col gap-2 smartphone:gap-4 w-full">
					<div className="flex flex-col gap-2 items-center justify-start border-2 shadow-3xl px-16 py-5 h-64 rounded-md">
						<Skeleton className="w-20 h-20 rounded-full" />

						<div className="flex flex-col gap-2 items-center">
							<div className="flex flex-col gap-2 items-center">
								<Skeleton className="w-16 h-4" />
								<Skeleton className="w-5 h-4" />
							</div>
						</div>
					</div>
					<div className="flex flex-col gap-2 items-center justify-center w-full border-2 shadow-3xl p-5 rounded-md">
						<div className="w-full h-full">
							<div className="flex flex-col gap-2">
								<Skeleton className="w-96 smartphone:w-48 h-4" />
								<Skeleton className="w-72 smartphone:w-40 h-4" />
							</div>
						</div>
					</div>
				</div>
			</main>
		</div>
	);
}
