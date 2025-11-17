import { User } from '@/types'

export const mockUsers: User[] = [
  {
    id: 1,
    name: 'Nguyễn Văn Admin',
    email: 'admin@factory.com',
    username: 'admin',
    role: 'admin',
    department: 'Quản lý',
    permissions: {
      inventory: { view: true, manage: true, admin: true },
      manufacturing: { view: true, manage: true, admin: true },
    },
  },
  {
    id: 2,
    name: 'Trần Thị Quản lý',
    email: 'manager@factory.com',
    username: 'manager',
    role: 'manager',
    department: 'Sản xuất',
    permissions: {
      inventory: { view: true, manage: true, admin: false },
      manufacturing: { view: true, manage: true, admin: false },
    },
  },
  {
    id: 3,
    name: 'Lê Văn Công nhân',
    email: 'worker@factory.com',
    username: 'worker',
    role: 'worker',
    department: 'Sản xuất',
    permissions: {
      inventory: { view: true, manage: false, admin: false },
      manufacturing: { view: true, manage: false, admin: false },
    },
  },
]
