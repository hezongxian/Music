import React, { useMemo } from "react";
import rpx from "@/utils/rpx";
import FastImage from "@/components/base/fastImage";
import useOrientation from "@/hooks/useOrientation";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { useCurrentMusic } from "@/core/trackPlayer";
import globalStyle from "@/constants/globalStyle";
import { View } from "react-native";
import Operations from "./operations";
import Knob from "./knob";
import { showPanel } from "@/components/panels/usePanel.ts";
import { ImgAsset } from "@/constants/assetsConst";

interface IProps {
    onTurnPageClick?: () => void;
}

export default function AlbumCover(props: IProps) {
    const { onTurnPageClick } = props;
    const musicItem = useCurrentMusic();
    const orientation = useOrientation();

    const artworkStyle = useMemo(() => {
        if (orientation === "vertical") {
            return { width: rpx(500), height: rpx(500) };
        } else {
            return { width: rpx(260), height: rpx(260) };
        }
    }, [orientation]);

    const longPress = Gesture.LongPress()
        .onStart(() => {
            if (musicItem?.artwork) {
                showPanel("ImageViewer", { url: musicItem.artwork });
            }
        })
        .runOnJS(true);

    const tap = Gesture.Tap()
        .onStart(() => { onTurnPageClick?.(); })
        .runOnJS(true);

    const combineGesture = Gesture.Race(tap, longPress);

    return (
        <>
            <GestureDetector gesture={combineGesture}>
                <Knob />
            </GestureDetector>
            <Operations />
        </>
    );
}