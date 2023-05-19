import Chart from "chart.js/auto";

export let color: "#22C55E" | "#BAD7F2" | "#F2BAC9" = "#22C55E";

export const btnGreen = document.querySelector<HTMLButtonElement>("#btn-color-green")!;
export const btnBlue = document.querySelector<HTMLButtonElement>("#btn-color-blue")!;
export const btnRed = document.querySelector<HTMLButtonElement>("#btn-color-red")!;

btnGreen.addEventListener("click", () => (color = "#22C55E"));
btnBlue.addEventListener("click", () => (color = "#BAD7F2"));
btnRed.addEventListener("click", () => (color = "#F2BAC9"));

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
				data: [] as { x: number; y: number }[],
				backgroundColor: "#BAD7F2",
			},
			{
				data: [] as { x: number; y: number }[],
				backgroundColor: "#F2BAC9",
			},
		],
	},
	options: {
		aspectRatio: 1,
		events: ["click"],
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
	],
});
