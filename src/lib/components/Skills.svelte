<script lang="ts">
	import type { CharacterState } from '$lib/stores/character.svelte.ts';
	import { formatModifier } from '$lib/utils/math';

	interface Props {
		character: CharacterState;
	}

	let { character }: Props = $props();

	const splitIndex = $derived(Math.ceil(character.skillTotals.length / 2));
	const leftSkills = $derived(character.skillTotals.slice(0, splitIndex));
	const rightSkills = $derived(character.skillTotals.slice(splitIndex));

	function toggleClassSkill(name: string) {
		const existing = character.data.skills.find(s => s.name === name);
		if (existing) {
			existing.classSkill = !existing.classSkill;
		} else {
			character.data.skills.push({ name, ranks: 0, classSkill: true, abilityMod: 0, miscMod: 0 });
		}
	}

	function setRanks(name: string, ranks: number) {
		const existing = character.data.skills.find(s => s.name === name);
		if (existing) {
			existing.ranks = ranks;
		} else {
			const def = character.skillTotals.find(s => s.name === name);
			character.data.skills.push({ name, ranks, classSkill: false, abilityMod: def?.abilityMod ?? 0, miscMod: 0 });
		}
	}

	function setMisc(name: string, misc: number) {
		const existing = character.data.skills.find(s => s.name === name);
		if (existing) {
			existing.miscMod = misc;
		} else {
			const def = character.skillTotals.find(s => s.name === name);
			character.data.skills.push({ name, ranks: 0, classSkill: false, abilityMod: def?.abilityMod ?? 0, miscMod: misc });
		}
	}
</script>

<div class="section-card overflow-hidden">
	<div class="section-header">📋 Skills</div>
	<div class="p-0.5">
		<div class="grid grid-cols-2 gap-2">
			<!-- Left column -->
			<div>
				<div class="grid grid-cols-[2rem_1fr_2.5rem_2.5rem_2.5rem_2.5rem_2.5rem_2.5rem] gap-0.5 text-[9px] font-bold text-center text-ink-light uppercase mb-0.5 px-1 pt-1">
					<div>CS</div>
					<div class="text-left">Skill Name</div>
					<div>Total</div>
					<div>Rank</div>
					<div>Ability</div>
					<div>Class</div>
					<div>Misc</div>
					<div>ACP</div>
				</div>
				<div class="divide-y divide-warm-200">
					{#each leftSkills as skill}
						<div class="grid grid-cols-[2rem_1fr_2.5rem_2.5rem_2.5rem_2.5rem_2.5rem_2.5rem] gap-0.5 items-center text-xs px-1 even:bg-parchment-dark/40 hover:bg-warm-100 transition-colors">
							<input
								type="checkbox"
								class="mx-auto accent-burgundy cursor-pointer"
								checked={skill.classSkill}
								onchange={() => toggleClassSkill(skill.name)}
							/>
							<div class="truncate text-ink">{skill.name}</div>
							<div class="readonly-field font-bold text-burgundy">{formatModifier(skill.total)}</div>
							<input
								type="number"
								class="grid-input"
								value={skill.rank}
								oninput={(e) => setRanks(skill.name, parseInt((e.target as HTMLInputElement).value) || 0)}
								min="0"
								max="23"
							/>
							<div class="readonly-field">{formatModifier(skill.abilityMod)}</div>
							<div class="readonly-field">{skill.classSkill && skill.rank > 0 ? '+3' : ''}</div>
							<input
								type="number"
								class="grid-input"
								value={skill.miscMod}
								oninput={(e) => setMisc(skill.name, parseInt((e.target as HTMLInputElement).value) || 0)}
							/>
							<div class="readonly-field">0</div>
						</div>
					{/each}
				</div>
			</div>

			<!-- Right column -->
			<div>
				<div class="grid grid-cols-[2rem_1fr_2.5rem_2.5rem_2.5rem_2.5rem_2.5rem_2.5rem] gap-0.5 text-[9px] font-bold text-center text-ink-light uppercase mb-0.5 px-1 pt-1">
					<div>CS</div>
					<div class="text-left">Skill Name</div>
					<div>Total</div>
					<div>Rank</div>
					<div>Ability</div>
					<div>Class</div>
					<div>Misc</div>
					<div>ACP</div>
				</div>
				<div class="divide-y divide-warm-200">
					{#each rightSkills as skill}
						<div class="grid grid-cols-[2rem_1fr_2.5rem_2.5rem_2.5rem_2.5rem_2.5rem_2.5rem] gap-0.5 items-center text-xs px-1 even:bg-parchment-dark/40 hover:bg-warm-100 transition-colors">
							<input
								type="checkbox"
								class="mx-auto accent-burgundy cursor-pointer"
								checked={skill.classSkill}
								onchange={() => toggleClassSkill(skill.name)}
							/>
							<div class="truncate text-ink">{skill.name}</div>
							<div class="readonly-field font-bold text-burgundy">{formatModifier(skill.total)}</div>
							<input
								type="number"
								class="grid-input"
								value={skill.rank}
								oninput={(e) => setRanks(skill.name, parseInt((e.target as HTMLInputElement).value) || 0)}
								min="0"
								max="23"
							/>
							<div class="readonly-field">{formatModifier(skill.abilityMod)}</div>
							<div class="readonly-field">{skill.classSkill && skill.rank > 0 ? '+3' : ''}</div>
							<input
								type="number"
								class="grid-input"
								value={skill.miscMod}
								oninput={(e) => setMisc(skill.name, parseInt((e.target as HTMLInputElement).value) || 0)}
							/>
							<div class="readonly-field">0</div>
						</div>
					{/each}
				</div>
			</div>
		</div>
	</div>
</div>
