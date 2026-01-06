import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

import React from "react";

import DuginOkvirTekst from "../../components/DuginOkvirTekst";

import { Pressable, StyleSheet, Text, View } from "react-native";

export default function MenuScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <RainbowPillStatic label="ŠKOLA ŠALE - Eoks" />

      <Text style={styles.subtitle}>
        SMIJEH TI MIJENJA ŽIVOT.{"\n"}NAUČI HUMOR I OSVOJI SRCA BEZ ULAGANJA
      </Text>

      <DuginOkvirTekst tekst="BUDI DUHOVIT" fontSize={30} strokeWidth={2} />

      <View style={styles.columnsRow}>
        {/* LIJEVA KOLONA */}
        <View style={styles.sideColumn}>
          <CircleButton
            size="big"
            label="LEKCIJE I VJEŽBE"
            onPress={() => router.push("/lekcije")}
          />

          <CircleButton
            size="small"
            label={"SVEOBUHVATNE\nVJEŽBE"}
            onPress={() => {}}
            textStyle={{ fontSize: 10, textAlign: "center" }}
          />

          <CircleButton size="small" label="NAPREDAK" onPress={() => {}} />
          <CircleButton size="small" label="VICEVI" onPress={() => {}} />

          <CircleButton
            size="small"
            label={"PROIZVODNJA\nVICEVA"}
            onPress={() => {}}
            textStyle={{ fontSize: 10, textAlign: "center" }}
          />
        </View>

        {/* SREDINA – skroz dole */}
        <View style={styles.middleColumn}>
          <CircleButton size="mini" label="MUDROSTI" onPress={() => {}} />
          <CircleButton size="mini" label="UBACI VIC" onPress={() => {}} />
        </View>

        {/* DESNA KOLONA */}
        <View style={styles.sideColumn}>
          <UpitDuhovitButton onPress={() => {}} />

          <CircleButton
            size="small"
            label={"ISTORIJA DOGAĐAJA\nI ODGOVORA"}
            onPress={() => {}}
            textStyle={{ fontSize: 12, textAlign: "center", marginTop: -10 }}
          />

          <CircleButton
            size="small"
            label="BAZA SMIJEŠNIH PRIMJERA"
            onPress={() => {}}
            textStyle={{ textAlign: "center", marginTop: -10 }}
          />

          <CircleButton
            size="small"
            label="BAZA SPREMNIH REČENICA"
            onPress={() => {}}
            textStyle={{ textAlign: "center", marginTop: -10 }}
          />

          <CircleButton
            size="small"
            label="MOJA BIBLIOTEKA"
            onPress={() => {}}
          />
        </View>
      </View>

      {/* SUFLER – lebdeće dugme (potpuno posebno, nije u koloni i nije u drugom dugmetu) */}
      <Pressable
        onPress={() => router.push("/sufler")}

        style={styles.suflerFloating}
      >
        <Text style={styles.suflerText}>SUFLER</Text>
      </Pressable>
    </View>
  );
}

/* =======================
   KOMPONENTE
   ======================= */

const BORDER = 3;

function RainbowBorder({
  children,
  style,
}: {
  children: React.ReactNode;
  style: any;
}) {
  return (
    <LinearGradient
      colors={[
        "#ff004c",
        "#ff7a00",
        "#ffd000",
        "#2dff6a",
        "#00c2ff",
        "#7a00ff",
        "#ff00d4",
      ]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={style}
    >
      {children}
    </LinearGradient>
  );
}

/* “ŠKOLA ŠALE” ostaje elipsa */
function RainbowPillStatic({ label }: { label: string }) {
  return (
    <RainbowBorder style={styles.topPillBorder}>
      <View style={styles.topPillInner}>
        <Text style={styles.topPillText}>{label}</Text>
      </View>
    </RainbowBorder>
  );
}

type CircleSize = "big" | "small" | "mini";

type CircleButtonProps = {
  label: string;
  size: CircleSize;
  onPress: () => void;
};

/* SVA ostala dugmad: KRUGOVI + max 2 reda teksta */
function CircleButton({
  label,
  size,
  onPress,
  textStyle,
}: CircleButtonProps & { textStyle?: any }) {
  const outerSize =
    size === "big"
      ? styles.circleBig
      : size === "small"
      ? styles.circleSmall
      : styles.circleMini;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.circleWrap, pressed && styles.pressed]}
    >
      <RainbowBorder style={[styles.circleBorderBase, outerSize]}>
        <View style={styles.circleInner}>
          <Text
            style={[
              styles.circleText,
              size === "big"
                ? styles.circleTextBig
                : size === "small"
                ? styles.circleTextSmall
                : styles.circleTextMini,
              textStyle,
            ]}
            numberOfLines={3}
            adjustsFontSizeToFit
            minimumFontScale={0.82}
          >
            {label}
          </Text>
        </View>
      </RainbowBorder>
    </Pressable>
  );
}

/* SPEC: UPIT dugme */
function UpitDuhovitButton({ onPress }: { onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.circleWrap, pressed && styles.pressed]}
    >
      <RainbowBorder style={[styles.circleBorderBase, styles.circleBig]}>
        <View style={styles.circleInner}>
          <View style={styles.upitStack}>
            <Text
              style={styles.upitTop}
              numberOfLines={1}
              minimumFontScale={0.85}
            >
              UPIT
            </Text>

            <Text
              style={styles.upitMid}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.85}
            >
              - DUHOVIT
            </Text>

            <Text
              style={styles.upitBot}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.85}
            >
              ODGOVOR
            </Text>
          </View>
        </View>
      </RainbowBorder>
    </Pressable>
  );
}

/* =======================
   STILOVI
   ======================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#6b3a1e",
    paddingTop: 23,
    paddingHorizontal: 12,
    alignItems: "center",
  },

  subtitle: {
    marginTop: 10,
    maxWidth: 400,
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
    textAlign: "center",
    lineHeight: 18,
    opacity: 0.95,
  },

  mainTitle: {
    marginTop: 8,
    marginBottom: 8,
    color: "#fff",
    fontSize: 30,
    fontWeight: "900",
    letterSpacing: 1,
    textAlign: "center",
  },

  columnsRow: {
    marginTop: -10,
    width: "100%",
    maxWidth: 430,
    flexDirection: "row",
    gap: 10,
    alignItems: "flex-start",
  },

  sideColumn: {
    flex: 1,
    gap: 1,
    alignItems: "center",
  },

  middleColumn: {
    width: "22%",
    marginTop: "auto",
    paddingBottom: 18,
    gap: 10,
    alignItems: "center",
  },

  pressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.9,
  },

  /* ===== TOP ELIPSA ===== */
  topPillBorder: {
    width: "100%",
    maxWidth: 430,
    height: 74,
    padding: BORDER,
    borderRadius: 9999,
    overflow: "hidden",
  },
  topPillInner: {
    flex: 1,
    backgroundColor: "#000",
    borderRadius: 9999,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
  },
  topPillText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "800",
    textAlign: "center",
  },

  /* ===== KRUGOVI ===== */
  circleWrap: {
    alignSelf: "center",
  },

  circleBorderBase: {
    padding: BORDER,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },

  circleBig: {
    width: 122,
    height: 122,
    borderRadius: 61,
  },
  circleSmall: {
    width: 110,
    height: 110,
    borderRadius: 55,
  },
  circleMini: {
    width: 98,
    height: 98,
    borderRadius: 49,
  },

  circleInner: {
    width: "100%",
    height: "100%",
    backgroundColor: "#000",
    borderRadius: 9999,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
  },

  circleText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "900",
  },
  circleTextBig: {
    fontSize: 15,
    lineHeight: 16,
  },
  circleTextSmall: {
    fontSize: 13,
    lineHeight: 16,
  },
  circleTextMini: {
    fontSize: 12,
    lineHeight: 13,
  },

  /* ===== UPIT SPEC ===== */
  upitStack: {
    alignItems: "center",
    transform: [{ translateY: -8 }],
  },
  upitTop: {
    color: "#fff",
    fontSize: 18,
    lineHeight: 19,
    fontWeight: "900",
    textAlign: "center",
  },
  upitMid: {
    color: "#fff",
    fontSize: 15,
    lineHeight: 16,
    fontWeight: "900",
    textAlign: "center",
    marginTop: 5,
  },
  upitBot: {
    color: "#fff",
    fontSize: 14,
    lineHeight: 15,
    fontWeight: "900",
    textAlign: "center",
    marginTop: 1,
  },

  /* ===== SUFLER FLOATING (NEZAVISNO DUGME) ===== */
  suflerFloating: {
    position: "absolute",
    right: 16,
    bottom: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 999,
    backgroundColor: "black",
  },
  suflerText: {
    color: "white",
    fontWeight: "700",
  },
});
