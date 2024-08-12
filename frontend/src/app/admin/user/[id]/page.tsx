import { UserPage } from '@/modules/admin/pages/UserPage';
import { Container } from '@/modules/dashboard/components/Container';

export default async function Page({ params }: { params: { id: string } }) {
	const { id } = params;
	// const order = await secureFetch(`/orders/${id}`, 'GET');

	return (
		<Container>
			{/* {order ? <OrderCard order={order.data} /> : <p>Order not found</p>} */}
			<UserPage id={id} />
		</Container>
	);
}
