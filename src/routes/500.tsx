import { useSearchParams } from '@solidjs/router';
import { searchParamsToString } from '@/lib/utils';
import PageError from '@/components/ui/PageError';
import { ERROR_MESSAGE, ERROR_TITLE } from '@/config/searchParamKey';

export default function Page() {
	const [searchParams] = useSearchParams();
	const title = decodeURIComponent(searchParamsToString(searchParams?.[ERROR_TITLE])) || 'Something went wrong!';
	const message = decodeURIComponent(searchParamsToString(searchParams?.[ERROR_MESSAGE])) || 'Please Try Again';

	return <PageError title={title} message={message} />;
}
