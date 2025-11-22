import { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
// import { dashboardService } from '@/services/dashboardService';
import type {
  DashboardStats,
  AppointmentTrend,
  RevenueTrend,
  RecentActivity,
  TopHospital,
  // TopDoctor
} from '@/services/dashboardService';
import { toast } from 'react-hot-toast';

// 차트 색상
const COLORS = {
  primary: '#00a0d2',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  info: '#3b82f6',
  purple: '#8b5cf6',
};

// Mock 데이터 (API 연동 전까지 사용)
const mockStats: DashboardStats = {
  totalHospitals: 24,
  activeHospitals: 22,
  totalPatients: 3456,
  activePatients: 2890,
  totalDoctors: 189,
  activeDoctors: 178,
  totalAppointments: 12450,
  todayAppointments: 234,
  completedAppointments: 10234,
  cancelledAppointments: 1023,
  totalRevenue: 45678900,
  todayRevenue: 234500,
  currency: 'THB',
};

const mockAppointmentTrends: AppointmentTrend[] = Array.from({ length: 30 }, (_, i) => ({
  date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  count: Math.floor(Math.random() * 50) + 200,
  completed: Math.floor(Math.random() * 40) + 180,
  cancelled: Math.floor(Math.random() * 10) + 5,
}));

const mockRevenueTrends: RevenueTrend[] = Array.from({ length: 30 }, (_, i) => ({
  date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  amount: Math.floor(Math.random() * 500000) + 1000000,
  currency: 'THB',
}));

const mockRecentActivities: RecentActivity[] = [
  {
    id: '1',
    type: 'HOSPITAL_REGISTERED',
    title: '새 병원 등록',
    description: 'Bangkok Medical Center가 등록되었습니다.',
    timestamp: new Date().toISOString(),
    metadata: { hospitalName: 'Bangkok Medical Center' },
  },
  {
    id: '2',
    type: 'PATIENT_REGISTERED',
    title: '새 환자 등록',
    description: '김철수님이 가입했습니다.',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    metadata: { patientName: '김철수' },
  },
  {
    id: '3',
    type: 'APPOINTMENT_CREATED',
    title: '예약 생성',
    description: '박영희님이 Dr. Smith와 예약을 잡았습니다.',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    metadata: { patientName: '박영희', doctorName: 'Dr. Smith' },
  },
  {
    id: '4',
    type: 'PAYMENT_COMPLETED',
    title: '결제 완료',
    description: '이민호님이 2,500 THB를 결제했습니다.',
    timestamp: new Date(Date.now() - 10800000).toISOString(),
    metadata: { patientName: '이민호', amount: 2500 },
  },
  {
    id: '5',
    type: 'DOCTOR_JOINED',
    title: '새 의사 합류',
    description: 'Dr. Johnson이 Bumrungrad Hospital에 합류했습니다.',
    timestamp: new Date(Date.now() - 14400000).toISOString(),
    metadata: { doctorName: 'Dr. Johnson', hospitalName: 'Bumrungrad Hospital' },
  },
];

const mockTopHospitals: TopHospital[] = [
  { id: 1, name: 'Bangkok Medical Center', appointmentCount: 2456, revenue: 12345600, patientCount: 890 },
  { id: 2, name: 'Bumrungrad Hospital', appointmentCount: 2234, revenue: 10234500, patientCount: 780 },
  { id: 3, name: 'Samitivej Hospital', appointmentCount: 1890, revenue: 8900000, patientCount: 650 },
  { id: 4, name: 'BNH Hospital', appointmentCount: 1567, revenue: 7234000, patientCount: 540 },
  { id: 5, name: 'Phyathai Hospital', appointmentCount: 1234, revenue: 5678000, patientCount: 420 },
];

// Mock data for top doctors (currently unused, but kept for future use)
// const mockTopDoctors: TopDoctor[] = [
//   { id: 1, name: 'Dr. Smith', hospitalName: 'Bangkok Medical Center', specialty: '내과', appointmentCount: 234, rating: 4.9 },
//   { id: 2, name: 'Dr. Johnson', hospitalName: 'Bumrungrad Hospital', specialty: '외과', appointmentCount: 212, rating: 4.8 },
//   { id: 3, name: 'Dr. Lee', hospitalName: 'Samitivej Hospital', specialty: '소아과', appointmentCount: 189, rating: 4.9 },
//   { id: 4, name: 'Dr. Kim', hospitalName: 'BNH Hospital', specialty: '피부과', appointmentCount: 167, rating: 4.7 },
//   { id: 5, name: 'Dr. Park', hospitalName: 'Phyathai Hospital', specialty: '정형외과', appointmentCount: 145, rating: 4.8 },
// ];

// 통계 카드 컴포넌트
interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  change?: number;
  icon?: React.ReactNode;
  color?: string;
}

function StatCard({ title, value, subtitle, change, color = 'text-gray-600' }: StatCardProps) {
  const isPositive = change && change > 0;

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <div className="flex items-start justify-between">
        <div>
          <p className={`text-sm font-medium ${color}`}>{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
        {change !== undefined && (
          <div className={`flex items-center gap-1 px-2 py-1 rounded ${
            isPositive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
          }`}>
            <span className="text-sm font-medium">
              {isPositive ? '+' : ''}{change}%
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats] = useState<DashboardStats>(mockStats);
  const [appointmentTrends] = useState<AppointmentTrend[]>(mockAppointmentTrends);
  const [revenueTrends] = useState<RevenueTrend[]>(mockRevenueTrends);
  const [recentActivities] = useState<RecentActivity[]>(mockRecentActivities);
  const [topHospitals] = useState<TopHospital[]>(mockTopHospitals);
  // const [topDoctors] = useState<TopDoctor[]>(mockTopDoctors);

  // 데이터 로드
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);

        // API 호출 (현재는 Mock 데이터 사용)
        // const [statsData, appointmentData, revenueData, activitiesData, hospitalsData, doctorsData] = await Promise.all([
        //   dashboardService.getStats(),
        //   dashboardService.getAppointmentTrends(30),
        //   dashboardService.getRevenueTrends(30),
        //   dashboardService.getRecentActivities(5),
        //   dashboardService.getTopHospitals(5),
        //   dashboardService.getTopDoctors(5),
        // ]);

        // setStats(statsData);
        // setAppointmentTrends(appointmentData);
        // setRevenueTrends(revenueData);
        // setRecentActivities(activitiesData);
        // setTopHospitals(hospitalsData);
        // setTopDoctors(doctorsData);

        // Mock 데이터로 설정
        setTimeout(() => {
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error('대시보드 데이터 로드 실패:', error);
        toast.error('대시보드 데이터를 불러오는데 실패했습니다.');
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  // 숫자 포맷팅
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('ko-KR').format(num);
  };

  // 통화 포맷팅
  const formatCurrency = (amount: number, currency: string) => {
    return `${formatNumber(amount)} ${currency}`;
  };

  // 시간 포맷팅
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}분 전`;
    if (hours < 24) return `${hours}시간 전`;
    return `${days}일 전`;
  };

  // 활동 타입별 색상
  const getActivityColor = (type: RecentActivity['type']) => {
    switch (type) {
      case 'HOSPITAL_REGISTERED': return 'text-blue-600 bg-blue-50';
      case 'PATIENT_REGISTERED': return 'text-green-600 bg-green-50';
      case 'APPOINTMENT_CREATED': return 'text-purple-600 bg-purple-50';
      case 'PAYMENT_COMPLETED': return 'text-yellow-600 bg-yellow-50';
      case 'DOCTOR_JOINED': return 'text-indigo-600 bg-indigo-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-gray-500">로딩 중...</div>
      </div>
    );
  }

  // 예약 상태별 데이터 (파이 차트용)
  const appointmentStatusData = [
    { name: '완료', value: stats.completedAppointments, color: COLORS.success },
    { name: '진행 중', value: stats.todayAppointments, color: COLORS.primary },
    { name: '취소', value: stats.cancelledAppointments, color: COLORS.danger },
  ];

  return (
    <div className="h-full bg-gray-50 overflow-auto">
      <div className="p-6">
        {/* 헤더 */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">대시보드</h1>
          <p className="text-gray-600 mt-1">시스템 전체 현황을 한눈에 확인하세요</p>
        </div>

        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard
            title="전체 병원"
            value={formatNumber(stats.totalHospitals)}
            subtitle={`활성: ${stats.activeHospitals}개`}
            change={8}
            color="text-blue-600"
          />
          <StatCard
            title="전체 환자"
            value={formatNumber(stats.totalPatients)}
            subtitle={`활성: ${formatNumber(stats.activePatients)}명`}
            change={12}
            color="text-green-600"
          />
          <StatCard
            title="오늘 예약"
            value={formatNumber(stats.todayAppointments)}
            subtitle={`전체: ${formatNumber(stats.totalAppointments)}건`}
            change={-5}
            color="text-purple-600"
          />
          <StatCard
            title="오늘 매출"
            value={formatCurrency(stats.todayRevenue, stats.currency)}
            subtitle={`전체: ${formatCurrency(stats.totalRevenue, stats.currency)}`}
            change={15}
            color="text-yellow-600"
          />
        </div>

        {/* 차트 영역 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* 예약 추이 차트 */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold mb-4">예약 추이 (최근 30일)</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={appointmentTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => new Date(value).getDate() + '일'}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  labelFormatter={(value) => new Date(value as string).toLocaleDateString('ko-KR')}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="count"
                  name="전체"
                  stroke={COLORS.primary}
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="completed"
                  name="완료"
                  stroke={COLORS.success}
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="cancelled"
                  name="취소"
                  stroke={COLORS.danger}
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* 매출 추이 차트 */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold mb-4">매출 추이 (최근 30일)</h2>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={revenueTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => new Date(value).getDate() + '일'}
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
                />
                <Tooltip
                  labelFormatter={(value) => new Date(value as string).toLocaleDateString('ko-KR')}
                  formatter={(value: number) => formatCurrency(value, 'THB')}
                />
                <Area
                  type="monotone"
                  dataKey="amount"
                  name="매출"
                  stroke={COLORS.info}
                  fill={COLORS.info}
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 하단 섹션 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 예약 상태 파이 차트 */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold mb-4">예약 상태 분포</h2>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={appointmentStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name}: ${formatNumber(entry.value)}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {appointmentStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => formatNumber(value)} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* 상위 병원 */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold mb-4">상위 병원</h2>
            <div className="space-y-3">
              {topHospitals.map((hospital, index) => (
                <div key={hospital.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-gray-500">#{index + 1}</span>
                    <div>
                      <p className="text-sm font-medium">{hospital.name}</p>
                      <p className="text-xs text-gray-500">예약 {formatNumber(hospital.appointmentCount)}건</p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-green-600">
                    {formatCurrency(hospital.revenue, 'THB')}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 최근 활동 */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold mb-4">최근 활동</h2>
            <div className="space-y-3">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex gap-3">
                  <div className={`w-2 h-2 mt-2 rounded-full flex-shrink-0 ${getActivityColor(activity.type).split(' ')[0].replace('text', 'bg')}`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.title}</p>
                    <p className="text-xs text-gray-500">{activity.description}</p>
                    <p className="text-xs text-gray-400 mt-1">{formatTime(activity.timestamp)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;