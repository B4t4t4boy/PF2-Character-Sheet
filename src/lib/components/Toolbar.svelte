<script lang="ts">
	import { saveCharacter, exportToJson, importFromJson, createDefaultCharacter, listCharacters, type CharacterData } from '$lib/utils/persistence';
	import type { CharacterState } from '$lib/stores/character.svelte.ts';

	interface Props {
		character: CharacterState;
		onNewCharacter?: () => void;
	}

	let { character, onNewCharacter = undefined }: Props = $props();
	let savedMessage = $state('');
	let saving = $state(false);

	async function handleSave() {
		saving = true;
		try {
			const name = character.data.characterName || 'Unnamed Character';
			await saveCharacter(name, character.data as unknown as CharacterData);
			savedMessage = 'Saved!';
			setTimeout(() => savedMessage = '', 2000);
		} catch (e) {
			savedMessage = 'Error saving';
			console.error(e);
		} finally {
			saving = false;
		}
	}

	function handleExport() {
		const json = exportToJson(character.data as unknown as CharacterData);
		const blob = new Blob([json], { type: 'application/json' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `${character.data.characterName || 'character'}.json`;
		a.click();
		URL.revokeObjectURL(url);
	}

	function handleImport() {
		const input = document.createElement('input');
		input.type = 'file';
		input.accept = '.json';
		input.onchange = async (e) => {
			const file = (e.target as HTMLInputElement).files?.[0];
			if (!file) return;
			const text = await file.text();
			try {
				const data = importFromJson(text);
				Object.assign(character.data, data);
			} catch (err) {
				alert('Invalid JSON file');
				console.error(err);
			}
		};
		input.click();
	}

	function handlePrint() {
		window.print();
	}

	function handleNew() {
		const fresh = createDefaultCharacter();
		Object.assign(character.data, fresh);
		if (onNewCharacter) onNewCharacter();
	}

	async function handleList() {
		const characters = await listCharacters();
		if (characters.length === 0) {
			alert('No saved characters found.');
			return;
		}
		const names = characters.map(c => `${c.name} (${c.updatedAt.toLocaleDateString()})`).join('\n');
		alert(`Saved characters:\n${names}\n\nLoad/delete via browser console for now.`);
	}
</script>

<div class="toolbar flex items-center gap-1.5 p-1.5 bg-burgundy border-b-2 border-burgundy-dark shadow-section">
	<span class="text-gold-light text-xs font-bold tracking-wider uppercase mr-2">⚔️ Sheet</span>
	<button class="btn-primary" onclick={handleSave} disabled={saving}>
		{saving ? 'Saving...' : '💾 Save'}
	</button>
	<button class="btn-secondary" onclick={handleExport}>📤 Export</button>
	<button class="btn-secondary" onclick={handleImport}>📥 Import</button>
	<button class="btn-secondary" onclick={handlePrint}>🖨️ Print</button>
	<button class="btn-secondary" onclick={handleNew}>✨ New</button>
	<button class="btn-secondary" onclick={handleList}>📂 Load</button>
	<div class="flex-1"></div>
	{#if savedMessage}
		<span class="text-xs text-gold font-medium">{savedMessage}</span>
	{/if}
</div>
