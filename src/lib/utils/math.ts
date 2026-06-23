/**
 * Calculate the ability score modifier for a given score.
 * Formula: floor((score - 10) / 2)
 */
export function calcModifier(score: number): number {
	return Math.floor((score - 10) / 2);
}

/**
 * Format a modifier with a + or - sign.
 */
export function formatModifier(mod: number): string {
	if (mod >= 0) return `+${mod}`;
	return `${mod}`;
}

/**
 * Calculate Base Attack Bonus for a given class level and BAB progression.
 * Fast: level = BAB
 * Medium: floor(level * 0.75)
 * Slow: floor(level * 0.5)
 */
export type BABProgression = 'fast' | 'medium' | 'slow';

export function calcBAB(level: number, progression: BABProgression): number {
	switch (progression) {
		case 'fast': return level;
		case 'medium': return Math.floor(level * 0.75);
		case 'slow': return Math.floor(level * 0.5);
	}
}

/**
 * Calculate CMB = BAB + STR modifier + size modifier
 */
export function calcCMB(bab: number, strMod: number, sizeMod: number = 0): number {
	return bab + strMod + sizeMod;
}

/**
 * Calculate CMD = 10 + BAB + STR mod + DEX mod + size mod + misc mod
 */
export function calcCMD(
	bab: number,
	strMod: number,
	dexMod: number,
	sizeMod: number = 0,
	miscMod: number = 0
): number {
	return 10 + bab + strMod + dexMod + sizeMod + miscMod;
}

/**
 * Calculate saving throw base (Good: 2 + level/2, Poor: level/3)
 */
export function calcSave(level: number, isGood: boolean): number {
	if (isGood) return Math.floor(2 + level / 2);
	return Math.floor(level / 3);
}

/**
 * Calculate skill rank cap for a given level (level + 3 for PF1e)
 */
export function skillRankCap(level: number): number {
	return level + 3;
}

/**
 * Calculate skill points per level: class skill points + INT mod (min 1)
 */
export function calcSkillPointsPerLevel(classSkillPoints: number, intMod: number): number {
	return Math.max(1, classSkillPoints + intMod);
}

/**
 * Calculate total HP
 */
export function calcHP(
	hdSize: number,
	level: number,
	conMod: number,
	favoredClassBonus: number = 0,
	perLevelBonus: number = 0
): number {
	let total = hdSize + conMod + favoredClassBonus + perLevelBonus; // First level
	for (let i = 1; i < level; i++) {
		total += Math.floor(hdSize / 2) + 1 + conMod + perLevelBonus; // Average rounded up
	}
	return total;
}

/**
 * Calculate armor check penalty (always negative or 0)
 */
export function calcACP(armorCheckPenalty: number, hasArmorTraining: boolean = false): number {
	if (hasArmorTraining) return Math.min(0, armorCheckPenalty + 1);
	return Math.min(0, armorCheckPenalty);
}

/**
 * Calculate max DEX bonus to AC
 */
export function calcMaxDexBonus(maxDexBonus: number, dexMod: number): number {
	if (maxDexBonus < 0) return dexMod; // No armor
	return Math.min(dexMod, maxDexBonus);
}

/**
 * Calculate total AC
 */
export function calcTotalAC(
	baseAC: number,
	armorMod: number,
	shieldMod: number,
	dexMod: number,
	maxDexBonus: number,
	sizeMod: number,
	naturalMod: number,
	deflectionMod: number,
	miscMod: number
): number {
	return baseAC + armorMod + shieldMod + calcMaxDexBonus(maxDexBonus, dexMod) + sizeMod + naturalMod + deflectionMod + miscMod;
}