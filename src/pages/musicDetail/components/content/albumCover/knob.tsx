import React, { useRef, useMemo } from "react";
import { View, StyleSheet } from "react-native";
import Svg, { Circle, Line, G, Text as SvgText, Defs, ClipPath } from "react-native-svg";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import TrackPlayer, { useProgress, useCurrentMusic } from "@/core/trackPlayer";
import rpx from "@/utils/rpx";
import timeformat from "@/utils/timeformat";
import { ImgAsset } from "@/constants/assetsConst";
import FastImage from "@/components/base/fastImage";
import useColors from "@/hooks/useColors";

const KNOB_SIZE = rpx(500);
const CENTER = KNOB_SIZE / 2;
const OUTER_R = CENTER - rpx(8);
const TICK_OUTER = OUTER_R - rpx(8);
const TICK_INNER_SHORT = TICK_OUTER - rpx(20);
const TICK_INNER_LONG = TICK_OUTER - rpx(36);
const ALBUM_R = CENTER - rpx(100);
const INDICATOR_W = rpx(6);

function polarToCartesian(angle: number, radius: number) {
    const rad = ((angle - 90) * Math.PI) / 180;
    return {
        x: CENTER + radius * Math.cos(rad),
        y: CENTER + radius * Math.sin(rad),
    };
}

interface TickMark {
    angle: number;
    isLong: boolean;
    label: string;
}

function generateTicks(duration: number): TickMark[] {
    if (duration <= 0) return [];
    const ticks: TickMark[] = [];
    const totalSeconds = Math.floor(duration);
    const maxTicks = 120;
    let interval = Math.max(5, Math.ceil(totalSeconds / maxTicks));
    interval = Math.ceil(interval / 5) * 5;

    for (let sec = 0; sec <= totalSeconds; sec += interval) {
        const angle = (sec / totalSeconds) * 360;
        const isLong = sec % 60 === 0 || sec === 0;
        ticks.push({
            angle,
            isLong: isLong || sec === totalSeconds,
            label: isLong ? timeformat(sec) : "",
        });
    }
    return ticks;
}

export default function Knob() {
    const progress = useProgress(200);
    const musicItem = useCurrentMusic();
    const colors = useColors();
    const seekRef = useRef(0);
    const lastAngleRef = useRef<number | null>(null);
    const totalRotationRef = useRef(0);

    const ticks = useMemo(
        () => generateTicks(progress.duration),
        [progress.duration]
    );

    const progressAngle = useMemo(() => {
        if (progress.duration <= 0) return 0;
        return (progress.position / progress.duration) * 360;
    }, [progress.position, progress.duration]);

    const indicatorPoints = useMemo(() => {
        const radius = TICK_OUTER - rpx(4);
        const rad = ((progressAngle - 90) * Math.PI) / 180;
        const cx = CENTER;
        const cy = CENTER;
        const x1 = cx + (radius - rpx(18)) * Math.cos(rad);
        const y1 = cy + (radius - rpx(18)) * Math.sin(rad);
        const x2 = cx + radius * Math.cos(rad);
        const y2 = cy + radius * Math.sin(rad);
        return { x1, y1, x2, y2 };
    }, [progressAngle]);

    const panGesture = Gesture.Pan()
        .onBegin((e) => {
            const dx = e.x - CENTER;
            const dy = e.y - CENTER;
            lastAngleRef.current = Math.atan2(dy, dx) * (180 / Math.PI);
            totalRotationRef.current = 0;
        })
        .onUpdate((e) => {
            if (progress.duration <= 0) return;
            const dx = e.x - CENTER;
            const dy = e.y - CENTER;
            const currentAngle = Math.atan2(dy, dx) * (180 / Math.PI);

            if (lastAngleRef.current !== null) {
                let delta = currentAngle - lastAngleRef.current;
                if (delta > 180) delta -= 360;
                if (delta < -180) delta += 360;
                totalRotationRef.current += delta;
            }
            lastAngleRef.current = currentAngle;

            const seekSeconds =
                progress.position +
                (totalRotationRef.current / 360) * progress.duration;
            const clamped = Math.max(0, Math.min(seekSeconds, progress.duration - 0.5));
            seekRef.current = clamped;
            TrackPlayer.seekTo(clamped);
        })
        .onEnd(() => {
            lastAngleRef.current = null;
            if (seekRef.current > 0) {
                TrackPlayer.seekTo(seekRef.current);
            }
        })
        .runOnJS(true);

    return (
        <View style={styles.container}>
            <GestureDetector gesture={panGesture}>
                <View style={styles.knobArea}>
                    <Svg width={KNOB_SIZE} height={KNOB_SIZE}>
                        <Defs>
                            <ClipPath id="albumClip">
                                <Circle cx={CENTER} cy={CENTER} r={ALBUM_R} />
                            </ClipPath>
                        </Defs>
                        {/* Knob body */}
                        <Circle
                            cx={CENTER}
                            cy={CENTER}
                            r={OUTER_R}
                            fill={colors.primary + "22"}
                            stroke={colors.primary}
                            strokeWidth={rpx(3)}
                        />
                        {/* Outer ring */}
                        <Circle
                            cx={CENTER}
                            cy={CENTER}
                            r={TICK_OUTER}
                            fill="none"
                            stroke={colors.text + "44"}
                            strokeWidth={rpx(1)}
                        />
                        {/* Tick marks */}
                        {ticks.map((tick, i) => {
                            const outer = polarToCartesian(tick.angle, TICK_OUTER);
                            const innerR = tick.isLong ? TICK_INNER_LONG : TICK_INNER_SHORT;
                            const inner = polarToCartesian(tick.angle, innerR);
                            const labelPos = polarToCartesian(tick.angle, TICK_INNER_LONG - rpx(22));
                            return (
                                <G key={i}>
                                    <Line
                                        x1={inner.x}
                                        y1={inner.y}
                                        x2={outer.x}
                                        y2={outer.y}
                                        stroke={colors.text}
                                        strokeWidth={tick.isLong ? rpx(2) : rpx(1)}
                                    />
                                    {tick.isLong && tick.label ? (
                                        <SvgText
                                            x={labelPos.x}
                                            y={labelPos.y}
                                            fill={colors.text}
                                            fontSize={rpx(16)}
                                            textAnchor="middle"
                                            alignmentBaseline="middle"
                                        >
                                            {tick.label}
                                        </SvgText>
                                    ) : null}
                                </G>
                            );
                        })}
                        {/* Progress arc */}
                        {progress.duration > 0 && (
                            <Circle
                                cx={CENTER}
                                cy={CENTER}
                                r={TICK_OUTER}
                                fill="none"
                                stroke={colors.primary}
                                strokeWidth={rpx(3)}
                                strokeDasharray={`${
                                    (progressAngle / 360) * 2 * Math.PI * TICK_OUTER
                                } ${2 * Math.PI * TICK_OUTER}`}
                                rotation={-90}
                                origin={`${CENTER}, ${CENTER}`}
                            />
                        )}
                        {/* Progress indicator */}
                        <Line
                            x1={indicatorPoints.x1}
                            y1={indicatorPoints.y1}
                            x2={indicatorPoints.x2}
                            y2={indicatorPoints.y2}
                            stroke={colors.primary}
                            strokeWidth={INDICATOR_W}
                            strokeLinecap="round"
                        />
                    </Svg>
                    {/* Album art overlay */}
                    <FastImage
                        style={{
                            position: "absolute",
                            width: ALBUM_R * 2,
                            height: ALBUM_R * 2,
                            borderRadius: ALBUM_R,
                            top: CENTER - ALBUM_R,
                            left: CENTER - ALBUM_R,
                        }}
                        source={musicItem?.artwork}
                        placeholderSource={ImgAsset.albumDefault}
                    />
                </View>
            </GestureDetector>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
    },
    knobArea: {
        width: KNOB_SIZE,
        height: KNOB_SIZE,
        position: "relative" as const,
    },
});