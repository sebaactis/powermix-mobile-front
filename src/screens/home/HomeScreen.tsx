import ActivityCard from '@/components/home/ActivityCard';
import  ProgressRing from '@/components/home/ProgressRing';
import ScreenSafeArea from '@/components/safeArea/ScreenSafeArea';
import { mainColor } from '@/src/constant';
import { Pressable, StyleSheet, Text, View, ViewStyle, ScrollView } from 'react-native';


export default function HomeScreen() {
  const completed = 7;
  const total = 10;
  const progress = completed / total;

  const safeAreaStyles: ViewStyle = {
    paddingTop: 20
  };

  return (
    <ScreenSafeArea style={safeAreaStyles}>
      <ScrollView style={styles.container}>

        <Text style={styles.sectionTitle}></Text>

        <View style={styles.circleWrapper}>
          <ProgressRing
            size={210}
            strokeWidth={20}
            progress={progress}
            trackColor="#202633"
            progressColor={mainColor}
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
          <Pressable style={[styles.button, { backgroundColor: "#2f2d2d" }]}><Text style={styles.buttonText}>Historial de comprobantes</Text></Pressable>
          <Pressable style={[styles.button, { backgroundColor: "#2f2d2d" }]}><Text style={styles.buttonText}>Reportes</Text></Pressable>
          <Pressable style={[styles.button, { backgroundColor: mainColor }]}><Text style={styles.buttonText}>Subir nuevo comprobante</Text></Pressable>
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
    </ScreenSafeArea>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E1E1E",
    paddingHorizontal: 24,
    paddingTop: 20,
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
    color: "#FFFFFF",
    fontSize: 52,
    fontWeight: "800",
  },
  totalText: {
    color: "#9CA3AF",
    fontSize: 32,
    marginBottom: 6,
  },
  caption: {
    color: "#9CA3AF",
    fontSize: 18,
    marginTop: 4,
  },
  message: {
    marginTop: 6,
    color: "#a6a6a6",
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
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: 600
  },
  actityTitle: {
    marginTop: 40,
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: 800,
  },
  actityCardsContainer: {
    marginTop: 20,
    marginBottom: 50
  }
});