import ActivityCard from '@/components/home/ActivityCard';
import ProgressRing from '@/components/home/ProgressRing';

import { BG, CARD_BG, MAIN_COLOR, STRONG_TEXT, SUBTEXT } from '@/src/constant';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';


export default function HomeScreen() {
  const completed = 7;
  const total = 10;
  const progress = completed / total;

  return (

    <ScrollView style={styles.container}>
      <Text style={styles.sectionTitle}></Text>

      <View style={styles.circleWrapper}>
        <ProgressRing
          size={210}
          strokeWidth={20}
          progress={progress}
          trackColor="#202633"
          progressColor={MAIN_COLOR}
        />

        <View style={styles.circleContent}>
          <View style={styles.rowCenter}>
            <Text style={styles.bigNumber}>{completed}</Text>
            <Text style={styles.totalText}>/{total}</Text>
          </View>
          <Text style={styles.caption}>Comprobantes</Text>
        </View>
      </View>

      <Text style={styles.message}>
        ¡Sigue así! Estás cada vez más cerca.
      </Text>

      <View style={styles.btnContainer}>
        <Pressable style={[styles.button, { backgroundColor: CARD_BG }]}><Text style={styles.buttonText}>Historial de comprobantes</Text></Pressable>
        <Pressable style={[styles.button, { backgroundColor: CARD_BG }]}><Text style={styles.buttonText}>Reportes</Text></Pressable>
        <Pressable style={[styles.button, { backgroundColor: MAIN_COLOR }]}><Text style={styles.buttonText}>Subir nuevo comprobante</Text></Pressable>
      </View>

      <View>
        <Text style={styles.actityTitle}>Actividad Reciente</Text>
        <View style={styles.actityCardsContainer}>
          <ActivityCard
            title="Comprobante de batido"
            date="10/11/2025"
            amount='5500'
          />

          <ActivityCard
            title="Comprobante de batido"
            date="10/11/2025"
            amount='5500'
          />

          <ActivityCard
            title="Comprobante de batido"
            date="10/11/2025"
            amount='5500'
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
    paddingHorizontal: 24,
    paddingTop: 70,
  },
  circleWrapper: {
    alignSelf: "center",
    marginBottom: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  circleContent: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  rowCenter: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  bigNumber: {
    color: STRONG_TEXT,
    fontSize: 52,
    fontWeight: "800",
  },
  totalText: {
    color: SUBTEXT,
    fontSize: 32,
    marginBottom: 6,
  },
  caption: {
    color: SUBTEXT,
    fontSize: 18,
    marginTop: 4,
  },
  message: {
    marginTop: 6,
    color: SUBTEXT,
    fontSize: 17,
    textAlign: "center",
  },
  btnContainer: {
    marginTop: 25,
    justifyContent: "center",
    alignItems: "center",
    gap: 15
  },
  button: {
    borderRadius: 8,
    paddingVertical: 18,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: STRONG_TEXT,
    fontSize: 17,
    fontWeight: 600
  },
  actityTitle: {
    marginTop: 40,
    color: STRONG_TEXT,
    fontSize: 20,
    fontWeight: 800,
  },
  actityCardsContainer: {
    marginTop: 20,
    marginBottom: 90
  }
});