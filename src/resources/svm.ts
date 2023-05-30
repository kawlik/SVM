import { Kernel } from "./utils/kernel";
import { Random } from "./utils/random";

export class SVM {
	// external datasets
	private inputs: number[][];
	private expect: number[];

	// internal params
	private a: number[];
	private b: number;

	constructor(
		private readonly kernel = Kernel.rfb(5e-2),
		private readonly numEpochs = 10_000,
		private readonly numPasses = 10,
		private readonly tolerance = 1e-4
	) {
		// init externals
		this.inputs = [];
		this.expect = [];

		// init internals
		this.a = [];
		this.b = 0;
	}

	public predict(input: number[]): number {
		return Math.sign(this.margin(input));
	}

	public train(inputs: number[][], expect: number[]): void {
		// save external datasets
		this.inputs = inputs;
		this.expect = expect;

		// init internal params
		this.a = new Array(this.inputs.length).fill(0);
		this.b = 0.0;

		// init train params
		let epochs = 0;
		let passes = 0;

		// run SMO algotithm
		while (epochs < this.numEpochs && passes < this.numPasses) {
			let iterPassed = true;

			for (let i = 0; i < this.inputs.length; i++) {
				// calculate primary margin
				const marginI = this.margin(inputs[i]) - expect[i];

				// test if passes withou update
				if (this.passesMarginI(marginI, i)) continue;
				if (this.passesAdjustJ(marginI, i)) continue;

				// mark if adjusted
				iterPassed = false;
			}

			// update
			epochs++;
			passes++;

			// reset passes
			if (!iterPassed) passes = 0;
		}

		// parse externals
		this.inputs = this.inputs.filter((_, i) => Math.abs(this.a[i]) > 1e-2);
		this.expect = this.expect.filter((_, i) => Math.abs(this.a[i]) > 1e-2);

		// parse internals
		this.a = this.a.filter((a) => a > 1e-2);
	}

	/**
	 * @param input Input vector
	 * @returns Distance to margin
	 */
	private margin(input: number[]): number {
		let sum = this.b;

		for (let i = 0; i < this.inputs.length; i++) {
			sum += this.a[i] * this.expect[i] * this.kernel(input, this.inputs[i]);
		}

		return sum;
	}

	/**
	 * @param marginI Distance to margin
	 * @param i Current index to compare
	 * @returns True if passes (no need to update)
	 */
	private passesMarginI(marginI: number, i: number): boolean {
		return !(
			(marginI * this.expect[i] < -this.tolerance && this.a[i] < 1) ||
			(marginI * this.expect[i] > +this.tolerance && this.a[i] > 0)
		);
	}

	/**
	 * @param marginI Distance to margin
	 * @param i Current index to compare
	 * @returns True if adjust (no need to update)
	 */
	private passesAdjustJ(marginI: number, i: number): boolean {
		const j = Random.randiexc(0, this.inputs.length - 1, i);

		// calculate complementary margin
		const marginJ = this.margin(this.inputs[j]) - this.expect[j];

		// shortcuts
		const AI = this.a[i];
		const AJ = this.a[j];

		let M = 0; // upper bound
		let N = 1; // lower bound

		// find bounds
		if (this.expect[i] === this.expect[j]) {
			M = Math.max(0, AI + AJ - 1);
			N = Math.min(1, AI + AJ);
		} else {
			M = Math.max(0, AJ - AI);
			N = Math.min(1, AJ - AI + 1);
		}

		// guard - no need to update
		if (Math.abs(M - N) < this.tolerance) return true;

		const kernelI = this.kernel(this.inputs[i], this.inputs[i]);
		const kernelJ = this.kernel(this.inputs[j], this.inputs[j]);
		const kernelX = this.kernel(this.inputs[i], this.inputs[j]);
		const kernel = 2 * kernelX - kernelI - kernelJ;

		// guad - no need to update
		if (kernel >= 0) return true;

		// calculate new AJ value & clamp to [N, M]
		let newAJ = AJ - (this.expect[j] * (marginI - marginJ)) / kernel;
		if (newAJ > N) newAJ = N;
		if (newAJ < M) newAJ = M;

		// guard - no need to update
		if (Math.abs(AJ - newAJ) < this.tolerance) return true;

		// calculate new AI value
		let newAI = AI + this.expect[i] * this.expect[j] * (AJ - newAJ);
		this.a[j] = newAJ;
		this.a[i] = newAI;

		// calculate new bias value (1)
		const b1 =
			this.b -
			marginI -
			this.expect[i] * (newAI - AI) * this.kernel(this.inputs[i], this.inputs[i]) -
			this.expect[j] * (newAJ - AJ) * this.kernel(this.inputs[i], this.inputs[j]);

		// calculate new bias value (2)
		const b2 =
			this.b -
			marginJ -
			this.expect[i] * (newAI - AI) * this.kernel(this.inputs[i], this.inputs[j]) -
			this.expect[j] * (newAJ - AJ) * this.kernel(this.inputs[j], this.inputs[j]);

		// update bias value
		this.b = 0.5 * (b1 + b2);

		// clamp bias value
		if (newAI > 0 && newAI < 1) this.b = b1;
		if (newAJ > 0 && newAJ < 1) this.b = b2;

		// mark update
		return false;
	}
}
