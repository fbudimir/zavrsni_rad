import { soldierSchema } from '@/modules/soldier/types/Soldier';
import { z } from 'zod';

export const unitStatusSchema = z.enum([
	'ACTIVE',
	'INACTIVE',
	'DECOMMISSIONED',
]);
export type UnitStatusType = z.infer<typeof unitStatusSchema>;

export const unitTypeSchema = z.enum([
	'TEAM',
	'SQUAD',
	'PLATOON',
	'COMPANY',
	'BATTALION',
	'TASK_FORCE',
]);
export type UnitTypeType = z.infer<typeof unitTypeSchema>;

export const unitSchema = z.object({
	id: z.string(),
	name: z.string(),
	type: unitTypeSchema,
	class: z.number(),
	parentUnitId: z.string().nullable(),
	// parentUnit: z.lazy(() => unitSchema.optional().nullable()),
	// subUnits: z.array(z.any()),
	// soldiers: z.array(z.any()),
	// orders: z.array(z.any()),
	status: unitStatusSchema,
	// equipment: z.array(z.any()),
	leaderId: z.string().nullable().optional(),
	leader: soldierSchema.nullable().optional(),
	nPosition: z.number().nullable(),
	ePosition: z.number().nullable(),
});

export type UnitType = z.infer<typeof unitSchema>;

export const unitListSchema = z.array(unitSchema);
export type UnitListType = z.infer<typeof unitListSchema>;
