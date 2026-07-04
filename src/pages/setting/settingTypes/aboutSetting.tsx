import React from "react";
import { Image, StyleSheet, View } from "react-native";
import rpx from "@/utils/rpx";
import { ImgAsset } from "@/constants/assetsConst";
import ThemeText from "@/components/base/themeText";

export default function AboutSetting() {
    return (
        <View style={style.wrapper}>
            <View style={style.header}>
                <ThemeText fontSize="title" fontWeight="bold" style={style.title}>
                    联系宪哥
                </ThemeText>
                <ThemeText style={style.desc}>
                    扫描下方二维码添加微信
                </ThemeText>
                <Image
                    source={ImgAsset.wechatQR}
                    style={style.qrCode}
                    resizeMode="contain"
                />
                <ThemeText style={style.name}>
                    宪哥
                </ThemeText>
            </View>
        </View>
    );
}

const style = StyleSheet.create({
    wrapper: {
        width: "100%",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    header: {
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: rpx(48),
    },
    title: {
        marginBottom: rpx(24),
    },
    desc: {
        marginBottom: rpx(48),
    },
    qrCode: {
        width: rpx(440),
        height: rpx(440),
        borderRadius: rpx(16),
    },
    name: {
        marginTop: rpx(32),
        fontWeight: "bold",
    },
});
