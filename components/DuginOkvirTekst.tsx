import React from 'react';
import { View } from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Text as SvgText } from 'react-native-svg';

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
  fontSize: number;
  fontWeight?: string | number;
  strokeWidth?: number;
  boje?: string[];
};

export default function DuginOkvirTekst({
  tekst,
  fontSize,
  fontWeight = '900',
  strokeWidth =6,
  boje = DUGINE_BOJE,
}: Svojstva) {
  const sirina = Math.max(20, tekst.length * fontSize * 0.72);
  const visina = Math.ceil(fontSize * 1.35);

  return (
    <View style={{ alignItems: 'center' }}>
      <Svg width={sirina} height={visina}>
        <Defs>
<LinearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
            {boje.map((c, i) => (
              <Stop key={i} offset={`${(i / (boje.length - 1)) * 100}%`} stopColor={c} />
            ))}
          </LinearGradient>
        </Defs>

        <SvgText
          x={sirina / 2}
          y={visina - fontSize * 0.25}
          fontSize={fontSize}
          fontWeight={fontWeight}
          textAnchor="middle"
       stroke="url(#grad)"
strokeWidth={strokeWidth}
strokeLinejoin="miter"
strokeLinecap="square"
fill="none"

        >
          {tekst}
        </SvgText>

        <SvgText
          x={sirina / 2}
          y={visina - fontSize * 0.25}
          fontSize={fontSize}
          fontWeight={fontWeight}
          textAnchor="middle"
          fill="#fff"
        >
          {tekst}
        </SvgText>
      </Svg>
    </View>
  );
}
