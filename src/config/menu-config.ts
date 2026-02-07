/**
 * Menu Configuration - Role-based Navigation
 * Định nghĩa danh sách menu theo quyền hạn người dùng
 * 
 * titleKey & descKey: Khóa dịch (i18n keys) - không hardcode text
 */

import { 
  LayoutDashboard, 
  Map, 
  FileText, 
  MessageSquare, 
  Database, 
  BookOpen,
  MapPin,
  LucideIcon 
} from 'lucide-react';

export enum UserRole {
  FARMER = 'FARMER',
  GOVERNMENT = 'GOVERNMENT',
}

export interface MenuItem {
  titleKey: string; // i18n key for title
  descKey: string;  // i18n key for description
  path: string;
  icon: LucideIcon;
  roles: 'ALL' | UserRole[];
  badge?: string;
}

export const MENU_ITEMS: MenuItem[] = [
  // === CẢ HAI (ALL) ===
  {
    titleKey: 'sidebar:dashboard',
    descKey: 'sidebar:inbox_desc', // Change this later
    path: '/dashboard',
    icon: LayoutDashboard,
    roles: 'ALL',
  },
  {
    titleKey: 'sidebar:inbox',
    descKey: 'sidebar:inbox_desc',
    path: '/dashboard/inbox',
    icon: MessageSquare,
    roles: 'ALL',
  },

  // === CHỈ NÔNG DÂN (FARMER) ===
  {
    titleKey: 'sidebar:map',
    descKey: 'sidebar:map_desc',
    path: '/dashboard/map',
    icon: Map,
    roles: [UserRole.FARMER],
  },
  {
    titleKey: 'sidebar:observations',
    descKey: 'sidebar:observations_desc',
    path: '/dashboard/observations',
    icon: MapPin,
    roles: [UserRole.FARMER],
  },
  {
    titleKey: 'sidebar:knowledge',
    descKey: 'sidebar:knowledge_desc',
    path: '/dashboard/knowledge',
    icon: BookOpen,
    roles: [UserRole.FARMER],
  },

  // === CHỈ CHÍNH PHỦ (GOVERNMENT) ===
  {
    titleKey: 'sidebar:input_data',
    descKey: 'sidebar:input_data_desc',
    path: '/gov/input',
    icon: Database,
    roles: [UserRole.GOVERNMENT],
  },
  {
    titleKey: 'sidebar:manage_messages',
    descKey: 'sidebar:manage_messages_desc',
    path: '/gov/inbox',
    icon: FileText,
    roles: [UserRole.GOVERNMENT],
  },
];

/**
 * Hàm lọc menu dựa trên role người dùng
 */
export const getMenuForRole = (userRole: UserRole | null): MenuItem[] => {
  if (!userRole) return [];
  
  return MENU_ITEMS.filter(item => {
    if (item.roles === 'ALL') return true;
    return item.roles.includes(userRole);
  });
};
