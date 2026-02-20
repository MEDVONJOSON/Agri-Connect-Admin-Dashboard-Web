import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../lib/auth';

// Mock Data Interfaces
export interface AdminStat {
    label: string;
    value: string;
    change: string;
    trend: 'up' | 'down' | 'neutral';
    icon: string;
    color: string;
}

export interface AdminState {
    // Data
    users: User[];
    pendingListings: number;
    totalOrders: number;
    totalRevenue: string;
    stats: AdminStat[];

    // Actions
    fetchStats: () => Promise<void>;
    verifyUser: (email: string, isVerified: boolean) => void;
    suspendUser: (email: string, isSuspended: boolean) => void;
    getPendingListingsCount: () => number;
}

export const useAdminStore = create<AdminState>()(
    persist(
        (set, get) => ({
            users: [
                {
                    name: 'Sahr Bangura',
                    email: 'sahr@farming.sl',
                    role: 'farmer',
                    location: 'Bo District',
                    phone: '+232 77 123 456',
                    digitalId: 'AC-882190',
                    rating: 4.8,
                    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200',
                    memberSince: '2023',
                    harvests: 42,
                    isSuspended: false,
                    farmDetails: {
                        name: 'Bo Highland Farms',
                        size: '12 Acres',
                        location: 'Bo District',
                        crops: ['Rice', 'Ginger', 'Cocoa'],
                    }
                },
                {
                    name: 'Fresh Foods Ltd',
                    email: 'buyer@freshfoods.sl',
                    role: 'buyer',
                    location: 'Freetown',
                    phone: '+232 88 555 999',
                    isVerifiedBuyer: true,
                    profileImage: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=200',
                    memberSince: '2022',
                    isSuspended: false,
                    businessName: 'Fresh Foods Ltd',
                    businessType: 'Retailer',
                    procurementStats: {
                        totalSourced: '125 Tons',
                        paymentRating: 4.9,
                        activeBids: 12,
                    }
                },
                {
                    name: 'Amara Kamara',
                    email: 'amara@cocoa.sl',
                    role: 'farmer',
                    location: 'Kenema',
                    digitalId: 'AC-112233',
                    rating: 4.2,
                    memberSince: '2023',
                    isSuspended: false,
                    farmDetails: {
                        name: 'Kenema Cocoa Estate',
                        size: '15 Acres',
                        location: 'Kenema District',
                        crops: ['Cocoa', 'Coffee', 'Rice'],
                    }
                },
                {
                    name: 'City Market',
                    email: 'market@city.sl',
                    role: 'buyer',
                    location: 'Makeni',
                    isVerifiedBuyer: false,
                    isSuspended: true,
                    memberSince: '2021',
                    businessName: 'City Market Hub',
                    businessType: 'Wholesaler',
                },
            ],
            pendingListings: 14,
            totalOrders: 128,
            totalRevenue: 'Le 45.2M',
            stats: [
                { label: 'Farmers Onboarded', value: '1,240', change: '+12%', trend: 'up', icon: 'Users', color: '#22C55E' },
                { label: 'Buyers Onboarded', value: '305', change: '+5%', trend: 'up', icon: 'ShoppingBag', color: '#3B82F6' },
                { label: 'Total Listings', value: '842', change: '+8%', trend: 'up', icon: 'Package', color: '#F59E0B' },
                { label: 'Orders Completed', value: '128', change: '+15%', trend: 'up', icon: 'CheckCircle2', color: '#10B981' },
                { label: 'Estimated Income', value: 'Le 4.5M', change: '+22%', trend: 'up', icon: 'TrendingUp', color: '#8B5CF6' },
            ],

            fetchStats: async () => {
                set((state) => ({
                    totalOrders: state.totalOrders + 1,
                }));
            },

            verifyUser: (email, isVerified) => {
                set((state) => ({
                    users: state.users.map((u) => u.email === email ? { ...u, isVerifiedBuyer: isVerified } : u)
                }));
            },

            suspendUser: (email, isSuspended) => {
                set((state) => ({
                    users: state.users.map((u) => u.email === email ? { ...u, isSuspended } : u)
                }));
            },

            getPendingListingsCount: () => get().pendingListings,
        }),
        {
            name: 'admin-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
