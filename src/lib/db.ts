import Dexie, { type EntityTable } from 'dexie';

export interface CharacterEntity {
	id?: number;
	name: string;
	data: Record<string, unknown>;
	createdAt: Date;
	updatedAt: Date;
}

const db = new Dexie('CharacterSheetDB') as Dexie & {
	characters: EntityTable<CharacterEntity, 'id'>;
};

db.version(1).stores({
	characters: '++id, name, updatedAt'
});

export { db };