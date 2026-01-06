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
  contentContainerStyle={styles.grid}
  showsVerticalScrollIndicator={false}
>
{[
  { naziv: 'UVOD', naslov: 'NAJUZBUDLJIVIJE PUTOVANJE U TVOM ŽIVOTU' },

  { naziv: 'LEKCIJA 1', naslov: 'Tvoja revolucija počinje ovdje' },
  { naziv: 'LEKCIJA 2', naslov: 'Granice koje te oslobađaju' },
  { naziv: 'LEKCIJA 3', naslov: 'Formula koja otvara sve brave života' },
  { naziv: 'LEKCIJA 4', naslov: 'Pripremljen za: "OSVOJI OSOBU", posao, proslavu, zabavu, druženje' },
  { naziv: 'LEKCIJA 5', naslov: 'Tvoj život - neiskorištena riznica priča' },
  { naziv: 'LEKCIJA 6', naslov: 'Crvene linije - štite te od bola' },
  { naziv: 'LEKCIJA 7', naslov: 'Ljubav kroz osmijeh - veza koja traje' },
  { naziv: 'LEKCIJA 8', naslov: 'Kako ljudi prirodno gravitiraju prema tebi' },
  { naziv: 'LEKCIJA 9', naslov: 'Porodica - najsigurniji teren za rast' },
  { naziv: 'LEKCIJA 10', naslov: 'Šale na svoj račun - ključ koji otvara srca' },

  { naziv: 'LEKCIJA 11', naslov: 'Poslovna mudrost - kako postati nezamjenjiv' },
  { naziv: 'LEKCIJA 12', naslov: 'Čitaj prostoriju prije nego što progovoriš' },
  { naziv: 'LEKCIJA 13', naslov: 'Vrijeme izgovora - tanka linija koja dijeli nebo od zemlje' },
  { naziv: 'LEKCIJA 14', naslov: 'Šala ili priča - znaj razliku, znaj kada' },
  { naziv: 'LEKCIJA 15', naslov: 'Zašto te neki pamte a drugi zaborave' },
  { naziv: 'LEKCIJA 16', naslov: 'Sarkazam - najopasnije oružje u arsenalu' },
  { naziv: 'LEKCIJA 17', naslov: 'Tvoje tijelo - tihi govornik glasnijih poruka' },
  { naziv: 'LEKCIJA 18', naslov: 'Glas - instrument koji oblikuje stvarnost' },
  { naziv: 'LEKCIJA 19', naslov: 'Kad šala ne upali - kako pretvoriti pad u pobedu' },
  { naziv: 'LEKCIJA 20', naslov: 'Povratak na staro - kako se grade mostovi' },

  { naziv: 'LEKCIJA 21', naslov: 'Stvori bez pripreme - stvaraj u trenutku' },
  { naziv: 'LEKCIJA 22', naslov: 'Vidi ono što drugi preskaču očima' },
  { naziv: 'LEKCIJA 23', naslov: 'Ovaj trenutak - jedini koji postoji' },
  { naziv: 'LEKCIJA 24', naslov: 'Pisana riječ - traga koju ostavljaš' },
  { naziv: 'LEKCIJA 25', naslov: 'Preuveličavanje - drevna mudrost koja živi' },
  { naziv: 'LEKCIJA 26', naslov: 'Analogije - most između misli i osećanja' },
  { naziv: 'LEKCIJA 27', naslov: 'Snaga tri - zašto liste vladaju umovima' },

  { naziv: 'LEKCIJA 28', naslov: 'Kada humor gleda u ogledalo' },
  { naziv: 'LEKCIJA 29', naslov: 'Pripovijedanje - vještina stara koliko čovječanstvo' },
  { naziv: 'LEKCIJA 30', naslov: 'Tvoj glas - jedinstven kao otisak prsta' },
].map((stavka, index) => (
  <View key={index} style={styles.cell}>
    <CircleButton
      variant={buttonVariant}
      label={stavka.naziv}
      onPress={() => {
        if (index === 0) {
          return router.push('/uvod' as any);
        }

        return router.push(`/lekcija${index}` as any);
      }}
    />
    <Text style={styles.sideText}>{stavka.naslov}</Text>
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
<Text style={[styles.btnNumber]} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.6}>

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
    backgroundColor: '#000',
    paddingTop: 12,
    paddingHorizontal: 12,
  },

list: {
  paddingBottom: 24,
},

grid: {
  paddingBottom: 24,
  flexDirection: 'column',
  alignItems: 'flex-start',
},


cell: {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 12,
  marginRight: 12,
  gap: 12,
},




row: {
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
  paddingVertical: 6,
},



sideText: {
  flex: 1,
  color: '#fff',
  fontSize: 18,
  fontWeight: '700',
  lineHeight: 25,
  marginTop: 2,
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
