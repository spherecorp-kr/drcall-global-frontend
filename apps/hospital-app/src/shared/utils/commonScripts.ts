// 월, 일, 시간, 분 등 1자리 값이 나올 수 있는 것을 2자리로 변환. 1자리일 때 앞에 0 붙임
export const doubleDigit = (val: number): string => String(val).padStart(2, '0');

// 날짜를 dd/MM/yyyy 형식으로 포맷
export const formatDDMMYYYY = (date: Date): string => {
	return (
		doubleDigit(date.getDate()) +
		'/' +
		doubleDigit(date.getMonth() + 1) +
		'/' +
		date.getFullYear()
	);
};

export const formatDDMMYYYYHHMMSS = (date: Date): string => {
	return `${formatDDMMYYYY(date)} ${doubleDigit(date.getHours())}:${doubleDigit(date.getMinutes())}:${doubleDigit(date.getSeconds())}`;
};

// yyyy-MM-dd 형식의 날짜를 dd/mm 형식으로 포맷
export const formatDDMM = (dateString: string) => {
	const date = new Date(dateString);
	return doubleDigit(date.getDate()) + '/' + doubleDigit(date.getMonth() + 1);
};