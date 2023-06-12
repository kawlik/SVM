import { createEffect, createSignal } from "solid-js";
import { getClear } from "./chart/data";
import { Kernel } from "../model/utils/kernel";
import { SVM } from "../model/svm";

// import app components
import Chart from "./chart/@";
import Panel from "./panel/@";

export default function () {
	// component logic

	// util data components
	const [datasets, setDatasets] = createSignal(getClear());

	// util svm components
	const [kernel, setKernel] = createSignal(Kernel.rfb(2e-2));
	const [coherence, setCoherence] = createSignal(1);
	const [numEpochs, setNumEpochs] = createSignal(10_000);
	const [numPasses, setNumPasses] = createSignal(10);
	const [tolerance, setTolerance] = createSignal(1e-4);

	// main classifier
	const [svm, setSVM] = createSignal(new SVM());

	// auto update
	createEffect(() => {
		setSVM(new SVM(kernel(), coherence(), numEpochs(), numPasses(), tolerance()));
	});

	// component layout
	return (
		<main class="flex gap-4 p-4 w-full h-full">
			<Chart datasets={datasets()} svm={svm()} />
			<Panel
				setDatasets={setDatasets}
				setKernel={setKernel}
				setCoherence={setCoherence}
				setNumEpochs={setNumEpochs}
				setNumPasses={setNumPasses}
				setTolerance={setTolerance}
			/>
		</main>
	);
}
