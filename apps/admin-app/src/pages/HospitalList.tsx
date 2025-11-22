import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';
import icSearch from '@/shared/assets/icons/ic_search.svg';
import icEdit from '@/shared/assets/icons/ic_edit.svg';
import icDelete from '@/shared/assets/icons/ic_delete.svg';
import icAdd from '@/shared/assets/icons/ic_register.svg';
import { hospitalService } from '@/services/hospitalService';
import type { HospitalDto } from '@/shared/types/hospital';
import { toast } from 'react-hot-toast';

export function HospitalList() {
	const navigate = useNavigate();
	const [hospitals, setHospitals] = useState<HospitalDto[]>([]);
	const [loading, setLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState('');
	const [currentPage, setCurrentPage] = useState(0); // API는 0부터 시작
	const [totalPages, setTotalPages] = useState(0);
	const [totalElements, setTotalElements] = useState(0);
	const [searchTimeout, setSearchTimeout] = useState<number | null>(null);

	// 병원 목록 조회
	const fetchHospitals = useCallback(async () => {
		try {
			setLoading(true);
			const response = await hospitalService.getHospitals({
				page: currentPage,
				size: 20,
				search: searchTerm
			});

			setHospitals(response.content);
			setTotalPages(response.totalPages);
			setTotalElements(response.totalElements);
		} catch (error) {
			console.error('병원 목록 조회 실패:', error);
			toast.error('병원 목록을 불러오는데 실패했습니다.');

			// 오류 시 빈 데이터로 설정
			setHospitals([]);
			setTotalPages(0);
			setTotalElements(0);
		} finally {
			setLoading(false);
		}
	}, [currentPage, searchTerm]);

	useEffect(() => {
		fetchHospitals();
	}, [fetchHospitals]);

	// 검색 처리 (디바운스)
	const handleSearch = (value: string) => {
		// 이전 타임아웃 취소
		if (searchTimeout) {
			clearTimeout(searchTimeout);
		}

		// 새 타임아웃 설정 (500ms 디바운스)
		const newTimeout = setTimeout(() => {
			setSearchTerm(value);
			setCurrentPage(0); // 검색 시 첫 페이지로
		}, 500);

		setSearchTimeout(newTimeout);
	};

	const handleNewHospital = () => {
		navigate('/hospitals/onboarding');
	};

	const handleEditHospital = (id: string) => {
		navigate(`/hospitals/${id}`);
	};

	const handleDeleteHospital = async (id: string, name: string) => {
		if (confirm(`정말로 "${name}" 병원을 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.`)) {
			try {
				await hospitalService.deleteHospital(id);
				toast.success('병원이 삭제되었습니다.');
				await fetchHospitals();
			} catch (error) {
				console.error('병원 삭제 실패:', error);
				toast.error('병원 삭제에 실패했습니다.');
			}
		}
	};

	return (
		<div className="h-full bg-bg-gray flex flex-col overflow-hidden">
			{/* 상단 액션 영역 */}
			<div className="px-5 pt-4 pb-3 flex justify-between items-center gap-2.5 flex-shrink-0">
				<div className="flex gap-2.5">
					<Button
						variant="primary"
						size="default"
						icon={<img src={icAdd} alt="새 병원 등록" className="w-5 h-5" />}
						onClick={handleNewHospital}
					>
						새 병원 등록
					</Button>
				</div>
				<div className="relative w-80">
					<Input
						type="text"
						placeholder="병원명으로 검색..."
						value={searchTerm}
						onChange={(e) => handleSearch(e.target.value)}
						className="pl-10"
					/>
					<img
						src={icSearch}
						alt="검색"
						className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
					/>
				</div>
			</div>

			{/* 병원 목록 테이블 */}
			<div className="flex-1 overflow-auto">
				<div className="min-h-full bg-white">
					{loading ? (
						<div className="flex justify-center items-center h-96">
							<div className="text-gray-500">로딩 중...</div>
						</div>
					) : hospitals.length === 0 ? (
						<div className="flex justify-center items-center h-96">
							<div className="text-gray-500">등록된 병원이 없습니다.</div>
						</div>
					) : (
						<table className="w-full">
							<thead className="bg-gray-50 sticky top-0">
								<tr>
									<th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">번호</th>
									<th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">병원명 (영문)</th>
									<th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">병원명 (현지)</th>
									<th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">이메일</th>
									<th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">전화번호</th>
									<th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">주소</th>
									<th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">등록일</th>
									<th className="px-4 py-3 text-center text-sm font-semibold text-gray-900">관리</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-200">
								{hospitals.map((hospital, index) => (
									<tr key={hospital.id} className="hover:bg-gray-50">
										<td className="px-4 py-3 text-sm text-gray-900">
											{currentPage * 20 + index + 1}
										</td>
										<td className="px-4 py-3 text-sm text-gray-900 font-medium">
											{hospital.nameEn}
										</td>
										<td className="px-4 py-3 text-sm text-gray-600">
											{hospital.nameLocal}
										</td>
										<td className="px-4 py-3 text-sm text-gray-600">
											{hospital.email}
										</td>
										<td className="px-4 py-3 text-sm text-gray-600">
											{hospital.phone}
										</td>
										<td className="px-4 py-3 text-sm text-gray-600">
											<div className="max-w-xs truncate" title={hospital.address}>
												{hospital.address}
											</div>
										</td>
										<td className="px-4 py-3 text-sm text-gray-600">
											{new Date(hospital.createdAt).toLocaleDateString('ko-KR')}
										</td>
										<td className="px-4 py-3 text-center">
											<div className="flex justify-center gap-2">
												<button
													onClick={() => handleEditHospital(hospital.id)}
													className="p-1.5 hover:bg-gray-100 rounded"
													title="수정"
												>
													<img src={icEdit} alt="수정" className="w-5 h-5" />
												</button>
												<button
													onClick={() => handleDeleteHospital(hospital.id, hospital.nameEn)}
													className="p-1.5 hover:bg-red-50 rounded"
													title="삭제"
												>
													<img src={icDelete} alt="삭제" className="w-5 h-5" />
												</button>
											</div>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					)}
				</div>
			</div>

			{/* 페이지네이션 */}
			{totalPages > 1 && (
				<div className="px-5 py-3 bg-white border-t flex justify-between items-center">
					<div className="text-sm text-gray-600">
						총 {totalElements}개 병원
					</div>
					<div className="flex justify-center items-center gap-2">
						<button
							onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
							disabled={currentPage === 0}
							className="px-3 py-1 rounded border hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
						>
							이전
						</button>
						<span className="px-3 py-1">
							{currentPage + 1} / {totalPages}
						</span>
						<button
							onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
							disabled={currentPage === totalPages - 1}
							className="px-3 py-1 rounded border hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
						>
							다음
						</button>
					</div>
					<div className="w-20"></div> {/* 레이아웃 밸런스 */}
				</div>
			)}
		</div>
	);
}

export default HospitalList;