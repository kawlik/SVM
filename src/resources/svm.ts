import { Kernel } from "./utils/kernel";

export class SVM {
	private inputs: number[][];
	private expect: number[];

	private a: number[];
	private b: number;

	constructor(private readonly kernel = Kernel.rfb(0.1)) {
		// init externals
		this.inputs = [];
		this.expect = [];

		// init internals
		this.a = [];
		this.b = 0;
	}

	public display(rangex: [number, number, number], rangey: [number, number, number]): void {
		const x_min = rangex[0];
		const x_max = rangex[1];
		const x_det = rangex[2];

		const y_min = rangey[0];
		const y_max = rangey[1];
		const y_det = rangey[2];

		for (let y = y_max; y >= y_min - y_det / 2; y -= y_det) {
			let row = `${y >= 0 ? " " : ""}${y.toFixed(2)} `;

			for (let x = x_min; x <= x_max + x_det / 2; x += x_det) {
				const sign = this.predict([x, y]) > 0 ? "+" : "-";
				const isD1 = (x - 0.75) ** 2 + (y - 0.75) ** 2 <= 0.5 ** 2;
				const isD2 = (x - 0.25) ** 2 + (y + 0.25) ** 2 <= 0.5 ** 2;

				if (isD1) row += "1";
				if (isD2) row += "0";

				if (!isD1 && !isD2) row += sign;
			}

			console.log(row);
		}
	}

	public predict(input: number[]): number {
		return Math.sign(this.margin(input));
	}

	public train(inputs: number[][], expect: number[]): void {
		// store data and labels
		this.inputs = inputs;
		this.expect = expect;

		// parameters
		const C = 1.0;
		const N = this.inputs.length;
		const kernel = this.kernel;
		const tolerance = 1e-4;
		const numEpochs = 10000;
		const numPasses = 100;

		// initializations
		this.a = new Array(N).fill(0);
		this.b = 0.0;

		// run SMO algorithm
		let iter = 0;
		let passes = 0;
		while (passes < numPasses && iter < numEpochs) {
			let alphaChanged = 0;
			for (let i = 0; i < N; i++) {
				let Ei = this.margin(inputs[i]) - expect[i];
				if (
					(expect[i] * Ei < -tolerance && this.a[i] < C) ||
					(expect[i] * Ei > tolerance && this.a[i] > 0)
				) {
					// alpha_i needs updating! Pick a j to update it with
					let j = i;
					while (j === i) j = Math.floor(Math.random() * this.inputs.length);
					let Ej = this.margin(inputs[j]) - expect[j];

					// calculate L and H bounds for j to ensure we're in [0 C]x[0 C] box
					const ai = this.a[i];
					const aj = this.a[j];
					let L = 0;
					let H = C;
					if (expect[i] === expect[j]) {
						L = Math.max(0, ai + aj - C);
						H = Math.min(C, ai + aj);
					} else {
						L = Math.max(0, aj - ai);
						H = Math.min(C, C + aj - ai);
					}

					if (Math.abs(L - H) < 1e-4) continue;

					let eta =
						2 * kernel(inputs[i], inputs[j]) -
						kernel(inputs[i], inputs[i]) -
						kernel(inputs[j], inputs[j]);
					if (eta >= 0) continue;

					// compute new alpha_j and clip it inside [0 C]x[0 C] box
					// then compute alpha_i based on it.
					let newaj = aj - (expect[j] * (Ei - Ej)) / eta;
					if (newaj > H) newaj = H;
					if (newaj < L) newaj = L;
					if (Math.abs(aj - newaj) < 1e-4) continue;
					this.a[j] = newaj;
					let newai = ai + expect[i] * expect[j] * (aj - newaj);
					this.a[i] = newai;

					// update the bias term
					let b1 =
						this.b -
						Ei -
						expect[i] * (newai - ai) * kernel(inputs[i], inputs[i]) -
						expect[j] * (newaj - aj) * kernel(inputs[i], inputs[j]);
					let b2 =
						this.b -
						Ej -
						expect[i] * (newai - ai) * kernel(inputs[i], inputs[j]) -
						expect[j] * (newaj - aj) * kernel(inputs[j], inputs[j]);
					this.b = 0.5 * (b1 + b2);
					if (newai > 0 && newai < C) this.b = b1;
					if (newaj > 0 && newaj < C) this.b = b2;

					alphaChanged++;
				} // end alpha_i needed updating
			} // end for i=1..N

			iter++;
			//console.log("iter number %d, alphaChanged = %d", iter, alphaChanged);
			if (alphaChanged == 0) passes++;
			else passes = 0;
		}
	}

	private margin(input: number[]): number {
		let sum = this.b;

		for (let i = 0; i < this.inputs.length; i++) {
			sum += this.a[i] * this.expect[i] * this.kernel(input, this.inputs[i]);
		}

		return sum;
	}
}
