import React from 'react';
import {
  LayoutDashboard,
  ShoppingBag,
  MessageCircle,
  User as LucideUser,
  Sprout,
  ShieldAlert,
  CloudSun,
  Users,
  Camera,
  Image as ImageIcon,
  Send,
  Heart,
  MessageSquare,
  Share2,
  ChevronRight,
  Plus,
  Search,
  MapPin,
  Thermometer,
  Droplets,
  Info,
  Wind,
  Navigation,
  CheckCircle2,
  AlertCircle,
  Mail,
  Lock,
  ShieldCheck,
  Phone,
  ChevronLeft,
  Settings,
  CreditCard,
  Bell,
  LogOut,
  Edit2,
  TrendingUp,
  Package,
  FileText,
  Clock,
  Tag,
  HelpCircle,
  Filter,
  Calendar,
  Star,
  Mic,
  Activity,
  Trash2,
  Check,
  Map,
  TrendingDown,
  DollarSign,
  Bug,
  Skull,
  AlertTriangle,
  Truck,
  UserCog,
  Briefcase,
  Landmark,
  PieChart,
  FileCheck,
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  Upload,
  QrCode,
  Zap,
  BarChart3,
  Leaf,
  FlaskConical,
  RefreshCw,
  BadgeCheck,
  FlaskRound,
  Cpu,
  Layers,
  Database,
  History,
  X,
  XCircle,
  MoreVertical,
  ShoppingCart,
  ArrowRight,
  Minus,
  Download,
  LucideProps
} from 'lucide-react-native';

interface IconProps {
  size?: number | string;
  color?: string;
  style?: any;
  strokeWidth?: number;
}

// Re-export everything we need
export {
  LayoutDashboard,
  ShoppingBag,
  ShoppingCart,
  MessageCircle,
  LucideUser as UserIcon,
  Sprout,
  ShieldAlert,
  CloudSun,
  Users,
  Camera,
  ImageIcon,
  Send,
  Heart,
  MessageSquare,
  Share2,
  ChevronRight,
  Plus,
  Search,
  MapPin,
  Thermometer,
  Droplets,
  Info,
  Wind,
  Navigation,
  CheckCircle2,
  AlertCircle,
  Mail,
  Lock,
  ShieldCheck,
  Phone,
  ChevronLeft,
  Settings,
  CreditCard,
  Bell,
  LogOut,
  Edit2,
  TrendingUp,
  Package,
  FileText,
  Clock,
  Tag,
  HelpCircle,
  Filter,
  Calendar,
  Star,
  Mic,
  Activity,
  Trash2,
  Check,
  Map,
  TrendingDown,
  DollarSign,
  Bug,
  Skull,
  AlertTriangle,
  Truck,
  UserCog,
  Briefcase,
  Landmark,
  PieChart,
  FileCheck,
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  Upload,
  QrCode,
  Zap,
  BarChart3,
  Leaf,
  FlaskConical,
  RefreshCw,
  BadgeCheck,
  FlaskRound,
  Cpu,
  Layers,
  Database,
  History,
  X,
  XCircle,
  MoreVertical,
  ArrowRight,
  Minus,
  Download
};

// Wrapper components for common usage with default colors
export const DashboardIcon = ({ size = 24, color = '#1EB53A', ...props }: IconProps) => (
  <LayoutDashboard {...props} size={size as any} color={color} />
);

export const MarketplaceIcon = ({ size = 24, color = '#1EB53A', ...props }: IconProps) => (
  <ShoppingBag {...props} size={size as any} color={color} />
);

export const ChatIcon = ({ size = 24, color = '#1EB53A', ...props }: IconProps) => (
  <MessageCircle {...props} size={size as any} color={color} />
);

export const ProfileIcon = ({ size = 24, color = '#1EB53A', ...props }: IconProps) => (
  <LucideUser {...props} size={size as any} color={color} />
);

export const AIIcon = ({ size = 24, color = '#1EB53A', ...props }: IconProps) => (
  <Zap {...props} size={size as any} color={color} />
);

export const CropIcon = ({ size = 24, color = '#1EB53A', ...props }: IconProps) => (
  <Sprout {...props} size={size as any} color={color} />
);

export const DiseaseIcon = ({ size = 24, color = '#1EB53A', ...props }: IconProps) => (
  <ShieldAlert {...props} size={size as any} color={color} />
);

export const WeatherIcon = ({ size = 24, color = '#1EB53A', ...props }: IconProps) => (
  <CloudSun {...props} size={size as any} color={color} />
);

export const CommunityIcon = ({ size = 24, color = '#1EB53A', ...props }: IconProps) => (
  <Users {...props} size={size as any} color={color} />
);

export const InvestmentIcon = ({ size = 24, color = '#1EB53A', ...props }: IconProps) => (
  <TrendingUp {...props} size={size as any} color={color} />
);

export const LockIcon = ({ size = 24, color = '#1EB53A', ...props }: IconProps) => (
  <Lock {...props} size={size as any} color={color} />
);

export const CartIcon = ({ size = 24, color = '#1EB53A', ...props }: IconProps) => (
  <ShoppingCart {...props} size={size as any} color={color} />
);

// Safety wrapper for List:
// This defines 'List' as a Functional Component that returns FileText.
// It avoids 'export { FileText as List }' which can cause HMR issues.
export const List = (props: IconProps) => {
  return <FileText {...props} />;
};
