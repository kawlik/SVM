import { createEffect, createSignal, onMount } from "solid-js";
import { getCircle, getSquare, getStreak } from "./data";
import { Plot } from "./plot";
import { SVM } from "../../model/svm";

export default function () {
	// component logic
	const [datasets, setDatasets] = createSignal(getStreak(250));

	onMount(() => {
		const plot = new Plot(document.querySelector("#chart")!);
		const svm = new SVM();

		window.addEventListener("keypress", (e) => {
			if (e.code !== "Space") return;

			svm.train(
				[...plot.dataIn, ...plot.dataOut],
				[...plot.dataIn.map((_) => +1), ...plot.dataOut.map((_) => -1)]
			);

			plot.draw((inputs) => (svm.margin(inputs) <= 0 ? 0 : 1));
		});

		createEffect(() => {
			plot.dataIn = datasets()[0];
			plot.dataOut = datasets()[1];
		});
	});

	// component layout
	return (
		<section class="aspect-square shadow-md">
			<canvas id="chart" />
		</section>
	);
}
