import { Container } from '@/modules/dashboard/components/Container';
import { SoldierEditPage } from '@/modules/soldier/pages/SoldierEditPage';

export default async function Page({ params }: { params: { id: string } }) {
	const { id } = params;

	return (
		<Container>
			<SoldierEditPage id={id} />
		</Container>
	);
}
