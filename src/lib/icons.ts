/**
 * One consistent line icon set (Lucide, drawn at 1.5px), keyed by what the icon stands for.
 * Keys are unique across the page so one lookup serves every section.
 */
import Briefcase from '@lucide/astro/icons/briefcase';
import Archive from '@lucide/astro/icons/archive';
import Bell from '@lucide/astro/icons/bell';
import CalendarCheck from '@lucide/astro/icons/calendar-check';
import ChartColumn from '@lucide/astro/icons/chart-column';
import CheckCheck from '@lucide/astro/icons/check-check';
import Download from '@lucide/astro/icons/download';
import EyeOff from '@lucide/astro/icons/eye-off';
import FileClock from '@lucide/astro/icons/file-clock';
import FolderKanban from '@lucide/astro/icons/folder-kanban';
import HardDrive from '@lucide/astro/icons/hard-drive';
import LayoutDashboard from '@lucide/astro/icons/layout-dashboard';
import Link2 from '@lucide/astro/icons/link-2';
import ListChecks from '@lucide/astro/icons/list-checks';
import LockKeyhole from '@lucide/astro/icons/lock-keyhole';
import ReceiptText from '@lucide/astro/icons/receipt-text';
import ShieldCheck from '@lucide/astro/icons/shield-check';
import Smartphone from '@lucide/astro/icons/smartphone';
import SlidersHorizontal from '@lucide/astro/icons/sliders-horizontal';
import SunMoon from '@lucide/astro/icons/sun-moon';
import TimerReset from '@lucide/astro/icons/timer-reset';
import TreePalm from '@lucide/astro/icons/tree-palm';
import Undo2 from '@lucide/astro/icons/undo-2';
import UserPlus from '@lucide/astro/icons/user-plus';
import Users from '@lucide/astro/icons/users';
import Wallet from '@lucide/astro/icons/wallet';
import Crown from '@lucide/astro/icons/crown';
import Shield from '@lucide/astro/icons/shield';
import User from '@lucide/astro/icons/user';

export const icons = {
  // Live features
  attendance: CalendarCheck,
  leave: TreePalm,
  'comp-leave': TimerReset,
  'expense-claims': ReceiptText,
  'month-summary': ChartColumn,
  clients: Briefcase,
  people: Users,
  settings: SlidersHorizontal,
  // Coming features
  tasks: ListChecks,
  approvals: ShieldCheck,
  notifications: Bell,
  dashboards: LayoutDashboard,
  projects: FolderKanban,
  revenue: Wallet,
  // Feels like an app
  'app-install': Download,
  'app-back': Undo2,
  'app-themes': SunMoon,
  'app-phones': Smartphone,
  // Roles
  owner: Crown,
  admin: Shield,
  staff: User,
  // Trust
  'trust-invite': Link2,
  'trust-history': Archive,
  'trust-recorded': FileClock,
  'trust-database': LockKeyhole,
  'trust-backups': HardDrive,
  'trust-clients': EyeOff,
  // How it starts
  'how-invite': UserPlus,
  'how-start': Smartphone,
  'how-decide': CheckCheck,
} as const;

export type IconKey = keyof typeof icons;
