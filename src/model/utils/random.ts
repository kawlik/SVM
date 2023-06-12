export abstract class Random {
	/**
	 * @returns Random float between -1 and 1
	 */
	public static uniform(): number {
		return Math.random() * 2 - 1;
	}

	/**
	 * @param min Lower band (included)
	 * @param max Upper band (included)
	 * @returns Random float between @min and @max
	 */
	public static randf(min: number, max: number): number {
		if (min > max) [min, max] = [max, min];

		return Math.random() * (max - min) + min;
	}

	/**
	 * @param min Lower band (included)
	 * @param max Upper band (included)
	 * @returns Random int between @min and @max
	 */
	public static randi(min: number, max: number): number {
		return Math.round(Random.randf(min, max));
	}

	/**
	 * @param min Lower band (included)
	 * @param max Upper band (included)
	 * @param exc Value to exclude
	 * @returns Random int between @min and @max
	 */
	public static randiexc(min: number, max: number, exc: number): number {
		let rand = Random.randi(min, max);

		// prevent infinite loop
		if (Math.abs(max - min) < 1) return rand;

		while (rand === exc) rand = Random.randi(min, max);

		return rand;
	}
}
