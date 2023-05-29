import { chart } from "./components/chart";
import { SVC } from "./resources/svc";

export let classifier: SVC;

const btnStart = document.querySelector<HTMLButtonElement>("#btn-start")!;
const btnReset = document.querySelector<HTMLButtonElement>("#btn-reset")!;

btnStart.addEventListener("click", () => {
	classifier = new SVC();

	const { x, y } = chart.data.datasets[0].data[0];

	const predict1 = classifier.predict([x, y]);

	const data1 = chart.data.datasets[1].data.map((d) => [d.x, d.y]);
	const data2 = chart.data.datasets[2].data.map((d) => [d.x, d.y]);

	classifier.train([...data1, ...data2], [...data1.map((_) => +1), ...data2.map((_) => -1)]);

	const predict2 = classifier.predict([x, y]);

	console.log(predict1, predict2);
});

btnReset.addEventListener("click", () => {
	chart.data.datasets[1].data = [];
	chart.data.datasets[2].data = [];
	chart.update();
});
