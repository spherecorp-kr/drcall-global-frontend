import { useTranslation } from 'react-i18next';
import { AlertCircle } from 'lucide-react';

export default function NoChannel() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-bg-base flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
        {/* 아이콘 */}
        <div className="mx-auto w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mb-6">
          <AlertCircle className="w-10 h-10 text-red-600" />
        </div>

        {/* 제목 */}
        <h1 className="text-2xl font-bold text-gray-900 mb-3">
          병원 채널을 선택해주세요
        </h1>

        {/* 설명 */}
        <p className="text-gray-600 mb-6">
          DrCall 서비스를 이용하시려면 병원별 전용 채널로 접속해야 합니다.
        </p>

        {/* 접속 방법 안내 */}
        <div className="bg-gray-50 rounded-xl p-6 mb-6 text-left">
          <h2 className="font-semibold text-gray-900 mb-3">접속 방법</h2>
          <div className="space-y-3 text-sm text-gray-700">
            <div className="flex gap-2">
              <span className="font-medium text-primary-70">1.</span>
              <span>병원에서 제공한 접속 링크를 사용하세요</span>
            </div>
            <div className="flex gap-2">
              <span className="font-medium text-primary-70">2.</span>
              <span>형식: <code className="bg-gray-200 px-2 py-1 rounded text-xs">병원코드.patient.drcall.global</code></span>
            </div>
          </div>
        </div>

        {/* 예시 */}
        <div className="bg-blue-50 rounded-xl p-6 mb-6 text-left">
          <h2 className="font-semibold text-gray-900 mb-3">접속 예시</h2>
          <div className="space-y-2 text-sm">
            <div className="font-mono text-xs bg-white p-2 rounded border border-blue-200">
              samsung.patient.drcall.global
            </div>
            <div className="font-mono text-xs bg-white p-2 rounded border border-blue-200">
              line.patient.drcall.global
            </div>
          </div>
        </div>

        {/* 개발 환경 안내 (개발 시에만 표시) */}
        {import.meta.env.DEV && (
          <div className="bg-yellow-50 rounded-xl p-6 text-left border border-yellow-200">
            <h2 className="font-semibold text-gray-900 mb-3">
              <span className="text-yellow-600">[개발 환경]</span> 로컬 테스트
            </h2>
            <div className="space-y-2 text-sm text-gray-700">
              <p>로컬에서 테스트하려면 subdomain을 추가하세요:</p>
              <div className="font-mono text-xs bg-white p-2 rounded border border-yellow-300">
                test.localhost:5174
              </div>
              <div className="font-mono text-xs bg-white p-2 rounded border border-yellow-300">
                samsung.localhost:5174
              </div>
              <p className="text-xs text-gray-500 mt-2">
                * hosts 파일 수정 필요: 127.0.0.1 test.localhost
              </p>
            </div>
          </div>
        )}

        {/* 문의 */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            접속 링크를 모르신다면 병원에 문의해주세요
          </p>
        </div>
      </div>
    </div>
  );
}