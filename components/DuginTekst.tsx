import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleProp, Text, TextStyle } from 'react-native';

const DUGINE_BOJE = [
  '#ff004c',
  '#ff7a00',
  '#ffd000',
  '#2dff6a',
  '#00c2ff',
  '#7a00ff',
  '#ff00d4',
];

type Svojstva = {
  tekst: string;
  stil?: StyleProp<TextStyle>;
  boje?: string[];
};

export default function DuginTekst({ tekst, stil, boje = DUGINE_BOJE }: Svojstva) {
  return (
    <MaskedView
      maskElement={
        <Text style={[stil, { opacity: 1 }]}>
          {tekst}
        </Text>
      }
    >
<LinearGradient colors={boje as unknown as readonly [string, string, ...string[]]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>

        <Text style={[stil, { opacity: 0 }]}>
          {tekst}
        </Text>
      </LinearGradient>
    </MaskedView>
  );
}
