import Chart from "chart.js/auto";
import { drawRecurse } from "./draw";
import { classifier } from "../main";

export let color: "#22C55E" | "#BAD7F2" | "#F2BAC9" = "#22C55E";

export const btnGreen = document.querySelector<HTMLButtonElement>("#btn-color-green")!;
export const btnBlue = document.querySelector<HTMLButtonElement>("#btn-color-blue")!;
export const btnRed = document.querySelector<HTMLButtonElement>("#btn-color-red")!;

btnGreen.addEventListener("click", () => (color = "#22C55E"));
btnBlue.addEventListener("click", () => (color = "#BAD7F2"));
btnRed.addEventListener("click", () => (color = "#F2BAC9"));

export const chartData1 = blob(50, 1, 0.25, 0.25, 0.25, 0.25);
export const chartData2 = blob(50, 1, 0.75, 0.25, 0.75, 0.25);

export const canvas = document.querySelector<HTMLCanvasElement>("#chart")!;

export const chart = new Chart(canvas, {
	type: "bubble",
	data: {
		datasets: [
			{
				data: [{ x: Math.random(), y: Math.random() }] as { x: number; y: number }[],
				backgroundColor: "#22C55E",
			},
			{
				data: [...chartData1],
				backgroundColor: "#BAD7F2",
			},
			{
				data: [...chartData2],
				backgroundColor: "#F2BAC9",
			},
		],
	},
	options: {
		aspectRatio: 1,
		events: ["click"],
		layout: {
			autoPadding: false,
		},
		plugins: {
			legend: {
				display: false,
			},
		},
		scales: {
			x: {
				display: false,
				min: 0,
				max: 1,
			},
			y: {
				display: false,
				reverse: true,
				min: 0,
				max: 1,
			},
		},
	},
	plugins: [
		{
			id: "add_point_on_click",
			beforeEvent(chart, args) {
				if (args.event.type !== "click") return;

				let i = 0;

				if (color === "#BAD7F2") i = 1;
				if (color === "#F2BAC9") i = 2;

				const x = chart.scales.x.getDecimalForPixel(args.event.x!);
				const y = chart.scales.y.getDecimalForPixel(args.event.y!);

				if (i === 0) chart.data.datasets[i].data = [];

				chart.data.datasets[i].data.push({ x, y });
				chart.update();
			},
		},
		{
			id: "draw_boundries",
			beforeDraw(chart) {
				const ctx = chart.ctx;
				const cvs = chart.canvas;
				const deep = Math.log2(cvs.width);
				const data = {
					x: 0,
					y: 0,
					w: cvs.width,
				};

				drawRecurse(ctx, cvs, (input) => classifier.predict(input), data, deep);
			},
		},
	],
});

function blob(
	n: number,
	d: number,
	xo: number,
	xr: number,
	yo: number,
	yr: number
): { x: number; y: number }[] {
	const dataset = [] as { x: number; y: number }[];
	const ellipse = (x: number, y: number): number => {
		const xdt = (x - xo) ** 2;
		const ydt = (y - xo) ** 2;

		return xdt / xr ** 2 + ydt / yr ** 2;
	};

	const x_max = xo + xr;
	const x_min = xo - xr;
	const y_max = yo + yr;
	const y_min = yo - yr;

	for (let i = 0; i < n; i++) {
		let xi = Math.random() * (x_max - x_min) + x_min;
		let yi = Math.random() * (y_max - y_min) + y_min;

		while (ellipse(xi, yi) > d ** 2) {
			xi = Math.random() * (x_max - x_min) + x_min;
			yi = Math.random() * (y_max - y_min) + y_min;
		}

		dataset.push({ x: xi, y: yi });
	}

	return dataset;
}
