import ActivityCard from '@/components/home/ActivityCard';
import ProgressRing from '@/components/home/ProgressRing';

import { BG, CARD_BG, MAIN_COLOR, STRONG_TEXT, SUBTEXT } from '@/src/constant';
import { useAuth } from '@/src/context/AuthContext';
import { AuthApi } from '@/src/helpers/authApi';
import { getResponsiveFontSize, getResponsiveSize, RESPONSIVE_SIZES } from '@/src/helpers/responsive';
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
import { SafeAreaView } from 'react-native-safe-area-context';
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

const TOTAL_STAMPS = 5;

enum ProgressMessages {
  NONE = "Empeza a cargar tus comprobantes para ganar recompensas",
  LOW = "Carga más comprobantes para ganar recompensas",
  HIGH = "¡Sigue así! Estás cada vez mas cerca"
}

export default function HomeScreen({ navigation }) {
  const { accessToken, signOut } = useAuth();

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
        const res = await AuthApi<UserMeResponse>(url, "GET", signOut)


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
        setError(e.message || "Error cargando informacion del usuario");
      } finally {
        if (isRefresh) {
          setRefreshing(false);
        } else {
          setLoading(false);
        }
      }
    },
    [accessToken, signOut]
  );


  const fetchProofs = useCallback(
    async (isRefresh: boolean = false) => {
      setLoading(true);

      if (isRefresh) {
        setRefreshing(true);
      }

      try {
        const url = `${process.env.EXPO_PUBLIC_POWERMIX_API_URL}/api/v1/proofs/me/last3`;
        const res = await AuthApi(url, "GET", signOut)

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
        setProofs(res.data || []);
      } catch (e) {
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
    [signOut]
  );


  useEffect(() => {
    fetchUser(false);
    fetchProofs(false)
  }, [fetchUser, fetchProofs]);

  const onRefresh = () => {
    fetchUser(true);
    fetchProofs(true);
  };

  console.log('🔍 DEBUG HomeScreen:', { loading, proofsLength: proofs?.length, proofs });

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator color={MAIN_COLOR} />
      </View>
    );
  }

  if (error) {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={MAIN_COLOR}
          />
        }
      >
        <View style={styles.errorContainer}>
          <Icon name="alert-circle-outline" size={60} color="#f97373" />
          <Text style={styles.errorText}>{error}</Text>
          <Text style={styles.errorHint}>Desliza hacia abajo para reintentar</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
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
          size={getResponsiveSize(210, 180, 230)}
          strokeWidth={getResponsiveSize(20, 18)}
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
        {loading ? null : (proofs?.length === 0 ? (
          <View style={styles.noProofsContainer}>
            <Icon name="file-document-remove-outline" size={75} color="#9e9e9e" />
            <Text style={styles.noProofsText}>Aun no cargaste ningún comprobante</Text>
          </View>
        ) : (
          <View style={styles.actityCardsContainer}>
            {proofs?.map((proof) => (
              <ActivityCard key={proof.proof_mp_id} proof={proof} />
            ))}
          </View>
        ))}

      </View>
    </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
    paddingHorizontal: RESPONSIVE_SIZES.padding.horizontal,
  },
  sectionTitle: {
    height: 0,
  },
  circleWrapper: {
    alignSelf: 'center',
    marginTop: 24,
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
    fontSize: getResponsiveFontSize(52, 48),
    fontWeight: '800',
  },
  totalText: {
    color: SUBTEXT,
    fontSize: getResponsiveFontSize(28, 24),
    marginBottom: 6,
  },
  caption: {
    color: SUBTEXT,
    fontSize: getResponsiveFontSize(17, 14),
    marginTop: 4,
  },
  message: {
    marginTop: 6,
    color: SUBTEXT,
    fontSize: getResponsiveFontSize(16, 14),
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
    paddingVertical: 15,
    width: '95%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: STRONG_TEXT,
    fontSize: getResponsiveFontSize(17, 15),
    fontWeight: '600',
  },
  actityTitle: {
    marginTop: 40,
    color: STRONG_TEXT,
    fontSize: getResponsiveFontSize(19, 17),
    fontWeight: '800',
  },
  actityCardsContainer: {
    marginTop: 20,
    marginBottom: 90,
  },
  noProofsContainer: {
    justifyContent: "center",
    alignItems: "center",
    minHeight: 200,
    marginBottom: 90
  },
  noProofsText: {
    color: "#9e9e9e",
    fontSize: getResponsiveFontSize(17, 15),
    fontWeight: 700,
    marginTop: 5
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
    paddingHorizontal: 20,
  },
  errorText: {
    color: '#f97373',
    fontSize: getResponsiveFontSize(16, 14),
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 8,
    textAlign: 'center',
  },
  errorHint: {
    color: SUBTEXT,
    fontSize: getResponsiveFontSize(14, 12),
    textAlign: 'center',
  },
});
