import ActivityCard from '@/components/home/ActivityCard';
import ProgressRing from '@/components/home/ProgressRing';

import { BG, CARD_BG, MAIN_COLOR, STRONG_TEXT, SUBTEXT } from '@/src/constant';
import { useAuth } from '@/src/context/AuthContext';
import { ApiHelper } from '@/src/helpers/apiHelper';
import { Proof } from '@/src/types';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

type UserHome = {
  email: string;
  name: string;
  stampsCounter: number;
  loginAttempt: number;
};

type UserMeResponse = {
  id: string;
  name: string;
  email: string;
  login_attempt: number;
  locked_until: string;
  stamps_counter: number;
};

const TOTAL_STAMPS = 10;

enum ProgressMessages {
  NONE = "Empeza a cargar tus comprobantes para ganar recompensas",
  LOW = "Carga más comprobantes para ganar recompensas",
  HIGH = "¡Sigue así! Estás cada vez mas cerca"
}

export default function HomeScreen({ navigation }) {
  const { accessToken } = useAuth();

  const [userHome, setUserHome] = useState<UserHome | null>(null);
  const [proofs, setProofs] = useState<Proof[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const completed = userHome?.stampsCounter ?? 0;
  const progress = TOTAL_STAMPS > 0 ? completed / TOTAL_STAMPS : 0;

  const fetchUser = useCallback(
    async (isRefresh: boolean = false) => {
      try {
        if (!accessToken) {
          setError("No hay accessToken");
          if (!isRefresh) setLoading(false);
          setRefreshing(false);
          return;
        }

        setError(null);

        if (isRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }


        const url = `${process.env.EXPO_PUBLIC_POWERMIX_API_URL}/api/v1/user/me`;
        const res = await ApiHelper<UserMeResponse>(url, "GET", undefined, { Authorization: `Bearer ${accessToken}` });


        if (!res.success || !res.data) {
          throw new Error(
            res.error?.message || "Error al traer el usuario"
          );
        }

        const { email, name, stamps_counter, login_attempt } = res.data

        setUserHome({
          email: email,
          name: name,
          stampsCounter: stamps_counter,
          loginAttempt: login_attempt,
        });

      } catch (e: any) {
        console.log(e.message)
        console.log("Error inesperado al traer el usuario", e);
        setError(e.message || "Error cargando informacion del usuario");
      } finally {
        if (isRefresh) {
          setRefreshing(false);
        } else {
          setLoading(false);
        }
      }
    },
    [accessToken]
  );


  const fetchProofs = useCallback(
    async (isRefresh: boolean = false) => {
      setLoading(true);

      if (isRefresh) {
        setRefreshing(true);
      }

      try {
        const url = `${process.env.EXPO_PUBLIC_POWERMIX_API_URL}/api/v1/proofs/me/last3`;
        const res = await ApiHelper<Proof[]>(url, "GET", undefined, {
          Authorization: `Bearer ${accessToken}`,
        });

        console.log("📥 Respuesta backend (proofs):", res);

        if (!res.success) {
          const errorMsg =
            res.error?.message || "Error al cargar los comprobantes";

          Toast.show({
            type: "appError",
            text1: "Ocurrió un error",
            text2: errorMsg,
          });

          return;
        }
        setProofs(res.data);
      } catch (e) {
        console.error("❌ Error inesperado al cargar comprobantes:", e);
        Toast.show({
          type: "appError",
          text1: "Ocurrió un error inesperado",
          text2: e.message,
        });
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [accessToken]
  );


  useEffect(() => {
    fetchUser(false);
    fetchProofs(false)
  }, [fetchUser, fetchProofs]);

  const onRefresh = () => {
    fetchUser(true);
    fetchProofs(true);
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator color={MAIN_COLOR} />
      </View>
    );
  }

  if (error) {
    return (
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={MAIN_COLOR}
          />
        }
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 40 }}>
          <Text style={{ color: 'red', marginBottom: 12 }}>{error}</Text>
          <Text style={{ color: STRONG_TEXT }}>Desliza hacia abajo para reintentar</Text>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={MAIN_COLOR}
        />
      }
    >
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
            <Text style={styles.totalText}>/{TOTAL_STAMPS}</Text>
          </View>
          <Text style={styles.caption}>Comprobantes</Text>
        </View>
      </View>

      <Text style={styles.message}>
        {userHome?.stampsCounter < 0
          ? ProgressMessages.NONE : userHome?.stampsCounter < 3
            ? ProgressMessages.LOW : ProgressMessages.HIGH}
      </Text>

      <View style={styles.btnContainer}>
        <Pressable style={[styles.button, { backgroundColor: CARD_BG }]} 
        onPress={
          () => navigation.navigate("Proofs", {
          screen: "FullListProofs",
        })}>
          <Text style={styles.buttonText}>Historial de comprobantes</Text>
        </Pressable>
        <Pressable style={[styles.button, { backgroundColor: MAIN_COLOR }]} onPress={
          () => navigation.navigate("Proofs", {
          screen: "ProofsMain",
        })}>
          <Text style={styles.buttonText}>Subir nuevo comprobante</Text>
        </Pressable>
      </View>

      <View>
        <Text style={styles.actityTitle}>Actividad Reciente</Text>
        {!proofs ?
          <View style={styles.noProofsContainer}>
            <Icon name="file-document-remove-outline" size={80} color="#9e9e9e" />
            <Text style={styles.noProofsText}>Aun no cargaste ningún comprobante</Text>
          </View>
          :
          <View style={styles.actityCardsContainer}>

            {proofs?.map((proof) => (
              <ActivityCard key={proof.proof_mp_id} proof={proof} />
            ))}
          </View>
        }

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
    alignSelf: 'center',
    marginBottom: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleContent: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  bigNumber: {
    color: STRONG_TEXT,
    fontSize: 52,
    fontWeight: '800',
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
    fontSize: 16,
    textAlign: 'center',
  },
  btnContainer: {
    marginTop: 25,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 15,
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
    fontWeight: '600',
  },
  actityTitle: {
    marginTop: 40,
    color: STRONG_TEXT,
    fontSize: 20,
    fontWeight: '800',
  },
  actityCardsContainer: {
    marginTop: 20,
    marginBottom: 90,
  },
  noProofsContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50
  },
  noProofsText: {
    color: "#9e9e9e",
    fontSize: 17,
    fontWeight: 700,
    marginTop: 5
  }
});
