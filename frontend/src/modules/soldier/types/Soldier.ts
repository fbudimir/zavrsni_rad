import { z } from 'zod';

export const soldierRankSchema = z.enum([
	'PVT',
	'PFC',
	'CPL',
	'SGT',
	'SSGT',
	'SFC',
	'MSGT',
	'FSG',
	'SGM',
	'SLT',
	'FLT',
	'CPT',
	'MAJ',
	'LTC',
	'COL',
	'BG',
	'MG',
	'LTG',
	'GEN',
]);
export type SoldierRankType = z.infer<typeof soldierRankSchema>;

export const soldierStatusSchema = z.enum([
	'ACTIVE',
	'WIA',
	'KIA',
	'MIA',
	'RETIRED',
	'AWOL',
]);
export type SoldierStatusType = z.infer<typeof soldierStatusSchema>;

export const soldierSchema = z.object({
	id: z.string(),
	name: z.string(),
	rank: soldierRankSchema,
	class: z.number(),
	status: soldierStatusSchema,
	unitId: z.string().nullable(),
	leadsUnit: z.object({ id: z.string() }).nullable().optional(),
});

export type SoldierType = z.infer<typeof soldierSchema>;

export const soldierListSchema = z.array(soldierSchema);
export type SoldierListType = z.infer<typeof soldierListSchema>;
