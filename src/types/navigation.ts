// 📍 src/types/navigation.ts
export interface MenuItem {
  href: string;
  label: string;
  icon: string;
  badge?: number;
  roles?: string[]; // Qué roles pueden ver este item
}

export interface User {
  id: string;
  nombre: string;
  email: string;
  rol: 'recepcion' | 'admin' | 'limpieza';
  avatar?: string;
}