import { SMO } from "./smo";
import { Kernel } from "./utils/kernel";

export class SVM {
	// external datasets
	private inputs: number[][];
	private expect: number[];

	// internal params
	private a: number[];
	private b: number;

	/**
	 * @param kernel Kernel func
	 * @param coherence Regularization parameter
	 * @param numEpochs Max number of epochs before stop
	 * @param numPasses Min number of epochs to stop premature
	 * @param tolerance Numerical tolerance
	 */
	constructor(
		public readonly kernel = Kernel.rfb(5e-2),
		public readonly coherence = 1,
		public readonly numEpochs = 10_000,
		public readonly numPasses = 10,
		public readonly tolerance = 1e-4
	) {
		// init empty externals
		this.inputs = [];
		this.expect = [];

		// init empty internals
		this.a = [];
		this.b = 0;
	}

	/**
	 * @param input Vector of the measurement point parameters
	 * @returns Distance of the measurement point to margin
	 */
	public margin(input: number[]): number {
		let sum = this.b;

		for (let i = 0; i < this.inputs.length; i++) {
			sum += this.a[i] * this.expect[i] * this.kernel(input, this.inputs[i]);
		}

		return sum;
	}

	/**
	 * @param inputs List of vectors of the measurement points parameters
	 * @param expect List of the measurement points labels
	 */
	public train(inputs: number[][], expect: number[]): void {
		// save external parameters
		this.inputs = inputs;
		this.expect = expect;

		// init internal parameters
		this.a = new Array(inputs.length).fill(0);
		this.b = 0;

		// init training parameters
		let epochs = 0;
		let passes = 0;

		// begin training with SMO optimization
		while (epochs < this.numEpochs && passes < this.numPasses) {
			let adjusted = false;

			for (let i = 0; i < inputs.length; i++) {
				// init optimization
				const smo = new SMO(this, inputs, expect, i);

				// test optimization steps
				if (smo.passesStep1) continue;
				if (smo.passesStep2) continue;

				// try adjust
				adjusted = smo.adjust();
			}

			// update
			epochs++;
			passes++;

			// assert pass
			if (adjusted) passes = 0;
		}
	}

	/**
	 * SVM hyperplane alpha parameters
	 */
	public get A() {
		return this.a;
	}

	/**
	 * SVM hyperplane alpha parameters
	 */
	public set A(alphas: number[]) {
		this.a = alphas;
	}

	/**
	 * SVM hyperplane bias parameter
	 */
	public get B() {
		return this.b;
	}

	/**
	 * SVM hyperplane bias parameter
	 */
	public set B(bias: number) {
		this.b = bias;
	}
}
