<script lang="ts">
	import type { CharacterState } from '$lib/stores/character.svelte.ts';

	interface Props {
		character: CharacterState;
	}

	let { character }: Props = $props();
</script>

<div class="section-card p-1.5">
	<div class="grid grid-cols-6 gap-1.5">
		<!-- Row 1: Name, Alignment, Deity, Player -->
		<div class="col-span-2">
			<div class="stat-label">Character Name</div>
			<input type="text" class="grid-input" placeholder="Name" bind:value={character.data.characterName} />
		</div>
		<div>
			<div class="stat-label">Alignment</div>
			<input type="text" class="grid-input" placeholder="LG" bind:value={character.data.alignment} />
		</div>
		<div>
			<div class="stat-label">Deity</div>
			<input type="text" class="grid-input" placeholder="Gorum" bind:value={character.data.deity} />
		</div>
		<div>
			<div class="stat-label">Player</div>
			<input type="text" class="grid-input" placeholder="Player" bind:value={character.data.player} />
		</div>

		<!-- Row 2: Race, Size, Gender, Age, Height, Weight -->
		<div>
			<div class="stat-label">Race</div>
			<input type="text" class="grid-input" placeholder="Human" bind:value={character.data.race} />
		</div>
		<div>
			<div class="stat-label">Size</div>
			<select class="grid-input" bind:value={character.data.size}>
				<option value="Fine">Fine</option>
				<option value="Diminutive">Dim</option>
				<option value="Tiny">Tiny</option>
				<option value="Small">Small</option>
				<option value="Medium">Medium</option>
				<option value="Large">Large</option>
				<option value="Huge">Huge</option>
				<option value="Gargantuan">Garg</option>
				<option value="Colossal">Colossal</option>
			</select>
		</div>
		<div>
			<div class="stat-label">Gender</div>
			<input type="text" class="grid-input" placeholder="M/F" bind:value={character.data.gender} />
		</div>
		<div>
			<div class="stat-label">Age</div>
			<input type="number" class="grid-input" placeholder="20" bind:value={character.data.age} />
		</div>
		<div>
			<div class="stat-label">Height</div>
			<input type="text" class="grid-input" placeholder="Height" bind:value={character.data.height} />
		</div>
		<div>
			<div class="stat-label">Weight</div>
			<input type="text" class="grid-input" placeholder="175 lbs" bind:value={character.data.weight} />
		</div>

		<!-- Row 3: Hair, Eyes -->
		<div>
			<div class="stat-label">Hair</div>
			<input type="text" class="grid-input" placeholder="Brown" bind:value={character.data.hair} />
		</div>
		<div>
			<div class="stat-label">Eyes</div>
			<input type="text" class="grid-input" placeholder="Green" bind:value={character.data.eyes} />
		</div>
	</div>
</div>
