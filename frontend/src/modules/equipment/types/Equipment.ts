import { z } from 'zod';

export const equipmentTypeSchema = z.enum(['VEHICLE', 'WEAPON', 'OTHER']);
export type EquipmentTypeType = z.infer<typeof equipmentTypeSchema>;

export const equipmentStatusSchema = z.enum([
	'ACTIVE',
	'UNDER_MAINTENANCE',
	'DECOMMISSIONED',
]);

export const equipmentSchema = z.object({
	id: z.string(),
	name: z.string(),
	type: equipmentTypeSchema,
	description: z.string().optional().nullable(),
	status: equipmentStatusSchema,
	assignedToId: z.string().optional().nullable(),
});
export type EquipmentType = z.infer<typeof equipmentSchema>;

export const equipmentListSchema = z.array(equipmentSchema);
export type EquipmentListType = z.infer<typeof equipmentListSchema>;
