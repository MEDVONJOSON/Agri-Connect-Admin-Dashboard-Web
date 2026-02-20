import React, { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import { View, ActivityIndicator } from 'react-native';
import Colors from '../../constants/Colors';

export default function AdminLayout() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const segments = useSegments() as string[];

    useEffect(() => {
        if (!loading) {
            const inAdminGroup = segments[0] === 'admin';
            const atLogin = segments.length > 1 && segments[1] === 'login'; // Check if we are at app/admin/login
            const adminRoles = ['admin', 'super_admin', 'data_admin', 'agri_expert', 'support_admin'];

            // If user is NOT an admin
            if (!user || !adminRoles.includes(user.role)) {
                // And we are NOT already at the login screen
                if (inAdminGroup && !atLogin) {
                    // Redirect to Admin Login
                    router.replace('/admin/login');
                }
            } else {
                // User IS an admin
                // If they are at login, send them to dashboard
                if (atLogin) {
                    router.replace('/admin');
                }
            }
        }
    }, [user, loading, segments]);

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background }}>
                <ActivityIndicator size="large" color={Colors.primary} />
            </View>
        );
    }

    return (
        <Stack screenOptions={{
            headerShown: false,
            animation: 'slide_from_right'
        }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="login" />
            <Stack.Screen name="users" />
            <Stack.Screen name="models" />
            <Stack.Screen name="orders" />
            <Stack.Screen name="listings" />
            <Stack.Screen name="requests" />
            <Stack.Screen name="data" />
            <Stack.Screen name="subscriptions" />
            <Stack.Screen name="profile" />
        </Stack>
    );
}
