import { Vector } from "./utils/vector";

export class SVC {
	// externals
	private inputs: number[][];
	private expect: number[];

	// internals
	private a: number[] = [];
	private b: number = 0;

	constructor(
		private readonly cardinality: number,
		private readonly convergence = 1e-3,
		private readonly coalescence = 1e-2,
		private readonly numEpochs = 10_000
	) {
		// init externals
		this.inputs = [];
		this.expect = [];

		// init internalss
		this.a = [];
		this.b = 0;
	}

	public predict(input: number[]): number {
		return Math.sign(this.margin(input));
	}

	public train(inputs: number[][], expect: number[]): void {
		this.inputs = inputs;
		this.expect = expect;

		// init internalss
		this.a = new Array(this.cardinality).fill(0);
		this.b = 0;

		// step forward
		for (let epochs = 0; epochs < this.numEpochs; epochs++) {
			for (let i = 0; i < this.inputs.length; i++) {
				if (expect[i] * this.margin(inputs[i]) < 1) {
					this.adjustNegative(inputs[i], expect[i]);
				} else {
					this.adjustPositive();
				}
			}
		}
	}

	private adjustNegative(input: number[], expect: number): void {
		this.b -= this.convergence * expect;

		for (let i = 0; i < this.a.length; i++) {
			const delta = 2 * this.coalescence * this.a[i] - input[i] * expect;

			this.a[i] -= this.convergence * delta;
		}
	}

	private adjustPositive(): void {
		for (let i = 0; i < this.a.length; i++) {
			const delta = 2 * this.coalescence * this.a[i];

			this.a[i] -= this.convergence * delta;
		}
	}

	private margin(input: number[]): number {
		let margin = -this.b;

		for (let i = 0; i < this.cardinality; i++) {
			margin += input[i] * this.a[i];
		}

		return margin;
	}
}
