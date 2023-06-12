import { createEffect, onMount } from "solid-js";
import { Dataset } from "./data";
import { Plot } from "./plot";
import { SVM } from "../../model/svm";

export default function (props: { datasets: [Dataset, Dataset]; svm: SVM }) {
	// component logic
	onMount(() => {
		const plot = new Plot(document.querySelector("#chart")!);

		createEffect(() => {
			plot.dataIn = props.datasets[0];
			plot.dataOut = props.datasets[1];
		});

		window.addEventListener("keypress", (e) => {
			if (e.code !== "Space") return;

			const inputs = [...plot.dataIn, ...plot.dataOut];
			const expect = [...plot.dataIn.map((_) => +1), ...plot.dataOut.map((_) => -1)];

			props.svm.train(inputs, expect);

			plot.draw((inputs) => (props.svm.margin(inputs) <= 0 ? 0 : 1));
		});
	});

	// component layout
	return (
		<section class="aspect-square shadow-md">
			<canvas id="chart" />
		</section>
	);
}
