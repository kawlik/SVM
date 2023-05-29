import { Vector } from "./utils/vector";

export class SVC {
	// externals
	private inputs: number[][];
	private expect: number[];

	// internals
	private a: number[] = [];
	private b: number = 0;

	constructor(
		private readonly convergence = 1e-3,
		private readonly coalescence = 1e-2,
		private readonly numEpochs = 10_000
	) {
		// initialize empty
		this.inputs = [];
		this.expect = [];
	}

	public product(inputs: number[]): number {
		const base = Vector.dot(inputs, this.a, this.a.length);

		return base - this.b;
	}

	public predict(inputs: number[]): number {
		const base = this.product(inputs);

		return Math.sign(base);
	}

	public train(inputs: number[][], expect: number[]): void {
		this.inputs = inputs;
		this.expect = expect;

		for (let epochs = 0; epochs < this.numEpochs; epochs++) {
			for (let i = 0; i < this.inputs.length; i++) {
				if (this.product(this.inputs[i]) * this.expect[i] < 0) {
					this.adjustNegative(this.inputs[i], this.expect[i]);
				} else {
					this.adjustPositive();
				}
			}
		}
	}

	private adjustNegative(inputs: number[], expect: number): void {
		this.b -= this.convergence * expect;

		for (let i = 0; i < this.a.length; i++) {
			const delta = 2 * this.coalescence * this.a[i] - inputs[i] * expect;

			this.a[i] -= this.convergence * delta;
		}
	}

	private adjustPositive(): void {
		for (let i = 0; i < this.a.length; i++) {
			const delta = 2 * this.coalescence * this.a[i];

			this.a[i] -= this.convergence * delta;
		}
	}
}
