import { Container } from '@/modules/dashboard/components/Container';
import { UnitEditPage } from '@/modules/unit/pages/UnitEditPage';

export default async function Page({ params }: { params: { id: string } }) {
	const { id } = params;

	return (
		<Container>
			<UnitEditPage id={id} />
		</Container>
	);
}
