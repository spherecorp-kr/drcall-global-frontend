import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';
import { Select } from '@/shared/components/ui/Select';
import icSearch from '@/shared/assets/icons/ic_search.svg';
import icEdit from '@/shared/assets/icons/ic_edit.svg';
import icDelete from '@/shared/assets/icons/ic_delete.svg';
import icAdd from '@/shared/assets/icons/ic_register.svg';
import icDownload from '@/shared/assets/icons/ic_download.svg';
import { userService } from '@/services/userService';
import type { PatientDto, DoctorDto, AdminDto } from '@/services/userService';
import { toast } from 'react-hot-toast';

type UserType = 'patients' | 'doctors' | 'admins';
type UserDto = PatientDto | DoctorDto | AdminDto;

// Type guard functions
function isAdminDto(user: UserDto): user is AdminDto {
  return 'username' in user && 'role' in user;
}

function isPatientDto(user: UserDto): user is PatientDto {
  return 'phoneNumber' in user && !('specialty' in user) && !('username' in user);
}

function isDoctorDto(user: UserDto): user is DoctorDto {
  return 'specialty' in user && 'licenseNumber' in user;
}

export function UserList() {
  const navigate = useNavigate();
  const [userType, setUserType] = useState<UserType>('patients');
  const [users, setUsers] = useState<UserDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [searchTimeout, setSearchTimeout] = useState<number | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());

  // 사용자 목록 조회
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);

      const params = {
        page: currentPage,
        size: 20,
        search: searchTerm,
        status: statusFilter || undefined,
      };

      let response;
      switch (userType) {
        case 'patients':
          response = await userService.getPatients(params);
          break;
        case 'doctors':
          response = await userService.getDoctors(params);
          break;
        case 'admins':
          response = await userService.getAdmins(params);
          break;
      }

      setUsers(response.content);
      setTotalPages(response.totalPages);
      setTotalElements(response.totalElements);
    } catch (error) {
      console.error('사용자 목록 조회 실패:', error);
      toast.error('사용자 목록을 불러오는데 실패했습니다.');
      setUsers([]);
      setTotalPages(0);
      setTotalElements(0);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, statusFilter, userType]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // 사용자 타입 변경
  const handleUserTypeChange = (type: UserType) => {
    setUserType(type);
    setCurrentPage(0);
    setSearchTerm('');
    setStatusFilter('');
    setSelectedUsers(new Set());
  };

  // 검색 처리 (디바운스)
  const handleSearch = (value: string) => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    const newTimeout = setTimeout(() => {
      setSearchTerm(value);
      setCurrentPage(0);
    }, 500);

    setSearchTimeout(newTimeout);
  };

  // 새 사용자 등록
  const handleNewUser = () => {
    navigate(`/users/new?type=${userType}`);
  };

  // 사용자 편집
  const handleEditUser = (id: string) => {
    navigate(`/users/${id}?type=${userType}`);
  };

  // 사용자 삭제/비활성화
  const handleDeleteUser = async (user: UserDto) => {
    const userName = isAdminDto(user) ? user.username : user.name;
    const confirmMessage = userType === 'admins'
      ? `정말로 "${userName}" 관리자를 비활성화하시겠습니까?`
      : `정말로 "${userName}" 사용자를 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.`;

    if (confirm(confirmMessage)) {
      try {
        if (userType === 'admins') {
          await userService.deactivateAdmin(user.id.toString());
          toast.success('관리자가 비활성화되었습니다.');
        } else {
          // 환자/의사는 상태만 변경 (INACTIVE)
          if (userType === 'patients') {
            await userService.updatePatientStatus(user.id.toString(), 'INACTIVE');
          } else {
            await userService.updateDoctorStatus(user.id.toString(), 'INACTIVE');
          }
          toast.success('사용자가 비활성화되었습니다.');
        }
        await fetchUsers();
      } catch (error) {
        console.error('사용자 삭제 실패:', error);
        toast.error('사용자 삭제에 실패했습니다.');
      }
    }
  };

  // 체크박스 선택
  const handleSelectUser = (userId: string) => {
    const newSelected = new Set(selectedUsers);
    if (newSelected.has(userId)) {
      newSelected.delete(userId);
    } else {
      newSelected.add(userId);
    }
    setSelectedUsers(newSelected);
  };

  // 전체 선택
  const handleSelectAll = () => {
    if (selectedUsers.size === users.length) {
      setSelectedUsers(new Set());
    } else {
      setSelectedUsers(new Set(users.map(u => u.id.toString())));
    }
  };

  // 대량 상태 변경
  const handleBulkStatusChange = async (status: string) => {
    if (selectedUsers.size === 0) {
      toast.error('선택된 사용자가 없습니다.');
      return;
    }

    if (!confirm(`선택된 ${selectedUsers.size}명의 사용자 상태를 변경하시겠습니까?`)) {
      return;
    }

    try {
      const userIds = Array.from(selectedUsers);

      if (userType === 'patients') {
        await userService.bulkUpdatePatientStatus(userIds, status as 'ACTIVE' | 'INACTIVE' | 'SUSPENDED');
      } else if (userType === 'doctors') {
        await userService.bulkUpdateDoctorStatus(userIds, status as 'ACTIVE' | 'INACTIVE' | 'ON_LEAVE');
      }

      toast.success('상태가 변경되었습니다.');
      setSelectedUsers(new Set());
      await fetchUsers();
    } catch (error) {
      console.error('대량 상태 변경 실패:', error);
      toast.error('상태 변경에 실패했습니다.');
    }
  };

  // 데이터 내보내기
  const handleExport = async () => {
    try {
      const blob = await userService.exportUsers(userType, {
        search: searchTerm,
        status: statusFilter || undefined,
      });

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${userType}_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);

      toast.success('파일 다운로드가 시작되었습니다.');
    } catch (error) {
      console.error('데이터 내보내기 실패:', error);
      toast.error('데이터 내보내기에 실패했습니다.');
    }
  };

  // 상태별 배지 색상
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800';
      case 'INACTIVE': return 'bg-gray-100 text-gray-800';
      case 'SUSPENDED': return 'bg-red-100 text-red-800';
      case 'ON_LEAVE': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // 상태별 한글 표시
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'ACTIVE': return '활성';
      case 'INACTIVE': return '비활성';
      case 'SUSPENDED': return '정지';
      case 'ON_LEAVE': return '휴가';
      default: return status;
    }
  };

  // 역할별 한글 표시
  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN': return '최고 관리자';
      case 'ADMIN': return '관리자';
      case 'MANAGER': return '매니저';
      case 'VIEWER': return '뷰어';
      default: return role;
    }
  };

  return (
    <div className="h-full bg-bg-gray flex flex-col overflow-hidden">
      {/* 상단 탭 및 액션 영역 */}
      <div className="px-5 pt-4 pb-3 flex-shrink-0">
        {/* 사용자 타입 탭 */}
        <div className="flex gap-1 mb-4">
          <button
            onClick={() => handleUserTypeChange('patients')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              userType === 'patients'
                ? 'bg-blue-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            환자 관리
          </button>
          <button
            onClick={() => handleUserTypeChange('doctors')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              userType === 'doctors'
                ? 'bg-blue-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            의사 관리
          </button>
          <button
            onClick={() => handleUserTypeChange('admins')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              userType === 'admins'
                ? 'bg-blue-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            관리자 관리
          </button>
        </div>

        {/* 액션 버튼 및 검색 */}
        <div className="flex justify-between items-center gap-2.5">
          <div className="flex gap-2.5">
            <Button
              variant="primary"
              size="default"
              icon={<img src={icAdd} alt="새 사용자" className="w-5 h-5" />}
              onClick={handleNewUser}
            >
              {userType === 'patients' ? '새 환자' : userType === 'doctors' ? '새 의사' : '새 관리자'} 등록
            </Button>

            {selectedUsers.size > 0 && userType !== 'admins' && (
              <Select
                value=""
                onChange={(e) => handleBulkStatusChange(e.target.value)}
                className="w-40"
              >
                <option value="" disabled>대량 작업</option>
                <option value="ACTIVE">활성화</option>
                <option value="INACTIVE">비활성화</option>
                {userType === 'patients' && <option value="SUSPENDED">정지</option>}
                {userType === 'doctors' && <option value="ON_LEAVE">휴가</option>}
              </Select>
            )}

            <Button
              variant="outline"
              size="default"
              icon={<img src={icDownload} alt="내보내기" className="w-5 h-5" />}
              onClick={handleExport}
            >
              CSV 내보내기
            </Button>
          </div>

          <div className="flex gap-2.5">
            {/* 상태 필터 */}
            <Select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(0);
              }}
              className="w-32"
            >
              <option value="">전체 상태</option>
              <option value="ACTIVE">활성</option>
              <option value="INACTIVE">비활성</option>
              {userType === 'patients' && <option value="SUSPENDED">정지</option>}
              {userType === 'doctors' && <option value="ON_LEAVE">휴가</option>}
            </Select>

            {/* 검색 */}
            <div className="relative w-80">
              <Input
                type="text"
                placeholder={
                  userType === 'patients' ? "환자명, 전화번호로 검색..." :
                  userType === 'doctors' ? "의사명, 전문분야로 검색..." :
                  "관리자명, 사용자명으로 검색..."
                }
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
        </div>
      </div>

      {/* 사용자 목록 테이블 */}
      <div className="flex-1 overflow-auto">
        <div className="min-h-full bg-white">
          {loading ? (
            <div className="flex justify-center items-center h-96">
              <div className="text-gray-500">로딩 중...</div>
            </div>
          ) : users.length === 0 ? (
            <div className="flex justify-center items-center h-96">
              <div className="text-gray-500">등록된 사용자가 없습니다.</div>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-4 py-3 text-center w-12">
                    <input
                      type="checkbox"
                      checked={selectedUsers.size === users.length && users.length > 0}
                      onChange={handleSelectAll}
                      className="w-4 h-4"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">번호</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                    {userType === 'admins' ? '사용자명' : '이름'}
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                    {userType === 'patients' ? '전화번호' : '이메일'}
                  </th>
                  {userType === 'doctors' && (
                    <>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">병원</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">전문분야</th>
                    </>
                  )}
                  {userType === 'admins' && (
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">역할</th>
                  )}
                  {userType === 'patients' && (
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">예약 수</th>
                  )}
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">상태</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">등록일</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900">관리</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.map((user, index) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-center">
                      <input
                        type="checkbox"
                        checked={selectedUsers.has(user.id.toString())}
                        onChange={() => handleSelectUser(user.id.toString())}
                        className="w-4 h-4"
                      />
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {currentPage * 20 + index + 1}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                      {isAdminDto(user) ? user.username : user.name}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {userType === 'patients'
                        ? (user as PatientDto).phoneNumber
                        : user.email
                      }
                    </td>
                    {userType === 'doctors' && (
                      <>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {(user as DoctorDto).hospitalName || '-'}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {(user as DoctorDto).specialty}
                        </td>
                      </>
                    )}
                    {userType === 'admins' && (
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {getRoleLabel((user as AdminDto).role)}
                      </td>
                    )}
                    {userType === 'patients' && (
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {(user as PatientDto).totalAppointments || 0}
                      </td>
                    )}
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeClass(user.status)}`}>
                        {getStatusLabel(user.status)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {new Date(user.createdAt).toLocaleDateString('ko-KR')}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleEditUser(user.id.toString())}
                          className="p-1.5 hover:bg-gray-100 rounded"
                          title="수정"
                        >
                          <img src={icEdit} alt="수정" className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user)}
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
            총 {totalElements}명 {selectedUsers.size > 0 && `(${selectedUsers.size}명 선택)`}
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
          <div className="w-32"></div>
        </div>
      )}
    </div>
  );
}

export default UserList;