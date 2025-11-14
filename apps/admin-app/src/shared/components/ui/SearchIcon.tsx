import React from 'react';
import btnSearch from '@/shared/assets/icons/btn_search.svg';

interface Props {
	className?: string;
}

const SearchIcon: React.FC<Props> = ({ className }) => {
	return <img alt="Search" className={className} src={btnSearch} />;
};

export default SearchIcon;
