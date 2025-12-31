import { Room } from '@/types/chat';

export const ROOMS: Room[] = [
  {
    id: 'kampus',
    name: 'Kampus',
    description: 'Kebijakan kampus dan dteti',
  },
  {
    id: 'umum',
    name: 'Umum',
    description: 'belum ada isi',
  },
  {
    id: 'internal',
    name: 'Internal',
    description: 'belum ada isi',
  },
  {
    id: 'dokumentasi',
    name: 'Dokumentasi',
    description: 'belum ada isi',
  },
];

export const DEFAULT_ROOM = ROOMS[0];
