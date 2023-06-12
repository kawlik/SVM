export type Dataset = [number, number][];

export function getClear(): [Dataset, Dataset] {
	return [[], []];
}

export function getCircle(numData: number = 100): [Dataset, Dataset] {
	const R1 = 0.2;
	const R2 = 0.3;

	const circleIn = (x1: number, x2: number) => (x1 - 0.5) ** 2 + (x2 - 0.5) ** 2 < R1 ** 2;
	const circleOut = (x1: number, x2: number) => (x1 - 0.5) ** 2 + (x2 - 0.5) ** 2 > R2 ** 2;

	const d1 = getDataset(numData * 0.3, circleIn);
	const d2 = getDataset(numData * 0.7, circleOut);

	return [d1, d2];
}

export function getSquare(numData: number = 100): [Dataset, Dataset] {
	const R1 = 0.45;
	const R2 = 0.55;

	const squareIn = (x1: number, x2: number) => (x1 < R1 && x2 < R1) || (x1 > R2 && x2 > R2);
	const squareOut = (x1: number, x2: number) => (x1 < R1 && x2 > R2) || (x1 > R2 && x2 < R1);

	const d1 = getDataset(numData * 0.5, squareIn);
	const d2 = getDataset(numData * 0.5, squareOut);

	return [d1, d2];
}

export function getStreak(numData: number = 100): [Dataset, Dataset] {
	const R1 = 0.15;
	const R2 = 2.75;

	const streakIn = (x1: number, x2: number) =>
		(x1 - 0.3) ** 2 / R2 ** 2 + (x2 - 0.6) ** 2 < R1 ** 2;

	const streakOut = (x1: number, x2: number) =>
		(x1 - 0.7) ** 2 / R2 ** 2 + (x2 - 0.4) ** 2 < R1 ** 2;

	const d1 = getDataset(numData * 0.5, streakIn);
	const d2 = getDataset(numData * 0.5, streakOut);

	return [d1, d2];
}

function getDataset(numData: number, classify: (x1: number, x2: number) => boolean): Dataset {
	const dataset = new Array<[number, number]>(numData);

	for (let i = 0; i < numData; i++) {
		let x1 = Math.random();
		let x2 = Math.random();

		while (!classify(x1, x2)) {
			x1 = Math.random();
			x2 = Math.random();
		}

		dataset[i] = [x1, x2];
	}

	return dataset;
}
