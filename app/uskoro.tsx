import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function UskoroScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ title?: string }>();
  const title = String(params?.title ?? "Ova sekcija");

  return (
    <View style={styles.container}>
      <Text style={styles.h1}>USKORO</Text>

      <Text style={styles.title}>{title}</Text>

      <Text style={styles.body}>
        Ovdje uskoro dodajemo sadržaj.{"\n"}
        Za sada je bitno da sve radi stabilno i da se lako vraćaš nazad.
      </Text>

      <Pressable onPress={() => router.back()} style={styles.btn}>
        <Text style={styles.btnText}>Nazad</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#6b3a1e",
    paddingTop: 50,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  h1: {
    color: "white",
    fontSize: 30,
    fontWeight: "900",
    letterSpacing: 1,
    marginBottom: 10,
  },
  title: {
    color: "white",
    fontSize: 16,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 12,
    opacity: 0.95,
  },
  body: {
    color: "white",
    fontSize: 15,
    lineHeight: 19,
    textAlign: "center",
    opacity: 0.9,
    maxWidth: 420,
    marginBottom: 18,
  },
  btn: {
    marginTop: 8,
    backgroundColor: "black",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 999,
  },
  btnText: {
    color: "white",
    fontWeight: "800",
  },
});
