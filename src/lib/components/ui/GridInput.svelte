<script lang="ts">
	interface Props {
		value: number;
		id?: string;
		placeholder?: string;
		min?: number;
		max?: number;
		disabled?: boolean;
		onchange?: (value: number) => void;
	}

	let { value, id = '', placeholder = '', min = undefined, max = undefined, disabled = false, onchange = undefined }: Props = $props();

	function handleInput(e: Event) {
		const target = e.target as HTMLInputElement;
		const newVal = parseInt(target.value) || 0;
		if (onchange) onchange(newVal);
	}
</script>

<input
	{id}
	type="number"
	class:grid-input={true}
	class:opacity-50={disabled}
	{placeholder}
	{min}
	{max}
	{disabled}
	bind:value
	oninput={handleInput}
/>