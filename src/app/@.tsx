// import app components
import Chart from "./chart/@";
import Panel from "./panel/@";

export default function () {
	// component logic

	// component layout
	return (
		<main class="flex gap-4 p-4 w-full h-full">
			<Chart />
			<Panel />
		</main>
	);
}
