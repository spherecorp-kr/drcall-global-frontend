import { useCallback, useMemo, useState } from 'react';
import { MAX_DELIVERY_ADDRESSES } from './constants';
import type { DeliveryAddress } from './types';

/** 
 * 배송지 관리 커스텀 훅
 * - 배송지 추가/수정/삭제 기능
 * - 배송지 선택 기능
 * - 배송지 최대 개수 제한 기능
 * - 배송지 선택 모달 오픈/클로즈 기능
 * - 배송지 선택 모달 오픈/클로즈 기능
 */

/**
 * 라벨 타입
 * - 배송지 추가 버튼 라벨
 * - 배송지 삭제 확인 라벨
 * - 배송지 최대 개수 제한 라벨
 * - 배송지 선택 모달 오픈/클로즈 라벨
 */
type Labels = {
  addButtonKey: string;
  deleteConfirmKey: string;
  maxLimitKey: string;
  confirmKey?: string;
};

/**
 * 옵션 타입
 * - 배송지 선택 여부
 * - 배송지 최대 개수
 * - 라벨
 * - 초기 선택된 배송지 ID
 */
type UseDeliveryAddressesOptions = {
  selectionEnabled: boolean;
  maxAddresses?: number;
  labels: Labels;
  initialSelectedId?: string | null;
};

/**
 * UI 상태 타입
 * - 배송지 추가 모달 오픈 여부
 * - 배송지 삭제 확인 모달 오픈 여부
 * - 배송지 최대 개수 제한 모달 오픈 여부
 * - 배송지 수정 모드 여부
 */
type UiState = {
  isAddOpen: boolean;
  isDeleteConfirmOpen: boolean;
  isMaxLimitOpen: boolean;
  editingAddress: DeliveryAddress | null;
};

/**
 * 액션 타입
 * - 배송지 선택 기능
 * - 배송지 추가 모달 오픈 기능
 * - 배송지 추가 모달 클로즈 기능
 * - 배송지 최대 개수 제한 모달 클로즈 기능
 * - 배송지 수정 기능
 */
type Actions = {
  select: (id: string) => void;
  addOpen: () => void;
  addClose: () => void;
  maxLimitClose: () => void;
  save: (data: {
    id?: string;
    title: string;
    recipientName: string;
    address: string;
    detailAddress: string;
    phoneNumber: string;
    isDefault: boolean;
  }) => void;
  edit: (id: string) => void;
  deleteAsk: (id: string) => void;
  deleteConfirm: () => void;
  deleteCancel: () => void;
};

/**
 * 배송지 관리 커스텀 훅
 * @param options 옵션
 * @returns 배송지 관리 커스텀 훅
 */
export function useDeliveryAddresses(options: UseDeliveryAddressesOptions) {
  const { selectionEnabled, maxAddresses = MAX_DELIVERY_ADDRESSES, initialSelectedId = null } = options;

  // NOTE: 실제 API 연동 시 서버 데이터로 대체
  const [addresses] = useState<DeliveryAddress[]>([
    {
      id: '1',
      isDefault: true,
      title: '회사 근처에서 약 배송 받으려고 등록해둔 강남역 인근 오피스텔 주소',
      recipientName: '김환자',
      address: '1902, Building 103, Raemian Apartment, 162 Baumoe-ro, Seocho-gu, Seoul, Republic of Korea',
      phoneNumber: '062-1234-1234'
    },
    {
      id: '2',
      isDefault: false,
      title: '서울 본가 집',
      recipientName: '김환자',
      address: '1902, Building 103, Raemian Apartment, 162 Baumoe-ro, Seocho-gu, Seoul, Republic of Korea',
      phoneNumber: '062-1234-1234'
    },
    {
      id: '3',
      isDefault: false,
      title: '부산 친구 집',
      recipientName: '이친구',
      address: '789, Haeundae-ro, Haeundae-gu, Busan, Republic of Korea',
      phoneNumber: '051-2222-3333'
    },
    {
      id: '4',
      isDefault: false,
      title: '대전 부모님 댁',
      recipientName: '김부모',
      address: '321, Dunsan-ro, Seo-gu, Daejeon, Republic of Korea',
      phoneNumber: '042-5555-6666'
    },
    {
      id: '5',
      isDefault: false,
      title: '제주도 별장',
      recipientName: '박제주',
      address: '555, Jeju-daero, Jeju-si, Jeju-do, Republic of Korea',
      phoneNumber: '064-7777-8888'
    }
  ]);

  const [selectedId, setSelectedId] = useState<string | null>(selectionEnabled ? initialSelectedId ?? '1' : null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<DeliveryAddress | null>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [isMaxLimitOpen, setIsMaxLimitOpen] = useState(false);

  // 배송지 선택 기능
  const select = useCallback((id: string) => {
    if (!selectionEnabled) return;
    setSelectedId(id);
  }, [selectionEnabled]);

  // 배송지 추가 모달 오픈 기능
  const addOpen = useCallback(() => {
    if (addresses.length >= maxAddresses) {
      setIsMaxLimitOpen(true);
      return;
    }
    setIsAddOpen(true);
  }, [addresses.length, maxAddresses]);

  // 배송지 추가 모달 클로즈 기능
  const addClose = useCallback(() => {
    setIsAddOpen(false);
    setEditingAddress(null);
  }, []);

  // 배송지 최대 개수 제한 모달 클로즈 기능
  const maxLimitClose = useCallback(() => {
    setIsMaxLimitOpen(false);
  }, []);

  // 배송지 저장 기능
  const save: Actions['save'] = useCallback((data) => {
    // TODO: API 연동 (추가/수정) 및 전역 상태 또는 SWR/Query 무효화
    // 현재는 UI 플로우만 관리
    // id 유무에 따라 추가/수정 분기
    if (data.id) {
      // 수정 모드
      // console.log('Update address:', data);
    } else {
      // 추가 모드
      // console.log('Save new address:', data);
    }
    setIsAddOpen(false);
    setEditingAddress(null);
  }, []);

  // 배송지 수정 기능
  const edit = useCallback((id: string) => {
    const found = addresses.find(a => a.id === id) || null;
    if (found) {
      setEditingAddress(found);
      setIsAddOpen(true);
    }
  }, [addresses]);

  // 배송지 삭제 확인 모달 오픈 기능
  const deleteAsk = useCallback((id: string) => {
    setDeleteTargetId(id);
    setIsDeleteConfirmOpen(true);
  }, []);

  // 배송지 삭제 확인 모달 확인 기능
  const deleteConfirm = useCallback(() => {
    if (!deleteTargetId) return;
    // TODO: API 연동 (삭제) 및 전역 상태 또는 SWR/Query 무효화
    setIsDeleteConfirmOpen(false);
    setDeleteTargetId(null);
  }, [deleteTargetId]);

  // 배송지 삭제 확인 모달 취소 기능
  const deleteCancel = useCallback(() => {
    setIsDeleteConfirmOpen(false);
    setDeleteTargetId(null);
  }, []);

  // UI 상태 메모이제이션
  const ui: UiState = useMemo(() => ({
    isAddOpen,
    isDeleteConfirmOpen,
    isMaxLimitOpen,
    editingAddress
  }), [isAddOpen, isDeleteConfirmOpen, isMaxLimitOpen, editingAddress]);

  const actions: Actions = useMemo(() => ({
    select,
    addOpen,
    addClose,
    maxLimitClose,
    save,
    edit,
    deleteAsk,
    deleteConfirm,
    deleteCancel
  }), [select, addOpen, addClose, maxLimitClose, save, edit, deleteAsk, deleteConfirm, deleteCancel]);

  return {
    addresses,
    selectedId,
    ui,
    actions
  } as const;
}