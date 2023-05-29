import { chart } from "./components/chart";
import { SVC } from "./resources/svc";

export let classifier: SVC;

const btnStart = document.querySelector<HTMLButtonElement>("#btn-start")!;
const btnReset = document.querySelector<HTMLButtonElement>("#btn-reset")!;

btnStart.addEventListener("click", () => {
	classifier = new SVC();

	const { x, y } = chart.data.datasets[0].data[0];

	const predict1 = classifier.predict([x, y]);

	const data1 = chart.data.datasets[1].data;
	const data2 = chart.data.datasets[2].data;

	classifier.train(
		[...data1.map((d) => [d.x, d.y]), ...data2.map((d) => [d.x, d.y])],
		[...new Array(data1.length).fill(+1), ...new Array(data2.length).fill(-1)]
	);

	const predict2 = classifier.predict([x, y]);

	console.log(predict1, predict2);
});

btnReset.addEventListener("click", () => {
	chart.data.datasets[1].data = [];
	chart.data.datasets[2].data = [];
	chart.update();
});
