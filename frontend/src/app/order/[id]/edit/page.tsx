import { Container } from '@/modules/dashboard/components/Container';
import { OrderEditPage } from '@/modules/order/pages/OrderEditPage';

export default async function Page({ params }: { params: { id: string } }) {
	const { id } = params;

	return (
		<Container>
			<OrderEditPage id={id} />
		</Container>
	);
}
