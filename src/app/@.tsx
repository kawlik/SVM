import { SVM } from "../model/svm";
import { Kernel } from "../model/utils/kernel";
import { getCircle, getSquare, getStreak } from "./chart/data";

// import app components
import Chart from "./chart/@";
import Panel from "./panel/@";

export default function () {
	// component logic
	const getDatasets = (datatype: "Circle" | "Square" | "Streak", datasize: number) => {
		if ("Circle" === datatype) return getCircle(datasize);
		if ("Square" === datatype) return getSquare(datasize);

		return getStreak(datasize);
	};

	const getKernel = (kerneltype: "Linear" | "Radial" | "Polynomial", kernelsize: number) => {
		if ("Linear" === kerneltype) return Kernel.linear;
		if ("Radial" === kerneltype) return Kernel.rfb(kernelsize);

		return Kernel.ply(kernelsize);
	};

	// setup
	const datatype: "Circle" | "Square" | "Streak" = "Circle";
	const kerneltype: "Linear" | "Radial" | "Polynomial" = "Radial";
	const kernelsize: number = 5e-2;

	// datasets
	const datasize = 100;
	const datasets = getDatasets(datatype, datasize);

	// classifier utils
	const kernel = getKernel(kerneltype, kernelsize);
	const coherence = 1;
	const numEpochs = 10_000;
	const numPasses = 10;
	const tolerance = 1e-4;

	// classifier init
	const svm = new SVM(kernel, coherence, numEpochs, numPasses, tolerance);

	// component layout
	return (
		<main class="flex gap-4 p-4 w-full h-full">
			<Chart datasets={datasets} svm={svm} />
			<Panel
				datasize={datasize}
				datatype={datatype}
				kernelsize={kernelsize}
				kerneltype={kerneltype}
				coherence={coherence}
				numEpochs={numEpochs}
				numPasses={numPasses}
				tolerance={tolerance}
			/>
		</main>
	);
}
