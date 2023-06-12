import { createEffect, createSignal, onMount } from "solid-js";
import { getCircle, getSquare, getStreak } from "./data";
import { Plot } from "./plot";

export default function () {
	// component logic
	const [datasets, setDatasets] = createSignal(getSquare(250));

	onMount(() => {
		const plot = new Plot(document.querySelector("#chart")!);

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
