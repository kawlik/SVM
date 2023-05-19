export abstract class Vector {
	public static dot(vect1: number[], vect2: number[], cardinality: number): number {
		let product = 0;

		for (let i = 0; i < cardinality; i++) {
			product += vect1[i] * vect2[i];
		}

		return product;
	}
}
