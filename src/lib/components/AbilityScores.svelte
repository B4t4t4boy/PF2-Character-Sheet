<script lang="ts">
	import type { CharacterState } from '$lib/stores/character.svelte.ts';
	import { formatModifier } from '$lib/utils/math';

	interface Props {
		character: CharacterState;
	}

	let { character }: Props = $props();

	const abilities = $derived([
		{ label: 'STR', score: character.data.abilities.str, mod: character.strMod },
		{ label: 'DEX', score: character.data.abilities.dex, mod: character.dexMod },
		{ label: 'CON', score: character.data.abilities.con, mod: character.conMod },
		{ label: 'INT', score: character.data.abilities.int, mod: character.intMod },
		{ label: 'WIS', score: character.data.abilities.wis, mod: character.wisMod },
		{ label: 'CHA', score: character.data.abilities.cha, mod: character.chaMod },
	]);

	function setAbility(ability: 'str' | 'dex' | 'con' | 'int' | 'wis' | 'cha', value: number) {
		character.data.abilities[ability] = value;
	}
</script>

<div class="grid grid-cols-6 gap-1.5 p-1">
	{#each abilities as abil}
		<div class="flex flex-col items-center section-card overflow-hidden">
			<div class="bg-burgundy text-gold text-[10px] font-bold py-0.5 text-center w-full uppercase tracking-widest">{abil.label}</div>
			<div class="py-1 px-2 w-full flex flex-col items-center gap-0.5">
				<input
					type="number"
					class="w-12 border border-warm-300 bg-cream px-1 py-0.5 text-sm font-bold text-center text-ink focus:border-gold focus:ring-1 focus:ring-gold/30 focus:outline-none"
					value={abil.score}
					oninput={(e) => setAbility(
						abil.label.toLowerCase() as 'str' | 'dex' | 'con' | 'int' | 'wis' | 'cha',
						parseInt((e.target as HTMLInputElement).value) || 10
					)}
				/>
				<div class="mod-box text-sm font-bold mt-0.5 w-10">{formatModifier(abil.mod)}</div>
			</div>
		</div>
	{/each}
</div>
