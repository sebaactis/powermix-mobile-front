import ActivityCard from '@/components/home/ActivityCard';
import ProgressRing from '@/components/home/ProgressRing';

import { BG, CARD_BG, MAIN_COLOR, STRONG_TEXT, SUBTEXT } from '@/src/constant';
import { useAuth } from '@/src/context/AuthContext';
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

type UserHome = {
  email: string;
  name: string;
  stampsCounter: number;
  loginAttempt: number;
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
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const completed = userHome?.stampsCounter ?? 0;
  const progress = TOTAL_STAMPS > 0 ? completed / TOTAL_STAMPS : 0;

  const fetchUser = useCallback(
    async (isRefresh: boolean = false) => {
      try {
        if (!accessToken) {
          setError('No hay accessToken');
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

        const res = await fetch(`http://10.0.2.2:8080/api/v1/user/me`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!res.ok) {
          const txt = await res.text();
          console.log('Error al traer el usuario', txt);
          throw new Error('Error al traer el usuario');
        }

        const data = await res.json();

        setUserHome({
          email: data.email,
          name: data.name,
          stampsCounter: data.stamps_counter,
          loginAttempt: data.login_attemp,
        });
      } catch (e: any) {
        console.log('Error inesperado al traer el usuario', e);
        setError(e.message || 'Error cargando informacion del usuario');
      } finally {
        if (isRefresh) {
          setRefreshing(false);
        } else {
          setLoading(false);
        }
      }
    },
    [accessToken],
  );

  useEffect(() => {
    fetchUser(false);
  }, [fetchUser]);

  const onRefresh = () => {
    fetchUser(true);
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
        <Pressable style={[styles.button, { backgroundColor: CARD_BG }]}>
          <Text style={styles.buttonText}>Historial de comprobantes</Text>
        </Pressable>
        <Pressable style={[styles.button, { backgroundColor: MAIN_COLOR }]} onPress={() => navigation.navigate("Proofs")}>
          <Text style={styles.buttonText}>Subir nuevo comprobante</Text>
        </Pressable>
      </View>

      <View>
        <Text style={styles.actityTitle}>Actividad Reciente</Text>
        <View style={styles.actityCardsContainer}>
          <ActivityCard title="Comprobante de batido" date="10/11/2025" amount="5500" />
          <ActivityCard title="Comprobante de batido" date="10/11/2025" amount="5500" />
          <ActivityCard title="Comprobante de batido" date="10/11/2025" amount="5500" />
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
});
