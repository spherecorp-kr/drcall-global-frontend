/** @type {import('tailwindcss').Config} */
export default {
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {
			colors: {
				primary: {
					100: '#036381',
					90: '#047EA5',
					80: '#0491BD',
					70: '#00A0D2',
					60: '#33B3DB',
					50: '#4DBDE0',
					40: '#66C6E4',
					30: '#80D0E9',
					20: '#99D9ED',
					10: '#B3E3F2',
				},
				text: {
					100: '#1F1F1F',
					90: '#444444',
					80: '#595959',
					70: '#6E6E6E',
					60: '#828282',
					50: '#979797',
					40: '#ACACAC',
					30: '#C1C1C1',
					20: '#D5D5D5',
					10: '#EBEBEB',
					0: '#FFFFFF',
				},
				bg: {
					gray: '#FAFAFA',
					blue: '#EBFAFF',
					disabled: '#F6F6F6',
					white: '#FFFFFF',
				},
				stroke: {
					input: '#E6E6E6',
					segmented: '#D9D9D9',
				},
				system: {
					error: '#FC0606',
					successful: '#51CC56',
					successful2: '#11AC51',
					caution: '#FF5F06',
				},
				health: {
					hwb: '#30704F',
					temperature: '#FF5C00',
					sugar: '#FFB054',
					sugar2: '#FF518F',
					pressure: '#FF2E53',
					pressure2: '#5CB4FF',
				},
				badge: {
					1: '#FF4A55',
					2: '#FEEFE6',
					3: '#F0DBFF',
					'3-text': '#A737FF',
					4: '#B3E3F2',
					5: '#E6F6FB',
					6: '#FFE5E5',
					7: '#E1F9EB',
					8: '#EBEBEB',
				},
				gender: {
					woman: '#FF5977',
					man: '#3278FF',
				},
				tap: {
					1: '#3E3E3E',
				},
			},
			fontFamily: {
				pretendard: ['Pretendard', 'sans-serif'],
			},
			fontSize: {
				12: ['12px', { lineHeight: '1.5' }],
				13: ['13px', { lineHeight: '1.5' }],
				14: ['14px', { lineHeight: '1.5' }],
				16: ['16px', { lineHeight: '1.5' }],
				18: ['18px', { lineHeight: '1.5' }],
				20: ['20px', { lineHeight: '1.5' }],
				24: ['24px', { lineHeight: '1.4' }],
			},
			borderRadius: {
				DEFAULT: '8px',
				sm: '4px',
				md: '8px',
				lg: '12px',
			},
			boxShadow: {
				dialog: '4px 4px 10px 0 rgba(0, 0, 0, 0.25)',
			},
		},
	},
	plugins: [],
};
