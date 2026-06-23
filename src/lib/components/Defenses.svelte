<script lang="ts">
	import type { CharacterState } from '$lib/stores/character.svelte.ts';
	import { formatModifier } from '$lib/utils/math';

	interface Props {
		character: CharacterState;
	}

	let { character }: Props = $props();
</script>

<div class="grid grid-cols-3 gap-1.5 p-1">
	<!-- HP Section -->
	<div class="section-card overflow-hidden">
		<div class="section-header">💖 Hit Points</div>
		<div class="p-1.5">
			<div class="grid grid-cols-3 gap-1">
				<div>
					<div class="stat-label">Current</div>
					<input type="number" class="grid-input" bind:value={character.data.hp.current} />
				</div>
				<div>
					<div class="stat-label">Max</div>
					<div class="readonly-field font-bold">{character.totalMaxHP}</div>
				</div>
				<div>
					<div class="stat-label">Non-Lethal</div>
					<input type="number" class="grid-input" bind:value={character.data.hp.nonLethal} />
				</div>
			</div>
		</div>
	</div>

	<!-- AC Section -->
	<div class="section-card overflow-hidden">
		<div class="section-header">🛡️ Armor Class</div>
		<div class="p-1.5">
			<div class="grid grid-cols-3 gap-1">
				<div>
					<div class="stat-label">Total</div>
					<div class="readonly-field font-bold text-ink">{character.totalAC}</div>
				</div>
				<div>
					<div class="stat-label">Flat-Footed</div>
					<div class="readonly-field">{character.totalAC - character.dexMod}</div>
				</div>
				<div>
					<div class="stat-label">Touch</div>
					<div class="readonly-field">{10 + character.dexMod}</div>
				</div>
			</div>
			<div class="grid grid-cols-4 gap-1 mt-1">
				<div>
					<div class="text-[9px] font-semibold text-ink-light text-center uppercase">Armor</div>
					<input type="number" class="grid-input" bind:value={character.data.ac.total} placeholder="0" />
				</div>
				<div>
					<div class="text-[9px] font-semibold text-ink-light text-center uppercase">Shield</div>
					<input type="number" class="grid-input" placeholder="0" disabled />
				</div>
				<div>
					<div class="text-[9px] font-semibold text-ink-light text-center uppercase">Natural</div>
					<input type="number" class="grid-input" placeholder="0" disabled />
				</div>
				<div>
					<div class="text-[9px] font-semibold text-ink-light text-center uppercase">Defl.</div>
					<input type="number" class="grid-input" placeholder="0" disabled />
				</div>
			</div>
		</div>
	</div>

	<!-- Saves Section -->
	<div class="section-card overflow-hidden">
		<div class="section-header">✨ Saving Throws</div>
		<div class="p-1.5">
			<div class="grid grid-cols-5 gap-0.5 mb-0.5">
				<div></div>
				<div class="text-[9px] font-semibold text-ink-light text-center uppercase">Base</div>
				<div class="text-[9px] font-semibold text-ink-light text-center uppercase">Ability</div>
				<div class="text-[9px] font-semibold text-ink-light text-center uppercase">Magic</div>
				<div class="text-[9px] font-semibold text-ink-light text-center uppercase">Total</div>
			</div>
			{#each [
				{ label: 'Fort', base: character.fortSave, ability: character.conMod, magic: character.data.saves.fort.magic },
				{ label: 'Ref', base: character.refSave, ability: character.dexMod, magic: character.data.saves.ref.magic },
				{ label: 'Will', base: character.willSave, ability: character.wisMod, magic: character.data.saves.will.magic },
			] as sv}
				<div class="grid grid-cols-5 gap-0.5 items-center">
					<div class="text-[10px] font-bold text-ink-light uppercase">{sv.label}</div>
					<div class="readonly-field">{sv.base}</div>
					<div class="readonly-field">{formatModifier(sv.ability)}</div>
					<input type="number" class="grid-input" bind:value={sv.magic} />
					<div class="readonly-field font-bold text-burgundy">{sv.base + sv.ability + sv.magic}</div>
				</div>
			{/each}
		</div>
	</div>

	<!-- Initiative -->
	<div class="section-card overflow-hidden">
		<div class="section-header">⚡ Initiative</div>
		<div class="p-1.5">
			<div class="grid grid-cols-2 gap-1">
				<div>
					<div class="stat-label">Total</div>
					<div class="readonly-field text-sm font-bold text-burgundy">{formatModifier(character.initiative)}</div>
				</div>
				<div>
					<div class="stat-label">Misc</div>
					<input type="number" class="grid-input" bind:value={character.data.initiative.misc} />
				</div>
			</div>
		</div>
	</div>

	<!-- BAB, CMB, CMD -->
	<div class="section-card overflow-hidden">
		<div class="section-header">⚔️ Combat Stats</div>
		<div class="p-1.5">
			<div class="grid grid-cols-3 gap-1">
				<div>
					<div class="stat-label">BAB</div>
					<div class="readonly-field text-sm font-bold text-burgundy">{character.totalBAB}</div>
				</div>
				<div>
					<div class="stat-label">CMB</div>
					<div class="readonly-field text-sm font-bold text-burgundy">{formatModifier(character.cmb)}</div>
				</div>
				<div>
					<div class="stat-label">CMD</div>
					<div class="readonly-field text-sm font-bold text-burgundy">{character.cmd}</div>
				</div>
			</div>
		</div>
	</div>
</div>
