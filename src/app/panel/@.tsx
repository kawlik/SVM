import { createSignal } from "solid-js";
import { getClear, getCircle, getSquare, getStreak, Dataset } from "../chart/data";
import { Kernel } from "../../model/utils/kernel";

export default function (props: {
	setDatasets: (input: [Dataset, Dataset]) => void;
	setKernel: (input: (vect1: number[], vect2: number[]) => number) => void;
	setCoherence: (input: number) => void;
	setNumEpochs: (input: number) => void;
	setNumPasses: (input: number) => void;
	setTolerance: (input: number) => void;
}) {
	// component logic
	const [datasize, setDatasize] = createSignal(100);

	// component layout
	return (
		<section class="flex flex-col flex-1 gap-4 pr-4 overflow-y-scroll">
			<div class="p-2 shadow-md">
				<p class="text-lg">Data distribution</p>
				<select
					class="bg-neutral-100 p-2 rounded w-full"
					onInput={(v) => {
						const idx = v.target.value;

						if (idx === "0") props.setDatasets(getClear());
						if (idx === "1") props.setDatasets(getCircle(datasize()));
						if (idx === "2") props.setDatasets(getSquare(datasize()));
						if (idx === "3") props.setDatasets(getStreak(datasize()));
					}}
				>
					<option value={0} label="Clear" />
					<option value={1} label="Circle" />
					<option value={2} label="Square" />
					<option value={3} label="Streak" />
				</select>
				<input
					type="range"
					class="w-full my-2"
					min={100}
					max={500}
					onInput={(e) => setDatasize(+e.target.value)}
					value={datasize()}
				/>
				<p class="mx-auto text-center text-sm">{datasize()}</p>
			</div>
			<hr />
			<div class="p-2 shadow-md">
				<p class="text-lg">Kernel</p>
				<select
					class="bg-neutral-100 p-2 rounded w-full"
					onInput={(v) => {
						const idx = v.target.value;

						if (idx === "0") props.setKernel(Kernel.linear);
						if (idx === "1") props.setKernel(Kernel.rfb(0.01));
						if (idx === "2") props.setKernel(Kernel.rfb(0.05));
						if (idx === "3") props.setKernel(Kernel.rfb(0.1));
						if (idx === "4") props.setKernel(Kernel.rfb(0.5));
						if (idx === "5") props.setKernel(Kernel.rfb(1));
						if (idx === "6") props.setKernel(Kernel.rfb(2));
						if (idx === "7") props.setKernel(Kernel.ply(2));
						if (idx === "8") props.setKernel(Kernel.ply(3));
						if (idx === "9") props.setKernel(Kernel.ply(5));
						if (idx === "10") props.setKernel(Kernel.ply(10));
						if (idx === "11") props.setKernel(Kernel.ply(15));
					}}
				>
					<option value={0} label="Linear" />
					<option value={1} label="Radial (0.01)" />
					<option value={2} label="Radial (0.05)" />
					<option value={3} label="Radial (0.1)" />
					<option value={4} label="Radial (0.5)" />
					<option value={5} label="Radial (1)" />
					<option value={6} label="Radial (2)" />
					<option value={7} label="Polynomial (2)" />
					<option value={8} label="Polynomial (3)" />
					<option value={9} label="Polynomial (5)" />
					<option value={10} label="Polynomial (10)" />
					<option value={11} label="Polynomial (15)" />
				</select>
			</div>
		</section>
	);
}
