interface Props {
	isVisible: boolean;
	text: string;
}

const NoData = ({ isVisible, text }: Props) => {
	return (
		<p className={isVisible ? 'bg-disabled py-5 rounded-[0.625rem] text-40 text-body4 text-center' : 'hidden'}>{text}</p>
	);
};

export default NoData;