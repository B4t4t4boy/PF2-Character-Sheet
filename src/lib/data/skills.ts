export interface SkillDefinition {
	name: string;
	ability: 'str' | 'dex' | 'con' | 'int' | 'wis' | 'cha';
	trainedOnly: boolean;
	armorCheckPenalty: boolean;
}

export const skills: SkillDefinition[] = [
	{ name: 'Acrobatics', ability: 'dex', trainedOnly: false, armorCheckPenalty: true },
	{ name: 'Appraise', ability: 'int', trainedOnly: false, armorCheckPenalty: false },
	{ name: 'Bluff', ability: 'cha', trainedOnly: false, armorCheckPenalty: false },
	{ name: 'Climb', ability: 'str', trainedOnly: false, armorCheckPenalty: true },
	{ name: 'Craft', ability: 'int', trainedOnly: false, armorCheckPenalty: false },
	{ name: 'Diplomacy', ability: 'cha', trainedOnly: false, armorCheckPenalty: false },
	{ name: 'Disable Device', ability: 'dex', trainedOnly: true, armorCheckPenalty: true },
	{ name: 'Disguise', ability: 'cha', trainedOnly: false, armorCheckPenalty: false },
	{ name: 'Escape Artist', ability: 'dex', trainedOnly: false, armorCheckPenalty: true },
	{ name: 'Fly', ability: 'dex', trainedOnly: false, armorCheckPenalty: true },
	{ name: 'Handle Animal', ability: 'cha', trainedOnly: true, armorCheckPenalty: false },
	{ name: 'Heal', ability: 'wis', trainedOnly: false, armorCheckPenalty: false },
	{ name: 'Intimidate', ability: 'cha', trainedOnly: false, armorCheckPenalty: false },
	{ name: 'Knowledge (Arcana)', ability: 'int', trainedOnly: true, armorCheckPenalty: false },
	{ name: 'Knowledge (Dungeoneering)', ability: 'int', trainedOnly: true, armorCheckPenalty: false },
	{ name: 'Knowledge (Engineering)', ability: 'int', trainedOnly: true, armorCheckPenalty: false },
	{ name: 'Knowledge (Geography)', ability: 'int', trainedOnly: true, armorCheckPenalty: false },
	{ name: 'Knowledge (History)', ability: 'int', trainedOnly: true, armorCheckPenalty: false },
	{ name: 'Knowledge (Local)', ability: 'int', trainedOnly: true, armorCheckPenalty: false },
	{ name: 'Knowledge (Nature)', ability: 'int', trainedOnly: true, armorCheckPenalty: false },
	{ name: 'Knowledge (Nobility)', ability: 'int', trainedOnly: true, armorCheckPenalty: false },
	{ name: 'Knowledge (Planes)', ability: 'int', trainedOnly: true, armorCheckPenalty: false },
	{ name: 'Knowledge (Religion)', ability: 'int', trainedOnly: true, armorCheckPenalty: false },
	{ name: 'Linguistics', ability: 'int', trainedOnly: true, armorCheckPenalty: false },
	{ name: 'Perception', ability: 'wis', trainedOnly: false, armorCheckPenalty: false },
	{ name: 'Perform', ability: 'cha', trainedOnly: false, armorCheckPenalty: false },
	{ name: 'Profession', ability: 'wis', trainedOnly: true, armorCheckPenalty: false },
	{ name: 'Ride', ability: 'dex', trainedOnly: false, armorCheckPenalty: true },
	{ name: 'Sense Motive', ability: 'wis', trainedOnly: false, armorCheckPenalty: false },
	{ name: 'Sleight of Hand', ability: 'dex', trainedOnly: true, armorCheckPenalty: true },
	{ name: 'Spellcraft', ability: 'int', trainedOnly: true, armorCheckPenalty: false },
	{ name: 'Stealth', ability: 'dex', trainedOnly: false, armorCheckPenalty: true },
	{ name: 'Survival', ability: 'wis', trainedOnly: false, armorCheckPenalty: false },
	{ name: 'Swim', ability: 'str', trainedOnly: false, armorCheckPenalty: true },
	{ name: 'Use Magic Device', ability: 'cha', trainedOnly: true, armorCheckPenalty: false },
];