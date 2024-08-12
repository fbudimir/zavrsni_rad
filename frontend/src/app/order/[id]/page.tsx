import MapWithDraw from '@/components/MapWithDraw';
import { Container } from '@/modules/dashboard/components/Container';
import { OrderPage } from '@/modules/order/pages/OrderPage';

export default async function Page({ params }: { params: { id: string } }) {
	const { id } = params;
	// const order = await secureFetch(`/orders/${id}`, 'GET');

	return (
		<>
			<Container>
				{/* {order ? <OrderCard order={order.data} /> : <p>Order not found</p>} */}
				<OrderPage id={id} />
			</Container>
			<MapWithDraw />
		</>
	);
}
