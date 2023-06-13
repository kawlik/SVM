export default function (props: {
	datasize: number;
	datatype: "Circle" | "Square" | "Streak";
	kernelsize: number;
	kerneltype: "Linear" | "Polynomial" | "Radial";
	coherence: number;
	numEpochs: number;
	numPasses: number;
	tolerance: number;
}) {
	// component logic

	// component layout
	return (
		<section class="flex flex-col flex-1 gap-4">
			<div class="p-4 flex flex-col gap-1 shadow-md">
				<h2 class="text-xl">Dataset propeties</h2>
				<p class="text-lg flex flex-nowrap justify-between border-b">
					Data type: <span class="font-bold">{props.datatype}</span>
				</p>
				<p class="text-lg flex flex-nowrap justify-between border-b">
					Data size: <span class="font-bold">{props.datasize}</span>
				</p>
			</div>
			<hr />
			<div class="p-4 flex flex-col gap-1 shadow-md">
				<h2 class="text-xl">Kernel propeties</h2>
				<p class="text-lg flex flex-nowrap justify-between border-b">
					Kernel type: <span class="font-bold">{props.kerneltype}</span>
				</p>
				<p class="text-lg flex flex-nowrap justify-between border-b">
					Kernel size: <span class="font-bold">{props.kernelsize}</span>
				</p>
			</div>
			<hr />
			<div class="p-4 flex flex-col gap-1 shadow-md">
				<h2 class="text-xl">SVM propeties</h2>
				<p class="text-lg flex flex-nowrap justify-between border-b">
					Coherence: <span class="font-bold">{props.coherence}</span>
				</p>
				<p class="text-lg flex flex-nowrap justify-between border-b">
					Tolerance: <span class="font-bold">{props.tolerance}</span>
				</p>
				<p class="text-lg flex flex-nowrap justify-between border-b">
					Train Epochs: <span class="font-bold">{props.numEpochs}</span>
				</p>
				<p class="text-lg flex flex-nowrap justify-between border-b">
					Train Passes: <span class="font-bold">{props.numPasses}</span>
				</p>
			</div>
		</section>
	);
}
