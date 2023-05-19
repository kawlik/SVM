export abstract class Random {
	public static uniform(): number {
		return Math.random() * 2 - 1;
	}
}
