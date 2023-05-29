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
}
