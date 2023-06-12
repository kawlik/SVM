import { SVM } from "./svm";
import { Random } from "./utils/random";

export class SMO {
	// external parameters
	private readonly indexJ: number;

	// internal parameters
	private kernel: number;
	private boundM: number;
	private boundN: number;
	private errorI: number;
	private errorJ: number;

	/**
	 * @param svm
	 * @param inputs List of vectors of the measurement points parameters
	 * @param expect List of the measurement points labels
	 * @param i Current test index
	 */
	constructor(
		private readonly svm: SVM,
		private readonly inputs: number[][],
		private readonly expect: number[],
		private readonly indexI: number
	) {
		// save external parameters
		this.indexJ = Random.randiexc(0, inputs.length - 1, indexI);

		// init internal parameters
		this.kernel = 0;
		this.boundM = 0;
		this.boundN = this.svm.coherence;
		this.errorI = this.svm.margin(this.inputs[this.indexI]) - this.expect[this.indexI];
		this.errorJ = this.svm.margin(this.inputs[this.indexJ]) - this.expect[this.indexJ];
	}

	/**
	 * @returns Indices if SVM was adjusted
	 */
	public adjust(): boolean {
		// shortcuts
		const AI = this.svm.A[this.indexI];
		const AJ = this.svm.A[this.indexJ];
		const C = this.svm.coherence;
		const I = this.indexI;
		const J = this.indexJ;
		const M = this.boundM;
		const N = this.boundN;

		// calculate new AI value
		let newAJ = AJ - (this.expect[J] * (this.errorI - this.errorJ)) / this.kernel;
		if (newAJ > N) newAJ = N;
		if (newAJ < M) newAJ = M;

		// guard - test numerical tolerance
		if (Math.abs(AJ - newAJ) < this.svm.tolerance) return false;

		// calculate new AI value
		let newAI = AI + this.expect[I] * this.expect[J] * (AJ - newAJ);
		this.svm.A[J] = newAJ;
		this.svm.A[I] = newAI;

		// calculate new bias value
		const b1 = this.getNewB1(newAI - AI, newAJ - AJ);
		const b2 = this.getNewB2(newAI - AI, newAJ - AJ);

		// update bias
		this.svm.B = (b1 + b2) * 0.5;

		// clamp bias value
		if (newAI > 0 && newAI < C) this.svm.B = b1;
		if (newAJ > 0 && newAJ < C) this.svm.B = b2;

		// default
		return true;
	}

	public getNewB1(deltaI: number, deltaJ: number): number {
		// shortcuts
		const I = this.indexI;
		const J = this.indexJ;

		// compute partials
		const edgeI = this.expect[I] * deltaI * this.svm.kernel(this.inputs[I], this.inputs[I]);
		const edgeJ = this.expect[J] * deltaJ * this.svm.kernel(this.inputs[I], this.inputs[J]);

		return this.svm.B - this.errorI - edgeI - edgeJ;
	}

	public getNewB2(deltaI: number, deltaJ: number): number {
		// shortcuts
		const I = this.indexI;
		const J = this.indexJ;

		// compute partials
		const edgeI = this.expect[I] * deltaI * this.svm.kernel(this.inputs[I], this.inputs[J]);
		const edgeJ = this.expect[J] * deltaJ * this.svm.kernel(this.inputs[J], this.inputs[J]);

		return this.svm.B - this.errorJ - edgeI - edgeJ;
	}

	/**
	 * Indices if SMO can be skiped
	 */
	public get passesStep1(): boolean {
		// shortcuts
		const C = this.svm.coherence;
		const I = this.indexI;

		return !(
			(this.errorI * this.expect[I] < -this.svm.tolerance && this.svm.A[I] < C) ||
			(this.errorI * this.expect[I] > +this.svm.tolerance && this.svm.A[I] > 0)
		);
	}

	/**
	 * Indices if SMO can be skiped
	 */
	public get passesStep2(): boolean {
		// shortcuts
		const AI = this.svm.A[this.indexI];
		const AJ = this.svm.A[this.indexJ];
		const C = this.svm.coherence;
		const I = this.indexI;
		const J = this.indexJ;

		// find adjust bounds
		if (this.expect[I] === this.expect[J]) {
			this.boundM = Math.max(0, AI + AJ - C);
			this.boundN = Math.min(C, AI + AJ);
		} else {
			this.boundM = Math.max(0, AJ - AI);
			this.boundN = Math.min(C, AJ - AI + C);
		}

		// guard - test numerical tolerance
		if (Math.abs(this.boundM - this.boundN) < this.svm.tolerance) return true;

		// compute subkernels
		const kernelI = this.svm.kernel(this.inputs[I], this.inputs[I]);
		const kernelJ = this.svm.kernel(this.inputs[J], this.inputs[J]);
		const kernelX = this.svm.kernel(this.inputs[I], this.inputs[J]);

		// memorize
		this.kernel = 2 * kernelX - kernelI - kernelJ;

		// guard - test kernel determinant
		if (this.kernel >= 0) return true;

		// deafult
		return false;
	}
}
