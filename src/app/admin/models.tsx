import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
    Switch
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import Colors from '../../constants/Colors';
import {
    Cpu,
    ChevronLeft,
    ChevronRight,
    TrendingUp,
    Activity,
    ShieldCheck,
    RefreshCw,
    AlertTriangle,
    History,
    CheckCircle2,
    XCircle,
    FlaskConical
} from '../../components/icons';

// Mock Model Data
const MOCK_MODELS = [
    {
        id: '1',
        name: 'Leaf Disease Detection v1.2',
        status: 'active',
        accuracy: '94.2%',
        lastTrained: 'Jan 28, 2026',
        dataset: 'AgriDataset-v4 (80k images)',
        history: ['v1.1', 'v1.0']
    },
    {
        id: '2',
        name: 'Yield Forecast Engine v0.9',
        status: 'testing',
        accuracy: '88.5%',
        lastTrained: 'Feb 02, 2026',
        dataset: 'Satellite-Sentinel-2025',
        history: ['v0.8']
    },
    {
        id: '3',
        name: 'Soil Nutrient Model v2.1',
        status: 'active',
        accuracy: '91.8%',
        lastTrained: 'Jan 15, 2026',
        dataset: 'GroundSens-SL-2024',
        history: ['v2.0', 'v1.9']
    }
];

export default function ModelControlPanel() {
    const router = useRouter();
    const [models, setModels] = useState(MOCK_MODELS);

    const toggleStatus = (id: string) => {
        Alert.alert('Status Update', 'Change model deployment status?', [
            { text: 'Cancel' },
            {
                text: 'Confirm', onPress: () => {
                    setModels(models.map(m =>
                        m.id === id ? { ...m, status: m.status === 'active' ? 'disabled' : 'active' } : m
                    ));
                }
            }
        ]);
    };

    const handleRollback = (id: string) => {
        Alert.alert('Model Rollback', 'Roll back to the previous stable version?', [
            { text: 'Cancel' },
            { text: 'Rollback', style: 'destructive', onPress: () => Alert.alert('Success', 'Reverted to previous version.') }
        ]);
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                    <ChevronLeft size={24} color="#1E293B" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>AI Model Controls</Text>
                <TouchableOpacity style={styles.retrainBtn}>
                    <RefreshCw size={20} color="#3B82F6" />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {/* Step 5 Summary */}
                <View style={styles.summaryCard}>
                    <View style={styles.summaryItem}>
                        <Text style={styles.summaryLabel}>Total Active Models</Text>
                        <Text style={styles.summaryValue}>3</Text>
                    </View>
                    <View style={styles.summaryDivider} />
                    <View style={styles.summaryItem}>
                        <Text style={styles.summaryLabel}>Global Avg. Accuracy</Text>
                        <Text style={styles.summaryValue}>91.5%</Text>
                    </View>
                </View>

                <Text style={styles.sectionTitle}>Deployment Registry</Text>

                {models.map(model => (
                    <View key={model.id} style={styles.modelCard}>
                        <View style={styles.cardHeader}>
                            <View style={[styles.iconBox, { backgroundColor: model.status === 'active' ? '#F0FDF4' : model.status === 'testing' ? '#EFF6FF' : '#FEF2F2' }]}>
                                <Cpu size={24} color={model.status === 'active' ? '#10B981' : model.status === 'testing' ? '#3B82F6' : '#EF4444'} />
                            </View>
                            <View style={styles.modelMeta}>
                                <Text style={styles.modelName}>{model.name}</Text>
                                <View style={[styles.statusBadge, { backgroundColor: model.status === 'active' ? '#DCFCE7' : '#DBEAFE' }]}>
                                    <Text style={[styles.statusText, { color: model.status === 'active' ? '#166534' : '#1E40AF' }]}>{model.status.toUpperCase()}</Text>
                                </View>
                            </View>
                            <Switch
                                value={model.status === 'active'}
                                onValueChange={() => toggleStatus(model.id)}
                                trackColor={{ false: '#CBD5E1', true: '#10B981' }}
                            />
                        </View>

                        <View style={styles.divider} />

                        <View style={styles.statsRow}>
                            <View style={styles.statBox}>
                                <Text style={styles.miniLabel}>ACCURACY</Text>
                                <Text style={styles.miniValue}>{model.accuracy}</Text>
                            </View>
                            <View style={styles.statBox}>
                                <Text style={styles.miniLabel}>LAST TRAINED</Text>
                                <Text style={styles.miniValue}>{model.lastTrained}</Text>
                            </View>
                        </View>

                        <View style={styles.datasetInfo}>
                            <FlaskConical size={14} color="#64748B" />
                            <Text style={styles.datasetText}>{model.dataset}</Text>
                        </View>

                        <View style={styles.cardActions}>
                            <TouchableOpacity style={styles.rollbackBtn} onPress={() => handleRollback(model.id)}>
                                <History size={16} color="#EF4444" />
                                <Text style={styles.rollbackText}>Version Rollback</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.testBtn}>
                                <Activity size={16} color="#3B82F6" />
                                <Text style={styles.testText}>A/B Test</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}

                <View style={styles.warningBox}>
                    <AlertTriangle size={20} color="#B45309" />
                    <View style={{ flex: 1 }}>
                        <Text style={styles.warningTitle}>Model Governance Notice</Text>
                        <Text style={styles.warningText}>Switching production models impacts real-time field advice. Ensure A/B tests complete before disabling v1.2.</Text>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 60,
        paddingHorizontal: 16,
        paddingBottom: 20,
        backgroundColor: '#FFF',
    },
    backBtn: {
        padding: 8,
        borderRadius: 12,
        backgroundColor: '#F1F5F9',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1E293B',
    },
    retrainBtn: {
        padding: 8,
        borderRadius: 12,
        backgroundColor: '#EFF6FF',
    },
    content: {
        padding: 16,
        paddingBottom: 40,
    },
    summaryCard: {
        backgroundColor: '#1E293B',
        borderRadius: 20,
        padding: 20,
        flexDirection: 'row',
        marginBottom: 24,
    },
    summaryItem: {
        flex: 1,
        alignItems: 'center',
    },
    summaryLabel: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 10,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    summaryValue: {
        color: '#FFF',
        fontSize: 24,
        fontWeight: '900',
    },
    summaryDivider: {
        width: 1,
        height: '100%',
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1E293B',
        marginBottom: 16,
    },
    modelCard: {
        backgroundColor: '#FFF',
        borderRadius: 20,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    iconBox: {
        width: 44,
        height: 44,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modelMeta: {
        flex: 1,
    },
    modelName: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#1E293B',
        marginBottom: 4,
    },
    statusBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 6,
    },
    statusText: {
        fontSize: 9,
        fontWeight: '900',
    },
    divider: {
        height: 1,
        backgroundColor: '#F1F5F9',
        marginVertical: 16,
    },
    statsRow: {
        flexDirection: 'row',
        marginBottom: 12,
    },
    statBox: {
        flex: 1,
    },
    miniLabel: {
        fontSize: 9,
        color: '#64748B',
        fontWeight: 'bold',
        marginBottom: 4,
    },
    miniValue: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#334155',
    },
    datasetInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8FAFC',
        padding: 8,
        borderRadius: 8,
        gap: 8,
        marginBottom: 16,
    },
    datasetText: {
        fontSize: 11,
        color: '#64748B',
        fontWeight: '500',
    },
    cardActions: {
        flexDirection: 'row',
        gap: 12,
    },
    rollbackBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#FEE2E2',
        gap: 6,
    },
    rollbackText: {
        color: '#EF4444',
        fontSize: 12,
        fontWeight: 'bold',
    },
    testBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#DBEAFE',
        gap: 6,
    },
    testText: {
        color: '#3B82F6',
        fontSize: 12,
        fontWeight: 'bold',
    },
    warningBox: {
        flexDirection: 'row',
        backgroundColor: '#FFFBEB',
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#FEF3C7',
        gap: 12,
        marginTop: 8,
    },
    warningTitle: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#92400E',
    },
    warningText: {
        fontSize: 11,
        color: '#B45309',
        marginTop: 4,
        lineHeight: 16,
    },
});
