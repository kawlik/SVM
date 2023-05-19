import { chart } from "./components/chart";
import { SVC } from "./resources/svc";

let classifier = new SVC(2, 0.01, 1, 0.01);

const btnStart = document.querySelector<HTMLButtonElement>("#btn-start")!;
const btnReset = document.querySelector<HTMLButtonElement>("#btn-reset")!;

btnStart.addEventListener("click", () => {
	const { x, y } = chart.data.datasets[0].data[0];

	const predict1 = classifier.predict([x, y]);

	const data1 = chart.data.datasets[1].data;
	const data2 = chart.data.datasets[2].data;

	for (let i = 0; i < data1.length; i++) {
		const inputs = [data1[i].x, data1[i].y];
		const expect = 1;

		classifier.train(inputs, expect);
	}

	for (let i = 0; i < data2.length; i++) {
		const inputs = [data2[i].x, data2[i].y];
		const expect = -1;

		classifier.train(inputs, expect);
	}

	const predict2 = classifier.predict([x, y]);

	console.log(predict1, predict2);
});

btnReset.addEventListener("click", () => {
	classifier = new SVC(2, 0.01, 1, 0.01);

	chart.data.datasets[1].data = [];
	chart.data.datasets[2].data = [];
	chart.update();
});
