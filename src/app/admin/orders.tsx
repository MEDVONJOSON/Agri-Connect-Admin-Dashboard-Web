import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    TextInput,
    ScrollView,
    Modal
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useMarketplaceStore } from '../../hooks/useMarketplaceStore';
import {
    Search,
    Filter,
    ChevronRight,
    Package,
    Truck,
    CheckCircle2,
    Clock,
    MapPin,
    DollarSign,
    ProfileIcon
} from '../../components/icons';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import Colors from '../../constants/Colors';

export default function OrdersMonitorScreen() {
    const router = useRouter();
    const { orders } = useMarketplaceStore(); // In real app, this would be a separate admin fetch
    const [filter, setFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<any>(null);
    const [modalVisible, setModalVisible] = useState(false);

    const orderStats = {
        total: orders.length,
        pending: orders.filter(o => o.status === 'PENDING').length,
        completed: orders.filter(o => o.status === 'COMPLETED').length,
        failed: orders.filter(o => o.status === 'CANCELLED').length,
    };

    // Mock refreshing
    const handleRefresh = () => {
        setLoading(true);
        setTimeout(() => setLoading(false), 1000);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'COMPLETED': return '#166534'; // green-800
            case 'DELIVERED': return '#15803D'; // green-700
            case 'SHIPPED': return '#0369A1'; // sky-700
            case 'ESCROW': return '#B45309'; // amber-700
            case 'PENDING': return '#64748B'; // slate-500
            case 'CANCELLED': return '#991B1B'; // red-800
            default: return '#64748B';
        }
    };

    const getStatusBg = (status: string) => {
        switch (status) {
            case 'COMPLETED': return '#DCFCE7';
            case 'DELIVERED': return '#DCFCE7';
            case 'SHIPPED': return '#E0F2FE';
            case 'ESCROW': return '#FEF3C7';
            case 'PENDING': return '#F1F5F9';
            case 'CANCELLED': return '#FEE2E2';
            default: return '#F1F5F9';
        }
    };

    const filteredOrders = orders.filter(order => {
        const matchesSearch =
            order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.product_name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = filter === 'all' || order.status === filter;
        return matchesSearch && matchesFilter;
    });

    const handleOrderPress = (order: any) => {
        setSelectedOrder(order);
        setModalVisible(true);
    };

    const renderOrderItem = ({ item }: { item: any }) => (
        <TouchableOpacity onPress={() => handleOrderPress(item)}>
            <Card style={styles.card}>
                <View style={styles.cardHeader}>
                    <View style={styles.orderIdRow}>
                        <Package size={16} color="#64748B" />
                        <Text style={styles.orderId}>#{item.id}</Text>
                    </View>
                    <Badge
                        style={{ backgroundColor: getStatusBg(item.status) }}
                        textStyle={{ color: getStatusColor(item.status), fontSize: 10, fontWeight: 'bold' }}
                    >
                        {item.status}
                    </Badge>
                </View>

                <View style={styles.productRow}>
                    <Text style={styles.productName}>{item.product_name}</Text>
                    <Text style={styles.amount}>Le {item.total_amount?.toLocaleString()}</Text>
                </View>

                <View style={styles.detailsGrid}>
                    <View style={styles.detailItem}>
                        <ProfileIcon size={12} color="#94A3B8" />
                        <Text style={styles.detailLabel}>Buyer: {item.buyer_id?.substring(0, 8) || 'Unknown'}...</Text>
                    </View>
                    <View style={styles.detailItem}>
                        <ProfileIcon size={12} color="#94A3B8" />
                        <Text style={styles.detailLabel}>Seller: {item.seller_id?.substring(0, 8) || 'Unknown'}...</Text>
                    </View>
                    <View style={styles.detailItem}>
                        <Clock size={12} color="#94A3B8" />
                        <Text style={styles.detailLabel}>{new Date(item.date).toLocaleDateString()}</Text>
                    </View>
                    <ChevronRight size={14} color="#CBD5E1" />
                </View>
            </Card>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#fff', '#F8FAFC']}
                style={styles.header}
            >
                <View style={styles.headerTop}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                        <Text style={styles.backText}>← Dashboard</Text>
                    </TouchableOpacity>
                    <Text style={styles.title}>Transaction Monitor</Text>
                    <View style={{ width: 40 }} />
                </View>

                {/* Search */}
                <View style={styles.searchBox}>
                    <Search size={20} color="#64748B" />
                    <TextInput
                        style={styles.input}
                        placeholder="Search Order ID or Product..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>

                {/* Summary Row */}
                <View style={styles.summaryRow}>
                    <View style={styles.summaryItem}>
                        <Text style={styles.summaryCount}>{orderStats.total}</Text>
                        <Text style={styles.summaryLabel}>Total</Text>
                    </View>
                    <View style={styles.summaryItem}>
                        <Text style={[styles.summaryCount, { color: '#64748B' }]}>{orderStats.pending}</Text>
                        <Text style={styles.summaryLabel}>Pending</Text>
                    </View>
                    <View style={styles.summaryItem}>
                        <Text style={[styles.summaryCount, { color: '#166534' }]}>{orderStats.completed}</Text>
                        <Text style={styles.summaryLabel}>Done</Text>
                    </View>
                    <View style={styles.summaryItem}>
                        <Text style={[styles.summaryCount, { color: '#991B1B' }]}>{orderStats.failed}</Text>
                        <Text style={styles.summaryLabel}>Failed</Text>
                    </View>
                </View>

                {/* Filter Chips */}
                <View style={styles.filterRow}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {['all', 'PENDING', 'ESCROW', 'COMPLETED', 'CANCELLED'].map(f => (
                            <TouchableOpacity
                                key={f}
                                style={[styles.chip, filter === f && styles.chipActive]}
                                onPress={() => setFilter(f)}
                            >
                                <Text style={[styles.chipText, filter === f && styles.chipTextActive]}>
                                    {f === 'all' ? 'All Orders' : f}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            </LinearGradient>

            <FlatList
                data={filteredOrders}
                renderItem={renderOrderItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.list}
                onRefresh={handleRefresh}
                refreshing={loading}
                ListEmptyComponent={
                    <View style={styles.empty}>
                        <Text style={styles.emptyText}>No orders found.</Text>
                    </View>
                }
            />

            {/* Order Detail Modal */}
            <Modal
                visible={modalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Order Details</Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeBtn}>
                                <Text style={styles.closeBtnText}>Close</Text>
                            </TouchableOpacity>
                        </View>

                        {selectedOrder && (
                            <ScrollView showsVerticalScrollIndicator={false}>
                                <View style={styles.modalSection}>
                                    <View style={styles.modalRow}>
                                        <Text style={styles.modalLabel}>Order ID</Text>
                                        <Text style={styles.modalValue}>#{selectedOrder.id}</Text>
                                    </View>
                                    <View style={styles.modalRow}>
                                        <Text style={styles.modalLabel}>Date</Text>
                                        <Text style={styles.modalValue}>{new Date(selectedOrder.date).toLocaleString()}</Text>
                                    </View>
                                    <View style={styles.modalRow}>
                                        <Text style={styles.modalLabel}>Status</Text>
                                        <Badge
                                            style={{ backgroundColor: getStatusBg(selectedOrder.status) }}
                                            textStyle={{ color: getStatusColor(selectedOrder.status), fontSize: 10, fontWeight: 'bold' }}
                                        >
                                            {selectedOrder.status}
                                        </Badge>
                                    </View>
                                </View>

                                <View style={styles.modalDivider} />

                                <View style={styles.modalSection}>
                                    <Text style={styles.sectionTitle}>Product Information</Text>
                                    <View style={styles.productDetailCard}>
                                        <View style={styles.iconBox}>
                                            <Package size={24} color={Colors.primary} />
                                        </View>
                                        <View>
                                            <Text style={styles.productNameLarge}>{selectedOrder.product_name}</Text>
                                            <Text style={styles.productIdSmall}>ID: {selectedOrder.product_id}</Text>
                                        </View>
                                    </View>
                                </View>

                                <View style={styles.modalSection}>
                                    <Text style={styles.sectionTitle}>Financial Breakdown</Text>
                                    <View style={styles.priceRow}>
                                        <Text style={styles.priceLabel}>Product Price</Text>
                                        <Text style={styles.priceValue}>Le {selectedOrder.amount?.toLocaleString()}</Text>
                                    </View>
                                    <View style={styles.priceRow}>
                                        <Text style={styles.priceLabel}>Platform Fee (5%)</Text>
                                        <Text style={styles.priceValue}>Le {selectedOrder.service_fee?.toLocaleString()}</Text>
                                    </View>
                                    <View style={[styles.priceRow, styles.totalPriceRow]}>
                                        <Text style={styles.totalPriceLabel}>Total Transaction</Text>
                                        <Text style={styles.totalPriceValue}>Le {selectedOrder.total_amount?.toLocaleString()}</Text>
                                    </View>
                                </View>

                                <View style={styles.modalDivider} />

                                <View style={styles.modalSection}>
                                    <Text style={styles.sectionTitle}>Participants</Text>
                                    <View style={styles.participantItem}>
                                        <MapPin size={16} color="#64748B" />
                                        <View>
                                            <Text style={styles.participantLabel}>Buyer ID (Internal)</Text>
                                            <Text style={styles.participantValue}>{selectedOrder.buyer_id}</Text>
                                        </View>
                                    </View>
                                    <View style={[styles.participantItem, { marginTop: 12 }]}>
                                        <Truck size={16} color="#64748B" />
                                        <View>
                                            <Text style={styles.participantLabel}>Seller ID (Internal)</Text>
                                            <Text style={styles.participantValue}>{selectedOrder.seller_id}</Text>
                                        </View>
                                    </View>
                                </View>

                                <View style={styles.securityWarning}>
                                    <Text style={styles.securityText}>
                                        * All funds are currently held in AgriConnect Escrow. Admin oversight required for manual refunds or settlement disputes.
                                    </Text>
                                </View>
                            </ScrollView>
                        )}
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F1F5F9' },
    header: { padding: 20, paddingTop: 60, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
    headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
    backBtn: { padding: 8 },
    backText: { color: Colors.primary, fontWeight: '600' },
    title: { fontSize: 18, fontWeight: 'bold', color: '#0F172A' },
    searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F1F5F9', borderRadius: 12, paddingHorizontal: 12, height: 44, marginBottom: 20 },
    input: { flex: 1, marginLeft: 8, fontSize: 15, color: '#0F172A' },
    summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24, backgroundColor: '#F8FAFC', padding: 16, borderRadius: 16, borderWidth: 1, borderColor: '#F1F5F9' },
    summaryItem: { alignItems: 'center', flex: 1 },
    summaryCount: { fontSize: 18, fontWeight: '900', color: '#0F172A' },
    summaryLabel: { fontSize: 10, color: '#64748B', fontWeight: 'bold', textTransform: 'uppercase', marginTop: 4 },
    filterRow: { flexDirection: 'row', gap: 8 },
    chip: { paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20, backgroundColor: '#F1F5F9', borderWidth: 1, borderColor: '#E2E8F0', marginRight: 8 },
    chipActive: { backgroundColor: '#0F172A', borderColor: '#0F172A' },
    chipText: { fontSize: 12, color: '#64748B', fontWeight: '600' },
    chipTextActive: { color: '#fff' },
    list: { padding: 16, gap: 12 },
    card: { padding: 16, borderRadius: 12, backgroundColor: '#fff' },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
    orderIdRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    orderId: { fontSize: 14, fontWeight: '600', color: '#64748B' },
    productRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
    productName: { fontSize: 16, fontWeight: 'bold', color: '#0F172A' },
    amount: { fontSize: 16, fontWeight: 'bold', color: Colors.primary },
    detailsGrid: { flexDirection: 'row', gap: 16, borderTopWidth: 1, borderTopColor: '#F1F5F9', paddingTop: 12 },
    detailItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    detailLabel: { fontSize: 11, color: '#94A3B8' },
    empty: { alignItems: 'center', marginTop: 40 },
    emptyText: { color: '#94A3B8' },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: 16,
    },

    /* Modal Styles */
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(15, 23, 42, 0.7)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        padding: 24,
        maxHeight: '85%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#0F172A',
    },
    closeBtn: {
        padding: 8,
    },
    closeBtnText: {
        color: Colors.primary,
        fontWeight: 'bold',
    },
    modalSection: {
        marginBottom: 20,
    },
    modalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
    },
    modalLabel: {
        fontSize: 14,
        color: '#64748B',
    },
    modalValue: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#0F172A',
    },
    modalDivider: {
        height: 1,
        backgroundColor: '#F1F5F9',
        marginVertical: 12,
    },
    productDetailCard: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        backgroundColor: '#F8FAFC',
        padding: 16,
        borderRadius: 16,
        marginTop: 12,
    },
    iconBox: {
        width: 50,
        height: 50,
        borderRadius: 12,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 1,
    },
    productNameLarge: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#0F172A',
    },
    productIdSmall: {
        fontSize: 12,
        color: '#94A3B8',
        marginTop: 2,
    },
    priceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
    },
    priceLabel: {
        fontSize: 14,
        color: '#64748B',
    },
    priceValue: {
        fontSize: 14,
        color: '#0F172A',
        fontWeight: '500',
    },
    totalPriceRow: {
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
    },
    totalPriceLabel: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#0F172A',
    },
    totalPriceValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.primary,
    },
    participantItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginTop: 8,
    },
    participantLabel: {
        fontSize: 11,
        color: '#94A3B8',
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    participantValue: {
        fontSize: 13,
        color: '#334155',
        marginTop: 2,
    },
    securityWarning: {
        backgroundColor: '#FFFBEB',
        padding: 16,
        borderRadius: 12,
        marginTop: 24,
        marginBottom: 40,
    },
    securityText: {
        fontSize: 11,
        color: '#92400E',
        lineHeight: 16,
        fontWeight: '500',
    }
});
