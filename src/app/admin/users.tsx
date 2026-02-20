import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TextInput,
    TouchableOpacity,
    Alert,
    Image,
    Modal,
    ScrollView,
    Dimensions
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useAdminStore } from '../../hooks/useAdminStore';
import { User } from '../../lib/auth';
import {
    Search,
    MoreVertical,
    CheckCircle2,
    ShieldAlert,
    MapPin,
    Phone,
    Mail,
    ChevronRight,
    X,
    Clock,
    Calendar,
    AlertTriangle,
    Package,
    ShoppingBag,
    History,
    FileText
} from '../../components/icons';
import { AnimatedButton } from '../../components/ui/AnimatedButton';
import { Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';
import Colors from '../../constants/Colors';

const { width, height } = Dimensions.get('window');

export default function UserManagementScreen() {
    const router = useRouter();
    const { users, verifyUser, suspendUser } = useAdminStore();
    const [searchQuery, setSearchQuery] = useState('');
    const [filter, setFilter] = useState<'all' | 'farmers' | 'buyers'>('all');

    // UI States
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showSuspendModal, setShowSuspendModal] = useState(false);

    const handleVerify = (user: User) => {
        const isVerified = user.isVerifiedBuyer || !!user.digitalId;
        Alert.alert(
            isVerified ? 'Revoke Verification?' : 'Verify User?',
            `Change verification status for ${user.name}?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: isVerified ? 'Revoke' : 'Verify',
                    onPress: () => verifyUser(user.email, !isVerified)
                }
            ]
        );
    };

    const confirmSuspension = (period: string) => {
        if (!selectedUser) return;
        suspendUser(selectedUser.email, true);
        setShowSuspendModal(false);
        Alert.alert('User Suspended', `${selectedUser.name} has been suspended for ${period}.`);
    };

    const handleAction = (user: User) => {
        setSelectedUser(user);
        setShowDetailModal(true);
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = filter === 'all' ||
            (filter === 'farmers' && user.role === 'farmer') ||
            (filter === 'buyers' && user.role === 'buyer');
        return matchesSearch && matchesFilter;
    });

    const renderUserItem = ({ item }: { item: User }) => {
        const isVerified = item.isVerifiedBuyer || !!item.digitalId;
        return (
            <Card style={[styles.userCard, isVerified && styles.verifiedCard]}>
                <TouchableOpacity onPress={() => handleAction(item)} style={styles.cardTouch}>
                    <View style={styles.cardHeader}>
                        <View style={styles.userInfo}>
                            <View style={styles.avatarContainer}>
                                {item.profileImage ? (
                                    <Image source={{ uri: item.profileImage }} style={styles.avatar} />
                                ) : (
                                    <View style={[styles.avatar, styles.avatarPlaceholder]}>
                                        <Text style={styles.avatarText}>{item.name.substring(0, 2).toUpperCase()}</Text>
                                    </View>
                                )}
                            </View>
                            <View style={styles.userTextInfo}>
                                <Text style={styles.userName}>{item.name}</Text>
                                <Text style={styles.userEmail}>{item.email}</Text>
                                <View style={styles.badgeRow}>
                                    <Badge style={styles.roleBadge}
                                        variant={item.role === 'buyer' ? 'secondary' : 'default'}>
                                        {item.role.toUpperCase()}
                                    </Badge>
                                    {isVerified && (
                                        <Badge variant="success" style={styles.verifiedBadge}>Verified</Badge>
                                    )}
                                    {item.isSuspended && (
                                        <Badge variant="destructive" style={styles.suspendedBadge}>Suspended</Badge>
                                    )}
                                </View>
                            </View>
                        </View>
                        <TouchableOpacity onPress={() => {
                            setSelectedUser(item);
                            setShowSuspendModal(true);
                        }}>
                            <MoreVertical size={20} color="#94A3B8" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.contactRow}>
                        <View style={styles.contactItem}>
                            <MapPin size={14} color="#64748B" />
                            <Text style={styles.contactText}>{item.location || 'Unknown'}</Text>
                        </View>
                        {item.phone && (
                            <View style={styles.contactItem}>
                                <Phone size={14} color="#64748B" />
                                <Text style={styles.contactText}>{item.phone}</Text>
                            </View>
                        )}
                    </View>

                    <View style={styles.cardActions}>
                        <TouchableOpacity
                            style={[styles.miniBtn, styles.miniVerifyBtn]}
                            onPress={() => handleVerify(item)}
                        >
                            <CheckCircle2 size={16} color="#166534" />
                            <Text style={styles.miniBtnTextVerify}>{isVerified ? 'Revoke' : 'Verify'}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.miniBtn, styles.miniSuspendBtn]}
                            onPress={() => {
                                setSelectedUser(item);
                                setShowSuspendModal(true);
                            }}
                        >
                            <ShieldAlert size={16} color="#991B1B" />
                            <Text style={styles.miniBtnTextSuspend}>Suspend</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Card>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.topHeader}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backLink}>
                    <Text style={styles.backLinkText}>← Back</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>User Governance</Text>
                <View style={{ width: 60 }} />
            </View>

            <View style={styles.searchSection}>
                <View style={styles.searchBar}>
                    <Search size={20} color="#94A3B8" />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search users..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        placeholderTextColor="#94A3B8"
                    />
                </View>

                <View style={styles.filterTabs}>
                    {(['all', 'farmers', 'buyers'] as const).map((f) => (
                        <TouchableOpacity
                            key={f}
                            style={[styles.filterTab, filter === f && styles.filterTabActive]}
                            onPress={() => setFilter(f)}
                        >
                            <Text style={[styles.filterTabText, filter === f && styles.filterTabTextActive]}>
                                {f === 'all' ? 'All' : f === 'farmers' ? 'Farmers' : 'Buyers'}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            <FlatList
                data={filteredUsers}
                renderItem={renderUserItem}
                keyExtractor={(item) => item.email}
                contentContainerStyle={styles.listPadding}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <AlertTriangle size={48} color="#CBD5E1" />
                        <Text style={styles.emptyText}>No users match your search.</Text>
                    </View>
                }
            />

            {/* Suspend Modal */}
            <Modal
                visible={showSuspendModal}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setShowSuspendModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.suspendSheet}>
                        <View style={styles.sheetHeader}>
                            <Text style={styles.sheetTitle}>Suspension Options</Text>
                            <TouchableOpacity onPress={() => setShowSuspendModal(false)}>
                                <X size={24} color="#64748B" />
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.sheetSubtitle}>Action for {selectedUser?.name}</Text>

                        <View style={styles.optionsList}>
                            <TouchableOpacity style={styles.optionItem} onPress={() => confirmSuspension('24 Hours')}>
                                <View style={[styles.optionIcon, { backgroundColor: '#FEF3C7' }]}>
                                    <Clock size={20} color="#D97706" />
                                </View>
                                <View style={styles.optionText}>
                                    <Text style={styles.optionLabel}>Temporary Suspend</Text>
                                    <Text style={styles.optionDesc}>Restrict access for 24 hours</Text>
                                </View>
                                <ChevronRight size={18} color="#CBD5E1" />
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.optionItem} onPress={() => confirmSuspension('7 Days')}>
                                <View style={[styles.optionIcon, { backgroundColor: '#FEE2E2' }]}>
                                    <Calendar size={20} color="#DC2626" />
                                </View>
                                <View style={styles.optionText}>
                                    <Text style={styles.optionLabel}>Warning Suspend</Text>
                                    <Text style={styles.optionDesc}>Restrict access for 7 days</Text>
                                </View>
                                <ChevronRight size={18} color="#CBD5E1" />
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.optionItem} onPress={() => confirmSuspension('Permanent')}>
                                <View style={[styles.optionIcon, { backgroundColor: '#450A0A' }]}>
                                    <ShieldAlert size={20} color="#fff" />
                                </View>
                                <View style={styles.optionText}>
                                    <Text style={styles.optionLabel}>Permanent Suspend</Text>
                                    <Text style={styles.optionDesc}>Remove access indefinitely</Text>
                                </View>
                                <ChevronRight size={18} color="#CBD5E1" />
                            </TouchableOpacity>

                            {selectedUser?.isSuspended && (
                                <TouchableOpacity
                                    style={[styles.optionItem, { marginTop: 10, borderBottomWidth: 0 }]}
                                    onPress={() => {
                                        suspendUser(selectedUser.email, false);
                                        setShowSuspendModal(false);
                                        Alert.alert('Restored', 'User access has been restored.');
                                    }}
                                >
                                    <View style={[styles.optionIcon, { backgroundColor: '#DCFCE7' }]}>
                                        <CheckCircle2 size={20} color="#166534" />
                                    </View>
                                    <View style={styles.optionText}>
                                        <Text style={styles.optionLabel}>Restore Access</Text>
                                        <Text style={styles.optionDesc}>Re-enable account immediately</Text>
                                    </View>
                                    <ChevronRight size={18} color="#CBD5E1" />
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Detail Modal (Read Only) */}
            <Modal
                visible={showDetailModal}
                animationType="slide"
                onRequestClose={() => setShowDetailModal(false)}
            >
                <View style={styles.detailContainer}>
                    <LinearGradient colors={[Colors.primary, '#15803D']} style={styles.detailHeader}>
                        <View style={styles.detailNavbar}>
                            <TouchableOpacity onPress={() => setShowDetailModal(false)}>
                                <X size={24} color="#fff" />
                            </TouchableOpacity>
                            <Text style={styles.detailNavTitle}>User Profile (Read-Only)</Text>
                            <TouchableOpacity onPress={() => handleVerify(selectedUser!)}>
                                <ShieldCheck size={24} color="#fff" />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.profileBio}>
                            <View style={styles.largeAvatarContainer}>
                                {selectedUser?.profileImage ? (
                                    <Image source={{ uri: selectedUser.profileImage }} style={styles.largeAvatar} />
                                ) : (
                                    <View style={styles.largeAvatarPlaceholder}>
                                        <Text style={styles.largeAvatarText}>{selectedUser?.name.substring(0, 2).toUpperCase()}</Text>
                                    </View>
                                )}
                            </View>
                            <Text style={styles.bioName}>{selectedUser?.name}</Text>
                            <Text style={styles.bioEmail}>{selectedUser?.email}</Text>
                            <View style={styles.bioBadges}>
                                <Badge variant="secondary">{selectedUser?.role.toUpperCase()}</Badge>
                                <Badge variant="success">SINCE {selectedUser?.memberSince || '2023'}</Badge>
                            </View>
                        </View>
                    </LinearGradient>

                    <ScrollView style={styles.detailScroll}>
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Contact Information</Text>
                            <View style={styles.infoCard}>
                                <View style={styles.infoRow}>
                                    <Phone size={18} color={Colors.primary} />
                                    <Text style={styles.infoValue}>{selectedUser?.phone || 'Not provided'}</Text>
                                </View>
                                <View style={styles.infoRow}>
                                    <MapPin size={18} color={Colors.primary} />
                                    <Text style={styles.infoValue}>{selectedUser?.location || 'Unknown'}</Text>
                                </View>
                            </View>
                        </View>

                        {selectedUser?.role === 'farmer' && (
                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>Farm Details</Text>
                                <View style={styles.infoCard}>
                                    <View style={styles.dataRow}>
                                        <Text style={styles.dataLabel}>Farm Name:</Text>
                                        <Text style={styles.dataValue}>{selectedUser.farmDetails?.name || 'N/A'}</Text>
                                    </View>
                                    <View style={styles.dataRow}>
                                        <Text style={styles.dataLabel}>Size:</Text>
                                        <Text style={styles.dataValue}>{selectedUser.farmDetails?.size || 'N/A'}</Text>
                                    </View>
                                    <View style={styles.dataRow}>
                                        <Text style={styles.dataLabel}>Crops:</Text>
                                        <View style={styles.cropList}>
                                            {selectedUser.farmDetails?.crops?.map(c => (
                                                <Badge key={c} style={styles.cropBadge}>{c}</Badge>
                                            ))}
                                        </View>
                                    </View>
                                </View>
                            </View>
                        )}

                        {selectedUser?.role === 'buyer' && (
                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>Business Info</Text>
                                <View style={styles.infoCard}>
                                    <View style={styles.dataRow}>
                                        <Text style={styles.dataLabel}>Entity:</Text>
                                        <Text style={styles.dataValue}>{selectedUser.businessName || 'N/A'}</Text>
                                    </View>
                                    <View style={styles.dataRow}>
                                        <Text style={styles.dataLabel}>Type:</Text>
                                        <Text style={styles.dataValue}>{selectedUser.businessType || 'N/A'}</Text>
                                    </View>
                                    <View style={styles.dataRow}>
                                        <Text style={styles.dataLabel}>Volume:</Text>
                                        <Text style={styles.dataValue}>{selectedUser.procurementStats?.totalSourced || '0 Tons'}</Text>
                                    </View>
                                </View>
                            </View>
                        )}

                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Activity Overview</Text>
                            <View style={styles.statsGrid}>
                                <View style={styles.statBox}>
                                    <History size={20} color={Colors.primary} />
                                    <Text style={styles.statVal}>128</Text>
                                    <Text style={styles.statLabel}>Total Orders</Text>
                                </View>
                                <View style={styles.statBox}>
                                    {selectedUser?.role === 'farmer' ? (
                                        <Package size={20} color={Colors.primary} />
                                    ) : (
                                        <ShoppingBag size={20} color={Colors.primary} />
                                    )}
                                    <Text style={styles.statVal}>14</Text>
                                    <Text style={styles.statLabel}>{selectedUser?.role === 'farmer' ? 'Listings' : 'Requests'}</Text>
                                </View>
                            </View>
                        </View>

                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Account Status</Text>
                            <View style={[styles.infoCard, selectedUser?.isSuspended && { borderColor: '#EF4444', borderWidth: 1 }]}>
                                <View style={styles.statusRow}>
                                    <View style={styles.statusInfo}>
                                        <Text style={styles.statusLabel}>Availability</Text>
                                        <Text style={[styles.statusValue, { color: selectedUser?.isSuspended ? '#EF4444' : '#10B981' }]}>
                                            {selectedUser?.isSuspended ? 'Suspended' : 'Active'}
                                        </Text>
                                    </View>
                                    <ShieldAlert size={24} color={selectedUser?.isSuspended ? '#EF4444' : '#E2E8F0'} />
                                </View>
                            </View>
                        </View>

                        <View style={styles.footerNote}>
                            <FileText size={14} color="#94A3B8" />
                            <Text style={styles.footerNoteText}>This profile is locked for editing by Admin Policy.</Text>
                        </View>
                    </ScrollView>
                </View>
            </Modal>
        </View>
    );
}

// Icons placeholders for ShieldCheck
const ShieldCheck = ({ size, color }: any) => <Text style={{ fontSize: size, color }}>🛡️</Text>;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8FAFC' },
    topHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 20,
        backgroundColor: '#fff',
    },
    backLink: { paddingVertical: 8 },
    backLinkText: { color: Colors.primary, fontWeight: '700', fontSize: 16 },
    headerTitle: { fontSize: 20, fontWeight: '800', color: '#0F172A' },

    searchSection: { padding: 20, backgroundColor: '#fff', gap: 16, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F1F5F9',
        borderRadius: 16,
        paddingHorizontal: 16,
        height: 52,
    },
    searchInput: { flex: 1, marginLeft: 12, fontSize: 16, color: '#0F172A' },
    filterTabs: { flexDirection: 'row', gap: 10 },
    filterTab: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#F1F5F9' },
    filterTabActive: { backgroundColor: '#0F172A' },
    filterTabText: { color: '#64748B', fontWeight: '700', fontSize: 13 },
    filterTabTextActive: { color: '#fff' },

    listPadding: { padding: 20, gap: 16, paddingBottom: 40 },
    userCard: { padding: 0, borderRadius: 20, overflow: 'hidden', borderLeftWidth: 0 },
    verifiedCard: { borderLeftWidth: 5, borderLeftColor: '#22C55E' },
    cardTouch: { padding: 16 },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
    userInfo: { flexDirection: 'row', gap: 16, flex: 1 },
    avatarContainer: { position: 'relative' },
    avatar: { width: 56, height: 56, borderRadius: 28 },
    avatarPlaceholder: { backgroundColor: '#E2E8F0', justifyContent: 'center', alignItems: 'center' },
    avatarText: { fontSize: 18, fontWeight: 'bold', color: '#64748B' },
    userTextInfo: { flex: 1, gap: 2 },
    userName: { fontSize: 18, fontWeight: '800', color: '#0F172A' },
    userEmail: { fontSize: 13, color: '#64748B', marginBottom: 6 },
    badgeRow: { flexDirection: 'row', gap: 6, flexWrap: 'wrap' },
    roleBadge: { height: 22 },
    verifiedBadge: { height: 22 },
    suspendedBadge: { height: 22 },

    contactRow: { marginTop: 16, flexDirection: 'row', gap: 20, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#F8FAFC' },
    contactItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    contactText: { fontSize: 13, color: '#64748B', fontWeight: '500' },

    cardActions: { flexDirection: 'row', gap: 12, marginTop: 16 },
    miniBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 40, borderRadius: 12, gap: 6 },
    miniVerifyBtn: { backgroundColor: '#DCFCE7' },
    miniSuspendBtn: { backgroundColor: '#FEE2E2' },
    miniBtnTextVerify: { color: '#166534', fontWeight: 'bold', fontSize: 13 },
    miniBtnTextSuspend: { color: '#991B1B', fontWeight: 'bold', fontSize: 13 },

    emptyState: { alignItems: 'center', marginTop: 100, gap: 12 },
    emptyText: { color: '#94A3B8', fontSize: 16, fontWeight: '500' },

    // Modal Styles
    modalOverlay: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.6)', justifyContent: 'flex-end' },
    suspendSheet: { backgroundColor: '#fff', borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 24, paddingBottom: 40 },
    sheetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
    sheetTitle: { fontSize: 20, fontWeight: '800', color: '#0F172A' },
    sheetSubtitle: { fontSize: 14, color: '#64748B', marginBottom: 24 },
    optionsList: { gap: 12 },
    optionItem: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 16, backgroundColor: '#F8FAFC', borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
    optionIcon: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
    optionText: { flex: 1, marginLeft: 16 },
    optionLabel: { fontSize: 16, fontWeight: '700', color: '#0F172A' },
    optionDesc: { fontSize: 13, color: '#64748B', marginTop: 2 },

    // Detail Modal
    detailContainer: { flex: 1, backgroundColor: '#F8FAFC' },
    detailHeader: { padding: 24, paddingTop: 60, paddingBottom: 32 },
    detailNavbar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
    detailNavTitle: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    profileBio: { alignItems: 'center' },
    largeAvatarContainer: { marginBottom: 16, borderWidth: 4, borderColor: 'rgba(255,255,255,0.3)', borderRadius: 60 },
    largeAvatar: { width: 100, height: 100, borderRadius: 50 },
    largeAvatarPlaceholder: { width: 100, height: 100, borderRadius: 50, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
    largeAvatarText: { color: '#fff', fontSize: 32, fontWeight: 'bold' },
    bioName: { fontSize: 24, fontWeight: '900', color: '#fff' },
    bioEmail: { fontSize: 14, color: 'rgba(255,255,255,0.8)', marginVertical: 4 },
    bioBadges: { flexDirection: 'row', gap: 8, marginTop: 12 },

    detailScroll: { flex: 1, marginTop: -20, backgroundColor: '#F8FAFC', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24 },
    section: { marginBottom: 24 },
    sectionTitle: { fontSize: 16, fontWeight: '800', color: '#1E293B', marginBottom: 12, letterSpacing: 0.5 },
    infoCard: { backgroundColor: '#fff', borderRadius: 16, padding: 16, gap: 16, elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 10 },
    infoRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    infoValue: { fontSize: 15, fontWeight: '600', color: '#334155' },
    dataRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    dataLabel: { fontSize: 14, color: '#64748B', fontWeight: '500' },
    dataValue: { fontSize: 14, color: '#1E293B', fontWeight: '700' },
    cropList: { flexDirection: 'row', gap: 4, flexWrap: 'wrap', justifyContent: 'flex-end', flex: 1, marginLeft: 20 },
    cropBadge: { backgroundColor: '#F1F5F9', borderColors: '#E2E8F0', borderWidth: 1 },

    statsGrid: { flexDirection: 'row', gap: 16 },
    statBox: { flex: 1, backgroundColor: '#fff', borderRadius: 16, padding: 16, alignItems: 'center', gap: 4, elevation: 4 },
    statVal: { fontSize: 20, fontWeight: '900', color: '#1E293B' },
    statLabel: { fontSize: 12, color: '#64748B', fontWeight: '500' },

    statusRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    statusInfo: { gap: 4 },
    statusLabel: { fontSize: 14, color: '#64748B', fontWeight: '500' },
    statusValue: { fontSize: 16, fontWeight: '800' },

    footerNote: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 12, marginBottom: 40 },
    footerNoteText: { fontSize: 12, color: '#94A3B8', fontWeight: '500' }
});

