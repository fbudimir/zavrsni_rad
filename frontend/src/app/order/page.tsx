import { Container } from '@/modules/dashboard/components/Container';
import { OrdersOverviewPage } from '@/modules/order/pages/OrdersOverviewPage';

export default async function Page() {
	// const session = (await getServerSession(options)) as Session;

	// const response = await secureFetch('/orders', 'GET');

	// if (!session) {
	// 	redirect('/api/auth/signin?callbackUrl=/dashboard');
	// }

	return (
		<Container>
			{/* <Table tableData={response.data}></Table> */}
			<OrdersOverviewPage />
		</Container>
	);
}
