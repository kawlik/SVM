import { Random } from "./utils/random";
import { Vector } from "./utils/vector";

export class SVC {
	private offset: number;
	private weights: number[];

	constructor(
		private readonly cardinality: number,
		private readonly convergence: number,
		private readonly discrepency: number,
		private readonly lambda: number
	) {
		this.offset = Random.uniform() * this.discrepency;
		this.weights = new Array(this.cardinality);

		for (let i = 0; i < this.cardinality; i++) {
			this.weights[i] = Math.random() * this.discrepency;
		}
	}

	public product(inputs: number[]): number {
		const base = Vector.dot(inputs, this.weights, this.cardinality);

		return base - this.offset;
	}

	public predict(inputs: number[]): number {
		const base = this.product(inputs);

		return Math.sign(base);
	}

	public train(inputs: number[], expect: number): void {
		if (this.product(inputs) * expect < 0) {
			this.adjustNegative(inputs, expect);
		} else {
			this.adjustPositive();
		}
	}

	private adjustNegative(inputs: number[], expect: number): void {
		this.offset -= this.convergence * expect;

		for (let i = 0; i < this.cardinality; i++) {
			const delta = 2 * this.lambda * this.weights[i] - inputs[i] * expect;

			this.weights[i] -= this.convergence * delta;
		}
	}

	private adjustPositive(): void {
		for (let i = 0; i < this.cardinality; i++) {
			const delta = 2 * this.lambda * this.weights[i];

			this.weights[i] -= this.convergence * delta;
		}
	}
}
