import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '../services/authService';
import type { UserInfo } from '../services/authService';

interface AuthContextType {
	user: UserInfo | null;
	isAuthenticated: boolean;
	isLoading: boolean;
	login: (accessToken: string, user: UserInfo) => void;
	logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<UserInfo | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	// 앱 시작 시 토큰 확인 및 사용자 정보 로드
	useEffect(() => {
		const initAuth = async () => {
			const accessToken = localStorage.getItem('accessToken');
			const storedUser = localStorage.getItem('user');

			if (!accessToken) {
				setIsLoading(false);
				return;
			}

			try {
				// 저장된 사용자 정보가 있으면 먼저 사용 (빠른 초기 렌더링)
				if (storedUser) {
					setUser(JSON.parse(storedUser));
				}

				// 서버에서 최신 사용자 정보 가져오기 (토큰 검증)
				const currentUser = await authService.getCurrentUser();
				setUser(currentUser);
				localStorage.setItem('user', JSON.stringify(currentUser));
			} catch (error) {
				// 토큰이 만료되었거나 유효하지 않으면 로그아웃
				console.error('Failed to get current user:', error);
				localStorage.removeItem('accessToken');
				localStorage.removeItem('user');
				setUser(null);
			} finally {
				setIsLoading(false);
			}
		};

		initAuth();
	}, []);

	const login = (accessToken: string, user: UserInfo) => {
		localStorage.setItem('accessToken', accessToken);
		localStorage.setItem('user', JSON.stringify(user));
		setUser(user);
	};

	const logout = async () => {
		try {
			await authService.logout();
		} catch (error) {
			console.error('Logout failed:', error);
		} finally {
			localStorage.removeItem('accessToken');
			localStorage.removeItem('user');
			setUser(null);
		}
	};

	return (
		<AuthContext.Provider
			value={{
				user,
				isAuthenticated: !!user,
				isLoading,
				login,
				logout,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error('useAuth must be used within AuthProvider');
	}
	return context;
}
