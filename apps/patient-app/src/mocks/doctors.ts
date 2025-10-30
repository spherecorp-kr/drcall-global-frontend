import type { Doctor } from '@components/doctor/cards/DoctorCard';

export const mockDoctors: Doctor[] = [
  {
    id: '1',
    name: 'นพ.จิรายุ ฉิมวิไลทรัพย์',
    nameEn: '(Dr.Jirayu Chimvilaisup)',
    profileImage: 'https://placehold.co/48x48',
    description:
      'Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsu\nmLorem Ipsum Lorem Ipsum Lorem Ipsum',
    specialty: ['แพทย์เวชปฏิบัติทั่วไป', 'แพทย์ปรึกษาระยะทางไกล'],
    education: ['2020 คณะแพทยศาสตร์มหาวิทยาลัยศรีนครินทรวิโรฒ'],
    timeSlots: [
      { time: '13:01~13:15', available: true },
      { time: '13:16~13:30', available: false },
      { time: '13:31~13:45', available: true }
    ]
  },
  {
    id: '2',
    name: 'รศ.พญ.รวีรัตน์ สิชฌรังษี',
    nameEn: '(Prof.Dr.Raweerat Sitcharungsi)',
    profileImage: 'https://placehold.co/48x48',
    description:
      'Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsu\nmLorem Ipsum Lorem Ipsum Lorem Ipsum',
    specialty: ['กุมารเวชศาสตร์โรคภูมิแพ้และภูมิคุ้มกัน'],
    education: [
      '2011 มารเวชศาสตร์โรคภูมิแพ้และภูมิคุ้มกัน, รพ.รามาธิบดี มหาวิทยาลัยมหิดล',
      '2008 กุมารเวชศาสตร์, รพ.รามาธิบดีมหาวิทยาลัยมหิดล',
      '2001 แพทยศาสตร์, จุฬาลงกรณ์มหาวิทยาลัย (เกียรตินิยมอันดับ 2)'
    ],
    timeSlots: [
      { time: '13:01~13:15', available: true },
      { time: '13:16~13:30', available: false },
      { time: '13:31~13:45', available: true }
    ]
  },
  {
    id: '3',
    name: 'นพ.วิทยา วันเพ็ญ',
    nameEn: '(Dr.Wittaya Wanpen)',
    profileImage: 'https://placehold.co/48x48',
    description:
      'Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsu\nmLorem Ipsum Lorem Ipsum Lorem Ipsum',
    specialty: ['ผู้เชี่ยวชาญจิตเวชศาสตร์'],
    education: [
      '2002 จิตเวชศาสตร์จุฬาลงกรณ์มหาวิทยาลัย',
      '1999 แพทยศาสตร์บัณฑิตจุฬาลงกรณ์มหาวิทยาลัย'
    ],
    timeSlots: [
      { time: '13:01~13:15', available: true },
      { time: '13:16~13:30', available: false },
      { time: '13:31~13:45', available: true }
    ]
  }
];

// Empty doctors list for testing empty state
export const mockEmptyDoctors: Doctor[] = [];
