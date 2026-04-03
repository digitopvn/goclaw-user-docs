import LoadingSpinner from '@/components/ui/loader/LoadingSpinner';
import { Component } from 'solid-js';

interface IProps {
	size?: string | number;
}

const LoaderMain: Component<IProps> = (props) => {
	return <LoadingSpinner {...props} />;
};

export default LoaderMain;
