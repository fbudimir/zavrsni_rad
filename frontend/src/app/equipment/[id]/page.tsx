import { Container } from '@/modules/dashboard/components/Container';
import { EquipmentPage } from '@/modules/equipment/pages/EquipmentPage';

export default async function Page({ params }: { params: { id: string } }) {
	const { id } = params;
	// const order = await secureFetch(`/orders/${id}`, 'GET');

	return (
		<Container>
			{/* {order ? <OrderCard order={order.data} /> : <p>Order not found</p>} */}
			<EquipmentPage id={id} />
		</Container>
	);
}
