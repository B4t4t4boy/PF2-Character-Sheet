import { db, type CharacterEntity } from '$lib/db';

export interface CharacterData {
	characterName: string;
	classLevel: string;
	alignment: string;
	deity: string;
	player: string;
	race: string;
	size: 'Fine' | 'Diminutive' | 'Tiny' | 'Small' | 'Medium' | 'Large' | 'Huge' | 'Gargantuan' | 'Colossal';
	gender: string;
	age: number;
	height: string;
	weight: string;
	hair: string;
	eyes: string;
	abilities: {
		str: number;
		dex: number;
		con: number;
		int: number;
		wis: number;
		cha: number;
	};
	hp: {
		current: number;
		max: number;
		nonLethal: number;
	};
	ac: {
		total: number;
		flatFooted: number;
		touch: number;
	};
	saves: {
		fort: { base: number; ability: number; magic: number; misc: number; temp: number };
		ref: { base: number; ability: number; magic: number; misc: number; temp: number };
		will: { base: number; ability: number; magic: number; misc: number; temp: number };
	};
	initiative: { dex: number; misc: number };
	bab: number;
	cmb: number;
	cmd: number;
	skills: Array<{
		name: string;
		ranks: number;
		classSkill: boolean;
		abilityMod: number;
		miscMod: number;
	}>;
	classes: Array<{
		name: string;
		level: number;
		hdSize: number;
		babProgression: 'fast' | 'medium' | 'slow';
		fortProgression: boolean;
		refProgression: boolean;
		willProgression: boolean;
		skillPointsPerLevel: number;
	}>;
	weapons: Array<{
		name: string;
		attackBonus: number;
		damage: string;
		critical: string;
		type: string;
		range: string;
		ammunition: string;
		notes: string;
	}>;
	spells: Array<{
		level: number;
		name: string;
		prepared: number;
		used: number;
		dc: number;
	}>;
	inventory: Array<{
		name: string;
		qty: number;
		weight: number;
		location: string;
		notes: string;
	}>;
	feats: Array<{
		name: string;
		description: string;
	}>;
	specialAbilities: Array<{
		name: string;
		description: string;
	}>;
	notes: string;
}

export function createDefaultCharacter(): CharacterData {
	return {
		characterName: '',
		classLevel: '',
		alignment: '',
		deity: '',
		player: '',
		race: '',
		size: 'Medium',
		gender: '',
		age: 0,
		height: '',
		weight: '',
		hair: '',
		eyes: '',
		abilities: { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 },
		hp: { current: 10, max: 10, nonLethal: 0 },
		ac: { total: 10, flatFooted: 10, touch: 10 },
		saves: {
			fort: { base: 0, ability: 0, magic: 0, misc: 0, temp: 0 },
			ref: { base: 0, ability: 0, magic: 0, misc: 0, temp: 0 },
			will: { base: 0, ability: 0, magic: 0, misc: 0, temp: 0 }
		},
		initiative: { dex: 0, misc: 0 },
		bab: 0,
		cmb: 0,
		cmd: 10,
		skills: [],
		classes: [],
		weapons: [],
		spells: [],
		inventory: [],
		feats: [],
		specialAbilities: [],
		notes: ''
	};
}

export async function saveCharacter(name: string, data: CharacterData): Promise<number> {
	const existing = await db.characters.where('name').equals(name).first();
	const now = new Date();

	if (existing) {
		await db.characters.update(existing.id!, {
			data: data as unknown as Record<string, unknown>,
			updatedAt: now
		});
		return existing.id!;
	} else {
		return db.characters.add({
			name,
			data: data as unknown as Record<string, unknown>,
			createdAt: now,
			updatedAt: now
		}).then(id => id!);
	}
}

export async function loadCharacter(id: number): Promise<CharacterData | null> {
	const entity = await db.characters.get(id);
	if (!entity) return null;
	return entity.data as unknown as CharacterData;
}

export async function loadCharacterByName(name: string): Promise<CharacterEntity | undefined> {
	return db.characters.where('name').equals(name).first();
}

export async function listCharacters(): Promise<Array<{ id: number; name: string; updatedAt: Date }>> {
	return db.characters.orderBy('updatedAt').reverse().toArray().then(
		entries => entries.map(e => ({ id: e.id!, name: e.name, updatedAt: e.updatedAt }))
	);
}

export async function deleteCharacter(id: number): Promise<void> {
	await db.characters.delete(id);
}

export function exportToJson(data: CharacterData): string {
	return JSON.stringify(data, null, 2);
}

export function importFromJson(json: string): CharacterData {
	return JSON.parse(json) as CharacterData;
}