import React, { useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    RefreshControl,
    Image,
    Dimensions
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '../../constants/Colors';
import { useAdminStore } from '../../hooks/useAdminStore';
import { useAuth } from '../../contexts/AuthContext';
import {
    Users,
    ShoppingBag,
    Package,
    TrendingUp,
    ChevronRight,
    ShieldAlert,
    Clock,
    FileText,
    CheckCircle2,
    Plus,
    BarChart3
} from '../../components/icons';
import { Card } from '../../components/ui/Card';
import { AnimatedButton } from '../../components/ui/AnimatedButton';

const { width } = Dimensions.get('window');

export default function AdminDashboard() {
    const router = useRouter();
    const { user } = useAuth();
    const { stats, fetchStats, pendingListings, totalOrders } = useAdminStore();
    const [refreshing, setRefreshing] = React.useState(false);

    useEffect(() => {
        fetchStats();
    }, []);

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchStats();
        setRefreshing(false);
    };

    return (
        <View style={styles.container}>
            <ScrollView
                style={styles.content}
                contentContainerStyle={styles.scrollContent}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            >
                {/* Header Section */}
                <View style={styles.header}>
                    <View style={styles.headerTop}>
                        <View>
                            <Text style={styles.welcomeText}>Welcome back,,</Text>
                            <Text style={styles.adminName}>{user?.name || 'Admin'}</Text>
                        </View>
                        <View style={styles.avatarCircle}>
                            <Text style={styles.avatarInitial}>A</Text>
                        </View>
                    </View>
                    <View style={styles.roleTagRow}>
                        <View style={styles.roleBadge}>
                            <Text style={styles.roleBadgeText}>ADMIN ACCOUNT</Text>
                        </View>
                        <Text style={styles.kriText}>KRI</Text>
                    </View>
                </View>

                {/* Main Action Banner */}
                <View style={styles.bannerSection}>
                    <Text style={styles.sectionLabel}>READY TO GOVERN?</Text>
                    <TouchableOpacity
                        style={styles.mainBanner}
                        onPress={() => router.push('/admin/users')}
                    >
                        <LinearGradient
                            colors={['#10B981', '#059669']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.bannerGradient}
                        >
                            <View style={styles.bannerContent}>
                                <View style={styles.plusCircle}>
                                    <Users size={32} color="#10B981" />
                                </View>
                                <View style={styles.bannerText}>
                                    <Text style={styles.bannerTitle}>Review Users</Text>
                                    <Text style={styles.bannerDesc}>Manage verification & access</Text>
                                </View>
                                <ChevronRight size={24} color="#fff" />
                            </View>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>

                {/* My Management Section */}
                <View style={styles.managementSection}>
                    <Text style={styles.sectionTitle}>System Governance</Text>

                    <TouchableOpacity style={styles.mgmtCard} onPress={() => router.push('/admin/orders')}>
                        <View style={styles.mgmtIconBox}>
                            <FileText size={24} color="#64748B" />
                        </View>
                        <View style={styles.mgmtText}>
                            <Text style={styles.mgmtTitle}>Market Orders</Text>
                            <Text style={styles.mgmtDesc}>View global transaction requests</Text>
                        </View>
                        <View style={styles.newBadge}>
                            <Text style={styles.newBadgeText}>{totalOrders} New</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.mgmtCard} onPress={() => router.push('/admin/listings')}>
                        <View style={styles.mgmtIconBox}>
                            <ShoppingBag size={24} color="#64748B" />
                        </View>
                        <View style={styles.mgmtText}>
                            <Text style={styles.mgmtTitle}>Active Listings</Text>
                            <Text style={styles.mgmtDesc}>Monitor marketplace produce</Text>
                        </View>
                        <ChevronRight size={20} color="#CBD5E1" />
                    </TouchableOpacity>
                </View>

                {/* Key Metrics Grid */}
                <View style={styles.metricsGrid}>
                    <View style={styles.metricBox}>
                        <Text style={styles.metricVal}>Le 4.2M</Text>
                        <Text style={styles.metricLabel}>Total Volume</Text>
                    </View>
                    <View style={styles.metricBox}>
                        <Text style={styles.metricVal}>1,240</Text>
                        <Text style={styles.metricLabel}>Users</Text>
                    </View>
                    <View style={styles.metricBox}>
                        <Text style={styles.metricVal}>4.8</Text>
                        <Text style={styles.metricLabel}>System Score</Text>
                    </View>
                </View>

                {/* Recent Alerts */}
                <View style={styles.alertSection}>
                    <Text style={styles.sectionTitle}>Security Alerts</Text>
                    <Card style={styles.alertCard}>
                        <View style={styles.alertRow}>
                            <ShieldAlert size={18} color="#EF4444" />
                            <Text style={styles.alertText}>Suspicious login attempt blocked</Text>
                        </View>
                        <View style={styles.alertRow}>
                            <CheckCircle2 size={18} color="#10B981" />
                            <Text style={styles.alertText}>System backup completed successfully</Text>
                        </View>
                    </Card>
                </View>

            </ScrollView>

            {/* Admin Bottom Nav simulation or real if needed */}
            <View style={styles.bottomNav}>
                <TouchableOpacity style={styles.navItem} onPress={() => router.push('/admin')}>
                    <BarChart3 size={24} color={Colors.primary} />
                    <Text style={[styles.navText, { color: Colors.primary }]}>Home</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem} onPress={() => router.push('/admin/listings')}>
                    <ShoppingBag size={24} color="#94A3B8" />
                    <Text style={styles.navText}>Market</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem} onPress={() => router.push('/admin/orders')}>
                    <FileText size={24} color="#94A3B8" />
                    <Text style={styles.navText}>Orders</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem} onPress={() => router.push('/admin/users')}>
                    <Users size={24} color="#94A3B8" />
                    <Text style={styles.navText}>Governance</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem} onPress={() => router.push('/admin/login')}>
                    <CheckCircle2 size={24} color="#94A3B8" />
                    <Text style={styles.navText}>Logout</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    content: { flex: 1 },
    scrollContent: { paddingBottom: 100 },
    header: { padding: 24, paddingTop: 60, gap: 16 },
    headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    welcomeText: { fontSize: 16, color: '#64748B', fontWeight: '500' },
    adminName: { fontSize: 32, fontWeight: '900', color: '#0F172A', marginTop: -4 },
    avatarCircle: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#E2E8F0' },
    avatarInitial: { fontSize: 20, fontWeight: 'bold', color: '#64748B' },
    roleTagRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    roleBadge: { backgroundColor: '#ECFDF5', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 8 },
    roleBadgeText: { color: '#10B981', fontSize: 12, fontWeight: '800', letterSpacing: 0.5 },
    kriText: { color: '#94A3B8', fontWeight: 'bold', fontSize: 13 },

    bannerSection: { paddingHorizontal: 20, marginTop: 10 },
    sectionLabel: { fontSize: 13, color: '#94A3B8', fontWeight: '800', marginBottom: 12, letterSpacing: 1 },
    mainBanner: { height: 160, borderRadius: 24, overflow: 'hidden', elevation: 8, shadowColor: '#10B981', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.2, shadowRadius: 20 },
    bannerGradient: { flex: 1 },
    bannerContent: { flex: 1, flexDirection: 'row', alignItems: 'center', padding: 24, gap: 16 },
    plusCircle: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' },
    bannerText: { flex: 1 },
    bannerTitle: { fontSize: 24, fontWeight: '900', color: '#fff' },
    bannerDesc: { fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 4 },

    managementSection: { paddingHorizontal: 20, marginTop: 32, gap: 16 },
    sectionTitle: { fontSize: 20, fontWeight: '900', color: '#0F172A', marginBottom: 4 },
    mgmtCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 16, borderRadius: 24, borderWidth: 1, borderColor: '#F1F5F9', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05 },
    mgmtIconBox: { width: 48, height: 48, borderRadius: 16, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center' },
    mgmtText: { flex: 1, marginLeft: 16 },
    mgmtTitle: { fontSize: 17, fontWeight: '800', color: '#1E293B' },
    mgmtDesc: { fontSize: 13, color: '#64748B', marginTop: 2 },
    newBadge: { backgroundColor: '#FEE2E2', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
    newBadgeText: { color: '#EF4444', fontSize: 12, fontWeight: 'bold' },

    metricsGrid: { flexDirection: 'row', paddingHorizontal: 20, marginTop: 32, gap: 12 },
    metricBox: { flex: 1, backgroundColor: '#F8FAFC', padding: 16, borderRadius: 20, alignItems: 'center', gap: 4 },
    metricVal: { fontSize: 18, fontWeight: '900', color: '#0F172A' },
    metricLabel: { fontSize: 11, color: '#64748B', fontWeight: '700' },

    alertSection: { paddingHorizontal: 20, marginTop: 32, gap: 12 },
    alertCard: { padding: 8, borderRadius: 24 },
    alertRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12 },
    alertText: { fontSize: 14, color: '#475569', fontWeight: '500' },

    bottomNav: { position: 'absolute', bottom: 0, width: width, height: 85, backgroundColor: '#fff', flexDirection: 'row', borderTopWidth: 1, borderTopColor: '#F1F5F9', paddingBottom: 25 },
    navItem: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 4 },
    navText: { fontSize: 10, fontWeight: '700', color: '#94A3B8' }
});

