import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated, Dimensions } from "react-native";
import Svg, { Circle, Ellipse, Path, G, Rect, Defs, LinearGradient, Stop, Text as SvgText } from "react-native-svg";

const { width: SW, height: SH } = Dimensions.get("window");
const CX = SW / 2;
const CY = SH * 0.38;

interface Props {
    onFinish?: () => void;
}

export default function SplashScreen({ onFinish }: Props) {
    const fadeAnim = useRef(new Animated.Value(1)).current;
    const scaleAnim = useRef(new Animated.Value(0.9)).current;

    useEffect(() => {
        Animated.spring(scaleAnim, { toValue: 1, friction: 6, tension: 40, useNativeDriver: true }).start();
        const t = setTimeout(() => {
            Animated.timing(fadeAnim, { toValue: 0, duration: 400, useNativeDriver: true }).start(() => onFinish?.());
        }, 2000);
        return () => clearTimeout(t);
    }, []);

    return (
        <Animated.View style={[st.container, { opacity: fadeAnim }]}>
            <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                <Svg width={SW} height={SH}>
                    <Defs>
                        <LinearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
                            <Stop offset="0" stopColor="#1a1a2e" />
                            <Stop offset="1" stopColor="#16213e" />
                        </LinearGradient>
                        <LinearGradient id="hp" x1="0" y1="0" x2="1" y2="1">
                            <Stop offset="0" stopColor="#e94560" />
                            <Stop offset="1" stopColor="#ff6b81" />
                        </LinearGradient>
                    </Defs>
                    <Rect width={SW} height={SH} fill="url(#bg)" />
                    <G opacity={0.3}>
                        <SvgText x={CX - 130} y={CY - 160} fill="#e94560" fontSize={32} fontWeight="bold">{"♪"}</SvgText>
                        <SvgText x={CX - 160} y={CY - 80} fill="#ff6b81" fontSize={24}>{"♫"}</SvgText>
                        <SvgText x={CX + 110} y={CY - 170} fill="#e94560" fontSize={28}>{"♫"}</SvgText>
                        <SvgText x={CX + 140} y={CY - 70} fill="#ff6b81" fontSize={36} fontWeight="bold">{"♪"}</SvgText>
                    </G>
                    <G>
                        <Ellipse cx={CX} cy={CY + 170} rx={45} ry={55} fill="#2d2d5e" />
                        <Circle cx={CX} cy={CY + 70} r={48} fill="#ffeaa7" />
                        <Path d={"M" + (CX - 44) + " " + (CY + 40) + " Q" + (CX - 40) + " " + (CY + 5) + " " + CX + " " + (CY + 20) + " Q" + (CX + 40) + " " + (CY + 5) + " " + (CX + 44) + " " + (CY + 40)} fill="#2d3436" />
                        <Circle cx={CX - 16} cy={CY + 60} r={5} fill="#2d3436" />
                        <Circle cx={CX + 16} cy={CY + 60} r={5} fill="#2d3436" />
                        <Circle cx={CX - 14} cy={CY + 58} r={1.5} fill="white" />
                        <Circle cx={CX + 18} cy={CY + 58} r={1.5} fill="white" />
                        <Ellipse cx={CX - 28} cy={CY + 68} rx={8} ry={4} fill="#fab1a0" opacity={0.6} />
                        <Ellipse cx={CX + 28} cy={CY + 68} rx={8} ry={4} fill="#fab1a0" opacity={0.6} />
                        <Path d={"M" + (CX - 8) + " " + (CY + 78) + " Q" + CX + " " + (CY + 86) + " " + (CX + 8) + " " + (CY + 78)} fill="none" stroke="#2d3436" strokeWidth={2} strokeLinecap="round" />
                        <Path d={"M" + (CX - 38) + " " + (CY + 44) + " Q" + CX + " " + (CY + 8) + " " + (CX + 38) + " " + (CY + 44)} fill="none" stroke="url(#hp)" strokeWidth={6} strokeLinecap="round" />
                        <Rect x={CX - 52} y={CY + 30} width={18} height={30} rx={9} fill="url(#hp)" />
                        <Rect x={CX + 34} y={CY + 30} width={18} height={30} rx={9} fill="url(#hp)" />
                        <Rect x={CX - 48} y={CY + 35} width={10} height={20} rx={5} fill="#1a1a2e" />
                        <Rect x={CX + 38} y={CY + 35} width={10} height={20} rx={5} fill="#1a1a2e" />
                    </G>
                    <SvgText x={CX} y={CY + 270} fill="#e94560" fontSize={36} fontWeight="bold" textAnchor="middle">{"板板music"}</SvgText>
                    <SvgText x={CX} y={CY + 310} fill="#a0a0c0" fontSize={14} textAnchor="middle">{"享受每一个音符"}</SvgText>
                </Svg>
            </Animated.View>
        </Animated.View>
    );
}

const st = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "#1a1a2e",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
        elevation: 9999,
    },
});
