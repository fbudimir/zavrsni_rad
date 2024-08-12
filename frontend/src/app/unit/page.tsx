import { Container } from '@/modules/dashboard/components/Container';
import { UnitsOverview } from '@/modules/unit/pages/UnitsOverview';

export default async function Page() {
	// const session = (await getServerSession(options)) as Session;

	// const response = await secureFetch('/orders', 'GET');

	// if (!session) {
	// 	redirect('/api/auth/signin?callbackUrl=/dashboard');
	// }

	return (
		<Container>
			{/* <Table tableData={response.data}></Table> */}
			<UnitsOverview />
		</Container>
	);
}
