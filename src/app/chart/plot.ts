import { Chart } from "chart.js/auto";
import { Dataset } from "./data";
import { drawRecurse } from "./draw";

let shift = false;

window.addEventListener("keydown", (e) => {
	shift = e.shiftKey;
});

window.addEventListener("keyup", (e) => {
	shift = e.shiftKey;
});

export class Plot {
	public static colorIn = "#BAD7F2";
	public static colorOut = "#F2BAC9";

	private readonly chart: Chart;
	private classifier?: (inputs: number[]) => number;

	constructor(private canvas: HTMLCanvasElement) {
		this.chart = new Chart(this.canvas, {
			type: "bubble",
			data: {
				datasets: [
					{
						data: [] as { x: number; y: number }[],
						backgroundColor: Plot.colorIn,
					},
					{
						data: [] as { x: number; y: number }[],
						backgroundColor: Plot.colorOut,
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
					beforeEvent: (chart, args) => {
						if (args.event.type !== "click") return;

						const idx = shift ? 0 : 1;

						const x = chart.scales.x.getDecimalForPixel(args.event.x!);
						const y = chart.scales.y.getDecimalForPixel(args.event.y!);

						chart.data.datasets[idx].data.push({ x, y });
						chart.update();
					},
				},
				{
					id: "draw_boundries",
					beforeDraw: (chart) => {
						if (!this.classifier) return;

						const ctx = chart.ctx;
						const cvs = chart.canvas;
						const deep = Math.log2(cvs.width);
						const data = {
							x: 0,
							y: 0,
							w: cvs.width,
						};

						drawRecurse(ctx, cvs, this.classifier, data, deep);
					},
				},
			],
		});

		// auto resize
		window.addEventListener("resize", () => this.chart.update());
	}

	public draw(classifier: (inputs: number[]) => number): void {
		this.classifier = classifier;
		this.chart.draw();

		delete this.classifier;
	}

	public get dataIn(): Dataset {
		const raw = this.chart.data.datasets[0].data as { x: number; y: number }[];
		return raw.map((d) => [d.x, d.y]);
	}

	public set dataIn(dataset: Dataset) {
		this.chart.data.datasets[0].data = dataset.map((d) => ({ x: d[0], y: d[1] }));
		this.chart.update();
	}

	public get dataOut(): Dataset {
		const raw = this.chart.data.datasets[1].data as { x: number; y: number }[];
		return raw.map((d) => [d.x, d.y]);
	}

	public set dataOut(dataset: Dataset) {
		this.chart.data.datasets[1].data = dataset.map((d) => ({ x: d[0], y: d[1] }));
		this.chart.update();
	}
}
