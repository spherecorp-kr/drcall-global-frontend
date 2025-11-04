interface Props {
	text: string;
}

const Single = ({ text }: Props) => {
	return <button className="font-semibold h-[4.375rem] rounded-b-[0.625rem] rounded-t-none text-white text-xl">{text}</button>;
};

export default Single;