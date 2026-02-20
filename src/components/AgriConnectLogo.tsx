import React, { useEffect, useRef } from 'react';
import { View, Animated, Easing } from 'react-native';
import Svg, { Circle, Path, Defs, LinearGradient, Stop, G } from 'react-native-svg';

interface LogoProps {
    width?: number;
    height?: number;
}

export default function AgriConnectLogo({ width = 120, height = 120 }: LogoProps) {
    const pulseAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        const pulse = Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.05,
                    duration: 2000,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 2000,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
            ])
        );
        pulse.start();
        return () => pulse.stop();
    }, []);

    return (
        <Animated.View style={{
            width,
            height,
            alignItems: 'center',
            justifyContent: 'center',
            transform: [{ scale: pulseAnim }]
        }}>
            <Svg width={width} height={height} viewBox="0 0 100 100" fill="none">
                <Defs>
                    {/* Background Gradient */}
                    <LinearGradient id="bgGrad" x1="0" y1="0" x2="1" y2="1">
                        <Stop offset="0" stopColor="#0f172a" stopOpacity="1" />
                        <Stop offset="1" stopColor="#020617" stopOpacity="1" />
                    </LinearGradient>

                    {/* Glow Gradient */}
                    <LinearGradient id="glowGrad" x1="0" y1="0" x2="1" y2="1">
                        <Stop offset="0" stopColor="#4ade80" stopOpacity="0.3" />
                        <Stop offset="1" stopColor="#22c55e" stopOpacity="0" />
                    </LinearGradient>

                    {/* Leaf Gradient */}
                    <LinearGradient id="leafGrad" x1="0" y1="0" x2="1" y2="1">
                        <Stop offset="0" stopColor="#86efac" />
                        <Stop offset="0.5" stopColor="#22c55e" />
                        <Stop offset="1" stopColor="#15803d" />
                    </LinearGradient>

                    {/* Vein Gradient */}
                    <LinearGradient id="veinGrad" x1="0" y1="0" x2="1" y2="1">
                        <Stop offset="0" stopColor="#ffffff" stopOpacity="0.4" />
                        <Stop offset="1" stopColor="#ffffff" stopOpacity="0.1" />
                    </LinearGradient>
                </Defs>

                {/* Background Circle */}
                <Circle cx="50" cy="50" r="50" fill="url(#bgGrad)" />

                {/* Glow Circle */}
                <Circle cx="50" cy="50" r="35" fill="url(#glowGrad)" />

                {/* Leaf Group */}
                <G rotation="-15" origin="50, 50">
                    <Path
                        d="M35 75 Q 20 40 45 20 Q 70 20 80 45 Q 80 70 35 75 Z"
                        fill="url(#leafGrad)"
                        stroke="#4ade80"
                        strokeWidth="0.5"
                    />
                    <Path
                        d="M35 75 Q 50 50 80 45"
                        stroke="url(#veinGrad)"
                        strokeWidth="2"
                        strokeLinecap="round"
                        fill="none"
                    />
                    <Path
                        d="M45 25 Q 55 25 60 35"
                        stroke="#fff"
                        strokeWidth="2"
                        strokeLinecap="round"
                        opacity="0.5"
                    />
                </G>
            </Svg>
        </Animated.View>
    );
}
