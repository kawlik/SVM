export abstract class Kernel {
	/**
	 * @param vect1 Input vector 1
	 * @param vect2 Input vector 2
	 * @returns Dot product of two input vectors
	 */
	public static linear(vect1: number[], vect2: number[]): number {
		let sum = 0;

		for (let i = 0; i < vect1.length; i++) {
			sum += vect1[i] * vect2[i];
		}

		return sum;
	}

	/**
	 * @param vect1 Input vector 1
	 * @param vect2 Input vector 2
	 * @param vect2 Sigma param
	 * @returns RFB product of two input vectors
	 */
	public static radial(vect1: number[], vect2: number[], sigma = 1): number {
		let sum = 0;

		for (let i = 0; i < vect1.length; i++) {
			sum += (vect1[i] - vect2[i]) ** 2;
		}

		return Math.exp(-sum / (2 * sigma ** 2));
	}

	/**
	 * @param sigma Sigma param
	 * @returns Refrence to RBF function
	 */
	public static rfb(sigma: number) {
		return function (vect1: number[], vect2: number[]): number {
			let sum = 0;

			for (let i = 0; i < vect1.length; i++) {
				sum += (vect1[i] - vect2[i]) ** 2;
			}

			return Math.exp(-sum / (2 * sigma ** 2));
		};
	}
}
