import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

import { Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';

export default function LekcijeScreen() { 
  const { width } = useWindowDimensions();
  const router = useRouter();

const buttonVariant: CircleVariant = width >= 600 ? 'small' : 'mini';




const stavke = ['UVOD', ...Array.from({ length: 30 }, (_, i) => `LEKCIJA ${i + 1}`)];

  return (
    <View style={styles.container}>



<ScrollView
contentContainerStyle={[styles.list, { alignItems: "flex-start" }]}


  showsVerticalScrollIndicator={false}
>


{stavke.map((naziv, index) => (
<View key={index} style={styles.row}>

<CircleButton
  variant={buttonVariant}
  label={naziv}
onPress={() => {
  if (index === 0) {
    return router.push('/uvod' as any);
  }

  return router.push(`/lekcija${index}` as any);
}}


/>




  </View>
))}

      </ScrollView>
    </View>
  );
}

/* =======================
   KOMPONENTE
   ======================= */

const BORDER = 3;

function RainbowBorder({ children, style }: { children: React.ReactNode; style: any }) {
  return (
    <LinearGradient
      colors={[
        '#ff004c',
        '#ff7a00',
        '#ffd000',
        '#2dff6a',
        '#00c2ff',
        '#7a00ff',
        '#ff00d4',
      ]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={style}
    >
      {children}
    </LinearGradient>
  );
}

type CircleVariant = 'big' | 'small' | 'mini';

function CircleButton({

  label,
  variant,
  onPress,
}: {
  label: string;
  variant: CircleVariant;
  onPress: () => void;
}) {


  const sizeStyle =
    variant === 'big' ? styles.circleBig : variant === 'small' ? styles.circleSmall : styles.circleMini;


  return (
<Pressable
  onPress={onPress}
style={({ pressed }) => [
  styles.circleWrap,
  pressed && styles.pressed,
]}
>
<RainbowBorder style={[styles.circleBorder, sizeStyle]}>

        <View style={styles.circleInner}>
<Text style={[styles.btnNumber, ]}>

  {label === 'UVOD' ? 'UVOD' : label.split(' ')[1]}
</Text>
<Text style={[styles.btnLabel, ]}>
  {label === 'UVOD' ? '' : 'LEKCIJA'}
</Text>

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
    backgroundColor: '#6b3a1e', // RAL 8007 approx
    paddingTop: 12,
    paddingHorizontal: 12,
  },

list: {
  paddingBottom: 24,
},



row: {
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
  paddingVertical: 6,
},



  sideText: {
    flex: 1,
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },

circleWrap: {
  alignSelf: 'flex-start',
},

  pressed: {
    transform: [{ scale: 0.985 }],
    opacity: 0.9,
  },

  circleBorder: {
    padding: BORDER,
    borderRadius: 9999,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },

  circleBig: {
    width: 118,
    aspectRatio: 1,
  },

  circleSmall: {
    width: 90,
    aspectRatio: 1,
  },

  // MINI da stane ~10 stavki na jednom ekranu
  circleMini: {
    width: 58,
    aspectRatio: 1,
  },

  circleInner: {
    width: '100%',
    height: '100%',
    backgroundColor: '#000',
    borderRadius: 9999,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },

  btnText: {
    color: '#fff',
    textAlign: 'center',
  },

  textBig: {
    fontSize: 12,
    fontWeight: '800',
  },

  textSmall: {
    fontSize: 10,
    fontWeight: '800',
  },

textMini: {
  fontSize: 9,
  fontWeight: '900',
},
btnNumber: {
  color: '#fff',
  fontSize: 18,
  fontWeight: '900',
  lineHeight: 20,
},

btnLabel: {
  color: '#fff',
  fontSize: 9,
  fontWeight: '700',
  marginTop: -2,
},

});
