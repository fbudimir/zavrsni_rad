import { UserEditPage } from '@/modules/admin/pages/UserEditPage';
import { Container } from '@/modules/dashboard/components/Container';

export default async function Page({ params }: { params: { id: string } }) {
	const { id } = params;

	return (
		<Container>
			<UserEditPage id={id} />
		</Container>
	);
}
