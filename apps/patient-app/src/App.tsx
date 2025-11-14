import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './lib/react-query'
import ScrollToTop from './components/common/ScrollToTop'
import './lib/i18n' // i18n 초기화

// Lazy load React Query Devtools only in development
const ReactQueryDevtoolsLazy = import.meta.env.DEV
  ? React.lazy(() =>
      import('@tanstack/react-query-devtools').then((d) => ({
        default: d.ReactQueryDevtools,
      }))
    )
  : () => null
import ProtectedRoute from './components/auth/ProtectedRoute'
import { AuthProvider } from './contexts/AuthContext'
import { ToastProvider } from './contexts/ToastContext'
import PhoneVerification from './pages/auth/PhoneVerification'
import ServiceRegistration from './pages/auth/ServiceRegistration'
import AppointmentList from './pages/appointments/list/AppointmentList'
import AppointmentNew from './pages/appointments/new/AppointmentNew'
import StandardAppointment from './pages/appointments/new/StandardAppointment'
import QuickAppointment from './pages/appointments/new/QuickAppointment'
import AppointmentDetailRouter from './pages/appointments/detail/AppointmentDetailRouter'
import AppointmentEdit from './pages/appointments/edit/AppointmentEdit'
import AppointmentEditComplete from './pages/appointments/edit/AppointmentEditComplete'
import Payment from './pages/appointments/payment/Payment'
import PaymentWithPrescription from './pages/appointments/payment/PaymentWithPrescription'
import PaymentComplete from './pages/appointments/payment/PaymentComplete'
import MedicationList from './pages/medications/list/MedicationList'
import MedicationDetail from './pages/medications/detail/MedicationDetail'
import DeliveryTracking from './pages/medications/delivery-tracking/DeliveryTracking'
import ConsultationRoom from './pages/consultation/ConsultationRoom'
import PhrDashboard from './pages/phr/PhrDashboard'
import PhrDetail from './pages/phr/PhrDetail'
import PhrAdd from './pages/phr/PhrAdd'
import MyPage from './pages/mypage/MyPage'
import ProfileEdit from './pages/mypage/ProfileEdit'
import DeliveryManagement from './pages/mypage/DeliveryManagement'
import AnnouncementList from './pages/mypage/AnnouncementList'
import AnnouncementDetail from './pages/mypage/AnnouncementDetail'
import TermsList from './pages/mypage/TermsList'
import TermsDetail from './pages/mypage/TermsDetail'
import FaqList from './pages/mypage/FaqList'
import Settings from './pages/mypage/Settings'
import ChatList from './pages/chat/ChatList'
import ChatRoom from './pages/chat/ChatRoom'
import Error403 from './pages/error/Error403'
import Error404 from './pages/error/Error404'
import Error500 from './pages/error/Error500'
import ErrorExpired from './pages/error/ErrorExpired'
import './App.css'

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <AuthProvider>
          <BrowserRouter>
            <ScrollToTop />
        <Routes>
        {/* Auth Routes - Public */}
        <Route path="/" element={<Navigate to="/auth/phone-verification" replace />} />
        <Route path="/auth/phone-verification" element={<PhoneVerification />} />

        {/* Service Registration - Requires tempJwt */}
        <Route path="/auth/service-registration" element={
          <ProtectedRoute>
            <ServiceRegistration />
          </ProtectedRoute>
        } />

        {/* Appointment Routes - Protected */}
        <Route path="/appointments" element={
          <ProtectedRoute><AppointmentList /></ProtectedRoute>
        } />
        <Route path="/appointments/new" element={
          <ProtectedRoute><AppointmentNew /></ProtectedRoute>
        } />
        <Route path="/appointments/new/standard" element={
          <ProtectedRoute><StandardAppointment /></ProtectedRoute>
        } />
        <Route path="/appointments/new/quick" element={
          <ProtectedRoute><QuickAppointment /></ProtectedRoute>
        } />
        <Route path="/appointments/:id" element={
          <ProtectedRoute><AppointmentDetailRouter /></ProtectedRoute>
        } />
        <Route path="/appointments/:id/edit" element={
          <ProtectedRoute><AppointmentEdit /></ProtectedRoute>
        } />
        <Route path="/appointments/edit/complete" element={
          <ProtectedRoute><AppointmentEditComplete /></ProtectedRoute>
        } />
        <Route path="/appointments/:id/payment" element={
          <ProtectedRoute><Payment /></ProtectedRoute>
        } />
        <Route path="/appointments/:id/payment-with-prescription" element={
          <ProtectedRoute><PaymentWithPrescription /></ProtectedRoute>
        } />
        <Route path="/appointments/payment/complete" element={
          <ProtectedRoute><PaymentComplete /></ProtectedRoute>
        } />

        {/* Medication Routes - Protected */}
        <Route path="/medications" element={
          <ProtectedRoute><MedicationList /></ProtectedRoute>
        } />
        <Route path="/medications/:id" element={
          <ProtectedRoute><MedicationDetail /></ProtectedRoute>
        } />
        <Route path="/medications/delivery-tracking" element={
          <ProtectedRoute><DeliveryTracking /></ProtectedRoute>
        } />

        {/* Consultation Routes - Protected */}
        <Route path="/consultation/room" element={
          <ProtectedRoute><ConsultationRoom /></ProtectedRoute>
        } />

        {/* PHR (Personal Health Record) Routes - Protected */}
        <Route path="/phr" element={
          <ProtectedRoute><PhrDashboard /></ProtectedRoute>
        } />
        <Route path="/phr/:type" element={
          <ProtectedRoute><PhrDetail /></ProtectedRoute>
        } />
        <Route path="/phr/:type/add" element={
          <ProtectedRoute><PhrAdd /></ProtectedRoute>
        } />

        {/* MyPage Routes - Protected */}
        <Route path="/mypage" element={
          <ProtectedRoute><MyPage /></ProtectedRoute>
        } />
        <Route path="/mypage/profile" element={
          <ProtectedRoute><ProfileEdit /></ProtectedRoute>
        } />
        <Route path="/mypage/delivery" element={
          <ProtectedRoute><DeliveryManagement /></ProtectedRoute>
        } />
        <Route path="/mypage/announcements" element={
          <ProtectedRoute><AnnouncementList /></ProtectedRoute>
        } />
        <Route path="/mypage/announcement/:id" element={
          <ProtectedRoute><AnnouncementDetail /></ProtectedRoute>
        } />
        <Route path="/mypage/terms" element={
          <ProtectedRoute><TermsList /></ProtectedRoute>
        } />
        <Route path="/mypage/terms/:id" element={
          <ProtectedRoute><TermsDetail /></ProtectedRoute>
        } />
        <Route path="/mypage/faq" element={
          <ProtectedRoute><FaqList /></ProtectedRoute>
        } />
        <Route path="/mypage/settings" element={
          <ProtectedRoute><Settings /></ProtectedRoute>
        } />

        {/* Chat Routes - Protected */}
        <Route path="/chat" element={
          <ProtectedRoute><ChatList /></ProtectedRoute>
        } />

        {/* Error Routes */}
        <Route path="/error/403" element={<Error403 />} />
        <Route path="/error/404" element={<Error404 />} />
        <Route path="/error/500" element={<Error500 />} />
        <Route path="/error/expired" element={<ErrorExpired />} />
        <Route path="*" element={<Error404 />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>

    {/* React Query Devtools - only in development */}
    {import.meta.env.DEV && (
      <React.Suspense fallback={null}>
        <ReactQueryDevtoolsLazy
          initialIsOpen={false}
          buttonPosition="bottom-right"
        />
      </React.Suspense>
    )}
    </ToastProvider>
  </QueryClientProvider>
  )
}

export default App
