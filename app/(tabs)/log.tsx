// app/log.tsx
import { useLocalSearchParams, usePathname, useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { Platform, Pressable, ScrollView, Text, View } from "react-native";

export default function LogScreen() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useLocalSearchParams();

  const [logs, setLogs] = useState<string[]>([
    `Log screen opened ✅`,
    `Path: ${pathname}`,
    `Platform: ${Platform.OS}`,
  ]);

  const paramsPretty = useMemo(() => {
    try {
      return JSON.stringify(params ?? {}, null, 2);
    } catch {
      return String(params ?? {});
    }
  }, [params]);

  const addLog = (msg: string) => {
    const ts = new Date().toLocaleTimeString();
    setLogs((prev) => [`[${ts}] ${msg}`, ...prev]);
  };

  const clearLogs = () => setLogs([]);

  return (
    <View style={{ flex: 1, padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 22, fontWeight: "700" }}>LOG</Text>

      <View style={{ gap: 8 }}>
        <Text style={{ opacity: 0.8 }}>
          Trenutna ruta: <Text style={{ fontWeight: "700" }}>{pathname}</Text>
        </Text>

        <Text style={{ opacity: 0.8 }}>
          Params:
        </Text>
        <View
          style={{
            borderWidth: 1,
            borderColor: "#00000022",
            borderRadius: 12,
            padding: 12,
          }}
        >
          <Text style={{ fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace" }}>
            {paramsPretty}
          </Text>
        </View>
      </View>

      <View style={{ flexDirection: "row", gap: 10, flexWrap: "wrap" }}>
        <Btn
          label="➕ Dodaj test log"
          onPress={() => addLog("Test log (klik)")}
        />
        <Btn
          label="🧹 Očisti"
          onPress={() => {
            clearLogs();
            addLog("Logs cleared");
          }}
        />
        <Btn
          label="⬅️ Nazad"
          onPress={() => {
            addLog("Back pressed");
            router.back();
          }}
        />
        <Btn
          label="🏠 Uvod"
          onPress={() => {
            addLog("Go to /uvod");
            router.push("/uvod");
          }}
        />
        <Btn
          label="📚 Lekcije"
          onPress={() => {
            addLog("Go to /lekcije");
            router.push("/lekcije");
          }}
        />
      </View>

      <Text style={{ fontSize: 16, fontWeight: "700", marginTop: 4 }}>
        Logovi ({logs.length})
      </Text>

      <ScrollView
        style={{
          flex: 1,
          borderWidth: 1,
          borderColor: "#00000022",
          borderRadius: 12,
          padding: 12,
        }}
      >
        {logs.length === 0 ? (
          <Text style={{ opacity: 0.6 }}>Nema logova.</Text>
        ) : (
          logs.map((l, idx) => (
            <Text
              key={`${l}-${idx}`}
              style={{
                marginBottom: 8,
                fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
              }}
            >
              {l}
            </Text>
          ))
        )}
      </ScrollView>
    </View>
  );
}

function Btn({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#00000033",
        backgroundColor: pressed ? "#00000010" : "white",
      })}
    >
      <Text style={{ fontWeight: "700" }}>{label}</Text>
    </Pressable>
  );
}
