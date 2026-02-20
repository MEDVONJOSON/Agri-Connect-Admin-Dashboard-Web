import React from 'react';
import { Pressable, StyleProp, ViewStyle, Text, StyleSheet, TextStyle, Platform } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import Colors from '../../constants/Colors';

interface AnimatedButtonProps {
    onPress: () => void;
    children?: React.ReactNode;
    style?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
    title?: string;
    variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    haptic?: 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error';
    disabled?: boolean;
}

export const AnimatedButton: React.FC<AnimatedButtonProps> = ({
    onPress,
    children,
    style,
    textStyle,
    title,
    variant = 'primary',
    size = 'md',
    haptic = 'light',
    disabled = false
}) => {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: scale.value }],
        };
    });

    const handlePressIn = () => {
        if (disabled) return;
        scale.value = withSpring(0.95, { damping: 10, stiffness: 300 });
    };

    const handlePressOut = () => {
        if (disabled) return;
        scale.value = withSpring(1, { damping: 10, stiffness: 300 });
    };

    const handlePress = () => {
        if (disabled) return;

        switch (haptic) {
            case 'light': Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); break;
            case 'medium': Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); break;
            case 'heavy': Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy); break;
            case 'success': Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); break;
            case 'warning': Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning); break;
            case 'error': Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error); break;
        }

        onPress();
    };

    const getVariantStyle = () => {
        if (disabled) return styles.disabled;
        switch (variant) {
            case 'primary': return styles.primary;
            case 'secondary': return styles.secondary;
            case 'outline': return styles.outline;
            case 'danger': return styles.danger;
            case 'ghost': return styles.ghost;
            default: return styles.primary;
        }
    };

    const getTextStyle = () => {
        if (disabled) return styles.disabledText;
        switch (variant) {
            case 'primary': return styles.primaryText;
            case 'secondary': return styles.secondaryText;
            case 'outline': return styles.outlineText;
            case 'danger': return styles.dangerText;
            case 'ghost': return styles.ghostText;
            default: return styles.primaryText;
        }
    };

    const getSizeStyle = () => {
        switch (size) {
            case 'sm': return styles.sm;
            case 'md': return styles.md;
            case 'lg': return styles.lg;
            default: return styles.md;
        }
    };

    return (
        <Pressable
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={handlePress}
            disabled={disabled}
        >
            <Animated.View style={[styles.base, getSizeStyle(), getVariantStyle(), style, animatedStyle]}>
                {title ? (
                    <Text style={[styles.baseText, getTextStyle(), textStyle]}>{title}</Text>
                ) : (
                    children
                )}
            </Animated.View>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    base: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 12,
        overflow: 'hidden',
    },
    baseText: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    /* Sizes */
    sm: { paddingVertical: 8, paddingHorizontal: 12 },
    md: { paddingVertical: 12, paddingHorizontal: 16 },
    lg: { paddingVertical: 16, paddingHorizontal: 24 },
    /* Variants */
    primary: { backgroundColor: Colors.primary },
    primaryText: { color: '#fff' },
    secondary: { backgroundColor: '#F3F4F6' },
    secondaryText: { color: '#1F2937' },
    outline: { backgroundColor: 'transparent', borderWidth: 1, borderColor: '#D1D5DB' },
    outlineText: { color: '#374151' },
    danger: { backgroundColor: '#EF4444' },
    dangerText: { color: '#fff' },
    ghost: { backgroundColor: 'transparent' },
    ghostText: { color: Colors.primary },
    disabled: { backgroundColor: '#E5E7EB', opacity: 0.7 },
    disabledText: { color: '#9CA3AF' },
});
