<script lang="ts">
	interface Props {
		value: number | string;
		id?: string;
		formatter?: (val: number | string) => string;
	}

	let { value, id = '', formatter = undefined }: Props = $props();

	const display = $derived(formatter ? formatter(value) : String(value));
</script>

<div {id} class="readonly-field">{display}</div>