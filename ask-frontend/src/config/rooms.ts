import { Room } from '@/types/chat';

export const ROOMS: Room[] = [
  {
    id: 'kampus',
    name: 'Kampus',
    description: 'Pertanyaan seputar kampus dan akademik',
  },
  {
    id: 'umum',
    name: 'Umum',
    description: 'Pertanyaan umum dan general',
  },
  {
    id: 'internal',
    name: 'Internal',
    description: 'Informasi internal organisasi',
  },
  {
    id: 'dokumentasi',
    name: 'Dokumentasi',
    description: 'Dokumentasi teknis dan panduan',
  },
];

export const DEFAULT_ROOM = ROOMS[0];
