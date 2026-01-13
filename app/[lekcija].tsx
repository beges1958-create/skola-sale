Dimport { useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, View, useWindowDimensions } from 'react-native';
import Markdown from 'react-native-markdown-display';
import { markdownStilovi, type MarkdownPreset } from './MarkdownStilovi/markdownStilovi';
import { lekcijeDo30 } from './TekstoviLekcija/lekcijeDo30';

export default function EkranLekcije() {
  const { lekcija } = useLocalSearchParams<{ lekcija?: string }>();
  const { width } = useWindowDimensions();
  // Ako je ekran uži od 768px koristimo phone stil, inače desktop stil
  const markdownPreset: MarkdownPreset = width < 768 ? "phone" : "desktop";
  const markdownStyle = markdownStilovi[markdownPreset];


  const tekst =
    lekcija && lekcija in lekcijeDo30
      ? lekcijeDo30[lekcija as keyof typeof lekcijeDo30]
      : 'Lekcija ne postoji.';

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Markdown
          style={markdownStyle}
        >

          {tekst}
        </Markdown>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
});
