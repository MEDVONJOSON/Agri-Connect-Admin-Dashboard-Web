import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    Alert,
    ActivityIndicator,
    ImageBackground
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import Colors from '../../constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import { ShieldCheck, Lock, Mail, ChevronRight } from '../../components/icons';
import { AnimatedButton } from '../../components/ui/AnimatedButton';

export default function AdminLoginScreen() {
    const router = useRouter();
    const { login } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    // Pre-fill for demo convenience (optional, or can be empty)
    // const [email, setEmail] = useState('admin@agriconnect.sl');

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        // Basic client-side validation for "admin" domain to simulate security
        if (!email.includes('@agriconnect.sl')) {
            Alert.alert('Access Denied', 'This portal is restricted to AgriConnect staff only.');
            return;
        }

        setLoading(true);
        try {
            // Role is hardcoded to 'super_admin' or 'admin' for this portal
            const success = await login(email, password, 'admin');
            if (success) {
                router.replace('/admin');
            } else {
                Alert.alert('Login Failed', 'Invalid credentials or unauthorized access.');
            }
        } catch (error) {
            Alert.alert('Error', 'An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#0F172A', '#1E293B']}
                style={styles.background}
            />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <View style={styles.logoSection}>
                    <View style={styles.iconCircle}>
                        <ShieldCheck size={40} color="#3B82F6" />
                    </View>
                    <Text style={styles.title}>Admin Portal</Text>
                    <Text style={styles.subtitle}>Authorized Personnel Only</Text>
                </View>

                <View style={styles.formContainer}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Staff Email</Text>
                        <View style={styles.inputWrapper}>
                            <Mail size={20} color="#64748B" />
                            <TextInput
                                style={styles.input}
                                placeholder="admin@agriconnect.sl"
                                placeholderTextColor="#475569"
                                value={email}
                                onChangeText={setEmail}
                                autoCapitalize="none"
                                keyboardType="email-address"
                            />
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Password</Text>
                        <View style={styles.inputWrapper}>
                            <Lock size={20} color="#64748B" />
                            <TextInput
                                style={styles.input}
                                placeholder="••••••••"
                                placeholderTextColor="#475569"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                            />
                        </View>
                    </View>

                    <AnimatedButton
                        style={styles.loginBtn}
                        onPress={handleLogin}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <>
                                <Text style={styles.loginText}>Access Dashboard</Text>
                                <ChevronRight size={20} color="#fff" />
                            </>
                        )}
                    </AnimatedButton>

                    <TouchableOpacity style={styles.backLink} onPress={() => router.replace('/(auth)/login' as any)}>
                        <Text style={styles.backText}>Return to Main App</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>Secured by AgriConnect Governance</Text>
                    <Text style={styles.versionText}>v1.2.0-admin</Text>
                </View>

            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0F172A',
    },
    background: {
        ...StyleSheet.absoluteFillObject,
    },
    keyboardView: {
        flex: 1,
        justifyContent: 'center',
        padding: 24,
    },
    logoSection: {
        alignItems: 'center',
        marginBottom: 40,
    },
    iconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        borderWidth: 1,
        borderColor: 'rgba(59, 130, 246, 0.3)',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
        letterSpacing: 0.5,
    },
    subtitle: {
        fontSize: 14,
        color: '#94A3B8',
        marginTop: 8,
        letterSpacing: 1,
        textTransform: 'uppercase',
        fontWeight: '600',
    },
    formContainer: {
        backgroundColor: 'rgba(30, 41, 59, 0.7)',
        padding: 24,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
        gap: 20,
    },
    inputGroup: {
        gap: 8,
    },
    label: {
        color: '#CBD5E1',
        fontSize: 14,
        fontWeight: '600',
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#0F172A',
        borderRadius: 12,
        paddingHorizontal: 16,
        height: 56,
        borderWidth: 1,
        borderColor: '#334155',
        gap: 12,
    },
    input: {
        flex: 1,
        color: '#fff',
        fontSize: 16,
    },
    loginBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#3B82F6',
        height: 56,
        borderRadius: 16,
        gap: 8,
        marginTop: 8,
    },
    loginText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    backLink: {
        alignItems: 'center',
        marginTop: 16,
    },
    backText: {
        color: '#64748B',
        fontSize: 14,
    },
    footer: {
        position: 'absolute',
        bottom: 40,
        left: 0,
        right: 0,
        alignItems: 'center',
        gap: 4,
    },
    footerText: {
        color: '#475569',
        fontSize: 12,
        fontWeight: '500',
    },
    versionText: {
        color: '#334155',
        fontSize: 10,
    },
});
