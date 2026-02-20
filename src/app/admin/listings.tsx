import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Image,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    Modal,
    TextInput
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useMarketplaceStore } from '../../hooks/useMarketplaceStore';
import { useAdminStore } from '../../hooks/useAdminStore';
import { Check, X, Clock, MapPin, Tag } from '../../components/icons';
import { AnimatedButton } from '../../components/ui/AnimatedButton';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import Colors from '../../constants/Colors';

export default function ListingsApprovalScreen() {
    const router = useRouter();
    const { products, updateProductStatus, fetchProducts } = useMarketplaceStore();
    const [filter, setFilter] = useState<'pending' | 'approved' | 'rejected'>('pending');
    const [loading, setLoading] = useState(false);
    const [rejectionModalVisible, setRejectionModalVisible] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');
    const [selectedProductId, setSelectedProductId] = useState<number | null>(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const filteredProducts = products.filter(p => p.status === filter);

    const handleApprove = (id: number) => {
        Alert.alert('Approve Listing', 'Make this product visible to all buyers?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Approve',
                onPress: () => {
                    updateProductStatus(id, 'approved');
                }
            }
        ]);
    };

    const handleReject = (id: number) => {
        setSelectedProductId(id);
        setRejectionModalVisible(true);
    };

    const confirmReject = () => {
        if (!rejectionReason.trim()) {
            Alert.alert('Reason Required', 'Please provide a reason for rejection.');
            return;
        }
        if (selectedProductId) {
            updateProductStatus(selectedProductId, 'rejected', rejectionReason);
            setRejectionModalVisible(false);
            setRejectionReason('');
            setSelectedProductId(null);
        }
    };

    const renderItem = ({ item }: { item: any }) => (
        <Card style={styles.card}>
            <View style={styles.cardContent}>
                <Image source={{ uri: item.image_url }} style={styles.image} />
                <View style={styles.info}>
                    <View style={styles.headerRow}>
                        <Text style={styles.title} numberOfLines={1}>{item.product_name}</Text>
                        <Text style={styles.price}>Le {parseInt(item.price).toLocaleString()}</Text>
                    </View>

                    <View style={styles.metaRow}>
                        <Tag size={12} color="#64748B" />
                        <Text style={styles.metaText}>{item.category} • {item.quantity_available}</Text>
                    </View>

                    <View style={styles.metaRow}>
                        <MapPin size={12} color="#64748B" />
                        <Text style={styles.metaText}>{item.seller_location || 'Unknown'}</Text>
                    </View>

                    <Text style={styles.sellerName}>Seller: {item.seller_name}</Text>
                </View>
            </View>

            {filter === 'pending' && (
                <View style={styles.actionRow}>
                    <AnimatedButton
                        style={[styles.btn, styles.rejectBtn]}
                        onPress={() => handleReject(item.id)}
                    >
                        <X size={18} color="#991B1B" />
                        <Text style={styles.rejectText}>Reject</Text>
                    </AnimatedButton>
                    <AnimatedButton
                        style={[styles.btn, styles.approveBtn]}
                        onPress={() => handleApprove(item.id)}
                    >
                        <Check size={18} color="#166534" />
                        <Text style={styles.approveText}>Approve</Text>
                    </AnimatedButton>
                </View>
            )}

            {filter !== 'pending' && (
                <View style={styles.statusRow}>
                    <Text style={{
                        color: filter === 'approved' ? '#166534' : '#991B1B',
                        fontWeight: 'bold',
                        fontSize: 12
                    }}>
                        {filter === 'approved' ? 'LISTING IS LIVE' : 'LISTING REJECTED'}
                    </Text>
                    {item.status === 'rejected' && item.rejection_reason && (
                        <Text style={styles.rejectionReason}>Reason: {item.rejection_reason}</Text>
                    )}
                </View>
            )}
        </Card>
    );

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#fff', '#F8FAFC']}
                style={styles.header}
            >
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Text style={styles.backText}>← Dashboard</Text>
                </TouchableOpacity>
                <Text style={styles.pageTitle}>Listing Approvals</Text>

                {/* Status Filter Tabs */}
                <View style={styles.tabs}>
                    {(['pending', 'approved', 'rejected'] as const).map((t) => (
                        <TouchableOpacity
                            key={t}
                            style={[styles.tab, filter === t && styles.activeTab]}
                            onPress={() => setFilter(t)}
                        >
                            <Text style={[styles.tabText, filter === t && styles.activeTabText]}>
                                {t.charAt(0).toUpperCase() + t.slice(1)} ({products.filter(p => p.status === t).length})
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </LinearGradient>

            <FlatList
                data={filteredProducts}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.list}
                ListEmptyComponent={
                    <View style={styles.empty}>
                        <Check size={48} color="#CBD5E1" />
                        <Text style={styles.emptyText}>No {filter} listings found.</Text>
                    </View>
                }
            />

            {/* Rejection Reason Modal */}
            <Modal
                visible={rejectionModalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setRejectionModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Rejection Reason</Text>
                        <Text style={styles.modalSubtitle}>Provide a reason for the seller. This helps prevent scams and data errors.</Text>

                        <TextInput
                            style={styles.reasonInput}
                            placeholder="e.g. Price mismatch or low quality image..."
                            placeholderTextColor="#94A3B8"
                            multiline
                            numberOfLines={4}
                            value={rejectionReason}
                            onChangeText={setRejectionReason}
                            autoFocus
                        />

                        <View style={styles.modalActions}>
                            <TouchableOpacity
                                style={[styles.modalBtn, styles.cancelBtn]}
                                onPress={() => {
                                    setRejectionModalVisible(false);
                                    setRejectionReason('');
                                }}
                            >
                                <Text style={styles.cancelBtnText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalBtn, styles.confirmBtn]}
                                onPress={confirmReject}
                            >
                                <Text style={styles.confirmBtnText}>Confirm Reject</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F1F5F9' },
    header: { padding: 20, paddingTop: 60, backgroundColor: '#fff' },
    backBtn: { marginBottom: 12 },
    backText: { color: Colors.primary, fontWeight: '600' },
    pageTitle: { fontSize: 24, fontWeight: 'bold', color: '#0F172A', marginBottom: 20 },
    tabs: { flexDirection: 'row', backgroundColor: '#F1F5F9', padding: 4, borderRadius: 12 },
    tab: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 10 },
    activeTab: { backgroundColor: '#fff', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2 },
    tabText: { fontSize: 13, fontWeight: '600', color: '#64748B' },
    activeTabText: { color: '#0F172A' },
    list: { padding: 16, gap: 16 },
    card: { padding: 12, borderRadius: 16 },
    cardContent: { flexDirection: 'row', gap: 12 },
    image: { width: 80, height: 80, borderRadius: 8, backgroundColor: '#E2E8F0' },
    info: { flex: 1 },
    headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
    title: { fontSize: 16, fontWeight: 'bold', color: '#0F172A', flex: 1, marginRight: 8 },
    price: { fontSize: 14, fontWeight: '700', color: Colors.primary },
    metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
    metaText: { fontSize: 12, color: '#64748B' },
    sellerName: { fontSize: 11, color: '#94A3B8', marginTop: 6 },
    actionRow: { flexDirection: 'row', gap: 12, marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#F1F5F9' },
    btn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 10, borderRadius: 8, gap: 6 },
    approveBtn: { backgroundColor: '#DCFCE7' },
    approveText: { color: '#166534', fontWeight: 'bold', fontSize: 13 },
    rejectBtn: { backgroundColor: '#FEE2E2' },
    rejectText: { color: '#991B1B', fontWeight: 'bold', fontSize: 13 },
    statusRow: { marginTop: 12, paddingTop: 8, borderTopWidth: 1, borderTopColor: '#F1F5F9', alignItems: 'center' },
    rejectionReason: { fontSize: 11, color: '#991B1B', marginTop: 4, fontStyle: 'italic', textAlign: 'center' },
    empty: { alignItems: 'center', marginTop: 60, gap: 12 },
    emptyText: { color: '#94A3B8', fontSize: 16 },
    /* Modal Styles */
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        padding: 24,
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 24,
        padding: 24,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#0F172A',
        marginBottom: 8,
    },
    modalSubtitle: {
        fontSize: 14,
        color: '#64748B',
        marginBottom: 20,
        lineHeight: 20,
    },
    reasonInput: {
        backgroundColor: '#F8FAFC',
        borderRadius: 12,
        padding: 16,
        height: 120,
        textAlignVertical: 'top',
        fontSize: 16,
        color: '#0F172A',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        marginBottom: 24,
    },
    modalActions: {
        flexDirection: 'row',
        gap: 12,
    },
    modalBtn: {
        flex: 1,
        height: 48,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cancelBtn: {
        backgroundColor: '#F1F5F9',
    },
    cancelBtnText: {
        color: '#64748B',
        fontWeight: 'bold',
    },
    confirmBtn: {
        backgroundColor: '#EF4444',
    },
    confirmBtnText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});
