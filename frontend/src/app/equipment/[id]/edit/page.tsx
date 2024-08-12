import { Container } from '@/modules/dashboard/components/Container';
import { EquipmentEditPage } from '@/modules/equipment/pages/EquipmentEditPage';

export default async function Page({ params }: { params: { id: string } }) {
	const { id } = params;

	return (
		<Container>
			<EquipmentEditPage id={id} />
		</Container>
	);
}
