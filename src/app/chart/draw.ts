const colorOut = "#FAE5EB";
const colorIn = "#E5F0FA";

function rand(min: number, max: number): number {
	if (min > max) [min, max] = [max, min];

	return Math.random() * (max - min) + min;
}

function draw(
	ctx: CanvasRenderingContext2D,
	cvs: HTMLCanvasElement,
	predicate: (inputs: number[]) => number,
	data: { x: number; y: number; w: number }
): void {
	const color =
		predicate([(data.x + data.w / 2) / cvs.width, (data.y + data.w / 2) / cvs.width]) <= 0
			? colorOut
			: colorIn;

	ctx.beginPath();
	ctx.fillStyle = color;
	ctx.fillRect(data.x - 0.2, data.y - 0.2, data.w + 0.4, data.w + 0.4);
	ctx.closePath();
}

export function drawRecurse(
	ctx: CanvasRenderingContext2D,
	cvs: HTMLCanvasElement,
	predicate: (inputs: number[]) => number,
	data: { x: number; y: number; w: number },
	deep: number
): void {
	if (deep <= 0) return draw(ctx, cvs, predicate, data);

	const initialGuess = predicate([
		rand(data.x, data.x + data.w) / cvs.width,
		rand(data.y, data.y + data.w) / cvs.width,
	]);

	if (Number.isNaN(initialGuess)) return;

	for (let i = 0; i < Math.log2(deep) * deep ** 2; i++) {
		const x = rand(data.x, data.x + data.w) / cvs.width;
		const y = rand(data.y, data.y + data.w) / cvs.width;

		if (predicate([x, y]) === initialGuess) continue;

		const delta = data.w / 2;

		drawRecurse(ctx, cvs, predicate, { x: data.x, y: data.y, w: delta }, deep - 1);
		drawRecurse(ctx, cvs, predicate, { x: data.x + delta, y: data.y, w: delta }, deep - 1);
		drawRecurse(ctx, cvs, predicate, { x: data.x, y: data.y + delta, w: delta }, deep - 1);
		drawRecurse(
			ctx,
			cvs,
			predicate,
			{
				x: data.x + delta,
				y: data.y + delta,
				w: delta,
			},
			deep - 1
		);

		return;
	}

	return draw(ctx, cvs, predicate, data);
}
