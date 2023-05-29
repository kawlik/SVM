import { chart, chartData1, chartData2 } from "./components/chart";
import { SVC } from "./resources/svc";

export const classifier = new SVC(2);

const btnStart = document.querySelector<HTMLButtonElement>("#btn-start")!;
const btnReset = document.querySelector<HTMLButtonElement>("#btn-reset")!;

btnStart.addEventListener("click", () => {
	const { x, y } = chart.data.datasets[0].data[0];

	const data1 = chart.data.datasets[1].data.map((d) => [d.x, d.y]);
	const data2 = chart.data.datasets[2].data.map((d) => [d.x, d.y]);

	classifier.train([...data1, ...data2], [...data1.map((_) => +1), ...data2.map((_) => -1)]);

	const predict = classifier.predict([x, y]);

	console.log(predict);
	chart.update();
});

btnReset.addEventListener("click", () => {
	chart.data.datasets[1].data = chartData1;
	chart.data.datasets[2].data = chartData2;
	chart.update();
});
