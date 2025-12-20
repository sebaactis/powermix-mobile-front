import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import Toast from "react-native-toast-message";

import { CARD_BG, MAIN_COLOR, STRONG_TEXT, SUBTEXT } from "@/src/constant";
import { useAuth } from "@/src/context/AuthContext";
import { ApiHelper } from "@/src/helpers/apiHelper";

type Props = {
  visible: boolean;
  onClose: () => void;
  setProofs: (proofs: Proof[]) => void
};

type PaymentMethod = "MERCADO_PAGO" | "OTRO";

type OtherFields = {
  date: string;
  time: string;
  amount: string;
  dni: string;
  last4: string;
};

type Errors = {
  mpReceipt?: string;
  date?: string;
  time?: string;
  amount?: number;
  dni?: number;
  last4?: string;
};

export default function AddProofModal({ visible, onClose, setProofs }: Props) {

  const { accessToken } = useAuth()

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("MERCADO_PAGO");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [mpReceipt, setMpReceipt] = useState("");
  const [other, setOther] = useState<OtherFields>({
    date: "",
    time: "",
    amount: 0,
    dni: 0,
    last4: "",
  });

  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);

  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const dropdownAnim = useRef(new Animated.Value(0)).current;
  const contentAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (visible) {
      setErrors({});
      setDropdownOpen(false);
      dropdownAnim.setValue(0);

      scaleAnim.setValue(0.9);
      opacityAnim.setValue(0);

      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 220,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, dropdownAnim, opacityAnim, scaleAnim]);

  useEffect(() => {
    contentAnim.setValue(0);
    Animated.timing(contentAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [paymentMethod, contentAnim]);

  const closeWithAnimation = () => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 0.9,
        duration: 160,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 160,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose();
      setErrors({});
      setMpReceipt("");
      setOther({ date: "", time: "", amount: "", dni: "", last4: "" });
      setPaymentMethod("MERCADO_PAGO");
      setDropdownOpen(false);
      dropdownAnim.setValue(0);
    });
  };

  const toggleDropdown = () => {
    setDropdownOpen((prev) => {
      const next = !prev;
      Animated.timing(dropdownAnim, {
        toValue: next ? 1 : 0,
        duration: 160,
        useNativeDriver: true,
      }).start();
      return next;
    });
  };

  const handleChangeOther = (field: keyof OtherFields, value: string) => {
    setOther((prev) => ({ ...prev, [field]: value }));
    setErrors({});
  };

  const validate = (): boolean => {
    const newErrors: Errors = {};

    if (paymentMethod === "MERCADO_PAGO") {
      if (!mpReceipt.trim()) {
        newErrors.mpReceipt = "Ingresá el número de comprobante.";
      }
    } else {
      if (!other.date.trim()) newErrors.date = "La fecha es obligatoria.";
      if (!other.time.trim()) newErrors.time = "La hora es obligatoria.";
      if (!other.amount.trim()) newErrors.amount = "El monto es obligatorio.";
      if (!other.amount < 0)
        if (!other.dni.trim()) newErrors.dni = "El DNI es obligatorio.";
      if (other.last4 && other.last4.length !== 4) {
        newErrors.last4 = "Debe tener exactamente 4 dígitos.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    console.log(other)

    try {
      setLoading(true);

      if (paymentMethod === "MERCADO_PAGO") {

        const url = `${process.env.EXPO_PUBLIC_POWERMIX_API_URL}/api/v1/proof`
        const res = await ApiHelper(url, "POST", { proof_mp_id: mpReceipt }, {
          Authorization: `Bearer ${accessToken}`,
        })

        if (!res.success || !res.data) {
          const error = data.error?.fields["error"]

          Toast.show({
            type: "appWarning",
            text1: "No se pudo cargar el comprobante",
            text2: error
          })

          return
        }

        setProofs((prev) => [...prev, res.data])
      } else {

        const url = `${process.env.EXPO_PUBLIC_POWERMIX_API_URL}/api/v1/proof/others`
        const res = await ApiHelper(url, "POST", {
          date: other.date,
          time: other.time,
          amount: Number(other.amount),
          dni: other.dni.toString(),
          last4: other.last4.toString(),
        }, {
          Authorization: `Bearer ${accessToken}`,
        })


        if (!res.success || !res.data) {
          const error = data.details?.error || "Error al cargar el comprobante"

          Toast.show({
            type: "appWarning",
            text1: "No se pudo cargar el comprobante",
            text2: error
          })
          return
        }

        setProofs((prev) => [...prev, res.data])

      }

      Toast.show({
        type: "appSuccess",
        text1: "Comprobante enviado",
        text2: "Sumaste un sello para tu proxima recompensa!",
      });

      closeWithAnimation();
    } catch (error: any) {
      Toast.show({
        type: "appError",
        text1: "Error al enviar el comprobante",
        text2: error?.message ?? "Error desconocido",
      });
    } finally {
      setLoading(false);
    }
  };

  const labelPayment = (pm: PaymentMethod) =>
    pm === "MERCADO_PAGO" ? "Mercado Pago" : "Otro medio de pago";

  const dropdownScaleY = dropdownAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.8, 1],
  });

  const fieldsTranslateY = contentAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [10, 0],
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={closeWithAnimation}
    >
      <View style={styles.modalOverlay}>
        <Animated.View
          style={[
            styles.modalContainer,
            { opacity: opacityAnim, transform: [{ scale: scaleAnim }] },
          ]}
        >
          <Text style={styles.modalTitle}>Agregar comprobante</Text>
          <Text style={styles.modalSubtitle}>
            Seleccioná el medio de pago y completá los datos del comprobante.
          </Text>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Medio de pago</Text>

            <Pressable
              style={styles.dropdownSelector}
              onPress={toggleDropdown}
            >
              <Text style={styles.dropdownSelectorText}>
                {labelPayment(paymentMethod)}
              </Text>
              <Animated.View
                style={{
                  transform: [
                    {
                      rotate: dropdownAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: ["0deg", "180deg"],
                      }),
                    },
                  ],
                }}
              >
                <Icon name="chevron-down" size={14} color={SUBTEXT} />
              </Animated.View>
            </Pressable>

            {dropdownOpen && (
              <Animated.View
                style={[
                  styles.dropdownList,
                  {
                    opacity: dropdownAnim,
                    transform: [{ scaleY: dropdownScaleY }],
                  },
                ]}
              >
                <Pressable
                  style={styles.dropdownItem}
                  onPress={() => {
                    setPaymentMethod("MERCADO_PAGO");
                    setDropdownOpen(false);
                    setErrors({});
                  }}
                >
                  <Text style={styles.dropdownItemText}>Mercado Pago</Text>
                </Pressable>
                <Pressable
                  style={styles.dropdownItem}
                  onPress={() => {
                    setPaymentMethod("OTRO");
                    setDropdownOpen(false);
                    setErrors({});
                  }}
                >
                  <Text style={styles.dropdownItemText}>Otro medio de pago</Text>
                </Pressable>
              </Animated.View>
            )}
          </View>


          <Animated.View
            style={{
              opacity: contentAnim,
              transform: [{ translateY: fieldsTranslateY }],
            }}
          >
            {paymentMethod === "MERCADO_PAGO" ? (
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>
                  Número de comprobante de Mercado Pago
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    errors.mpReceipt && styles.inputError,
                  ]}
                  value={mpReceipt}
                  onChangeText={(t) => {
                    setMpReceipt(t);
                    setErrors({});
                  }}
                  placeholderTextColor={SUBTEXT}
                  autoCapitalize="none"
                />
                {errors.mpReceipt && (
                  <Text style={styles.errorText}>{errors.mpReceipt}</Text>
                )}
              </View>
            ) : (
              <>
                <View style={styles.row}>
                  <View style={[styles.fieldGroup, styles.rowItem]}>
                    <Text style={styles.fieldLabel}>Fecha</Text>
                    <TextInput
                      style={[
                        styles.input,
                        errors.date && styles.inputError,
                      ]}
                      value={other.date}
                      onChangeText={(t) => handleChangeOther("date", t)}
                      placeholder="DD/MM/AAAA"
                      placeholderTextColor={SUBTEXT}
                    />
                    {errors.date && (
                      <Text style={styles.errorText}>{errors.date}</Text>
                    )}
                  </View>

                  <View style={[styles.fieldGroup, styles.rowItem]}>
                    <Text style={styles.fieldLabel}>Hora</Text>
                    <TextInput
                      style={[
                        styles.input,
                        errors.time && styles.inputError,
                      ]}
                      value={other.time}
                      onChangeText={(t) => handleChangeOther("time", t)}
                      placeholder="HH:MM"
                      placeholderTextColor={SUBTEXT}
                    />
                    {errors.time && (
                      <Text style={styles.errorText}>{errors.time}</Text>
                    )}
                  </View>
                </View>

                <View style={styles.fieldGroup}>
                  <Text style={styles.fieldLabel}>Monto</Text>
                  <TextInput
                    style={[
                      styles.input,
                      errors.amount && styles.inputError,
                    ]}
                    value={other.amount}
                    onChangeText={(t) => handleChangeOther("amount", t)}
                    placeholder="Ej: 2500.00"
                    placeholderTextColor={SUBTEXT}
                    keyboardType="decimal-pad"
                  />
                  {errors.amount && (
                    <Text style={styles.errorText}>{errors.amount}</Text>
                  )}
                </View>

                <View style={styles.fieldGroup}>
                  <Text style={styles.fieldLabel}>DNI</Text>
                  <TextInput
                    style={[
                      styles.input,
                      errors.dni && styles.inputError,
                    ]}
                    value={other.dni}
                    onChangeText={(t) => handleChangeOther("dni", t)}
                    placeholder="Sin puntos ni guiones"
                    placeholderTextColor={SUBTEXT}
                    keyboardType="number-pad"
                  />
                  {errors.dni && (
                    <Text style={styles.errorText}>{errors.dni}</Text>
                  )}
                </View>

                <View style={styles.fieldGroup}>
                  <Text style={styles.fieldLabel}>
                    Últimos 4 dígitos de la tarjeta{" "}
                    <Text style={{ color: SUBTEXT }}>(opcional)</Text>
                  </Text>
                  <TextInput
                    style={[
                      styles.input,
                      errors.last4 && styles.inputError,
                    ]}
                    value={other.last4}
                    onChangeText={(t) =>
                      handleChangeOther("last4", t.replace(/[^0-9]/g, ""))
                    }
                    placeholder="Ej: 1234"
                    placeholderTextColor={SUBTEXT}
                    keyboardType="number-pad"
                    maxLength={4}
                  />
                  {errors.last4 && (
                    <Text style={styles.errorText}>{errors.last4}</Text>
                  )}
                </View>
              </>
            )}
          </Animated.View>

          <View style={styles.buttonsRow}>
            <Pressable
              style={[styles.button, styles.buttonSecondary]}
              onPress={closeWithAnimation}
              disabled={loading}
            >
              <Text style={styles.buttonSecondaryText}>Cancelar</Text>
            </Pressable>

            <Pressable
              style={[styles.button, styles.buttonPrimary]}
              onPress={handleSubmit}
              disabled={loading}
            >
              <Text style={styles.buttonPrimaryText}>
                {loading ? "Enviando..." : "Enviar comprobante"}
              </Text>
            </Pressable>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  modalContainer: {
    width: "100%",
    borderRadius: 18,
    paddingHorizontal: 20,
    paddingVertical: 18,
    backgroundColor: CARD_BG,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: STRONG_TEXT,
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: 14,
    color: SUBTEXT,
    marginBottom: 14,
  },

  fieldGroup: {
    marginBottom: 10,
  },
  fieldLabel: {
    color: STRONG_TEXT,
    fontSize: 14,
    marginBottom: 4,
  },
  input: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#3A3A3C",
    paddingHorizontal: 12,
    paddingVertical: 9,
    color: STRONG_TEXT,
    fontSize: 15,
    backgroundColor: "#111214",
  },
  inputError: {
    borderColor: "#f97373",
    borderWidth: 1.5,
  },
  errorText: {
    color: "#f97373",
    fontSize: 12,
    marginTop: 2,
  },

  row: {
    flexDirection: "row",
    gap: 10,
  },
  rowItem: {
    flex: 1,
  },

  dropdownSelector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#3A3A3C",
    paddingHorizontal: 12,
    paddingVertical: 9,
    backgroundColor: "#111214",
    marginBottom: 4,
  },
  dropdownSelectorText: {
    color: STRONG_TEXT,
    fontSize: 15,
  },
  dropdownList: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#3A3A3C",
    backgroundColor: "#111214",
    overflow: "hidden",
    marginBottom: 6,
  },
  dropdownItem: {
    paddingVertical: 9,
    paddingHorizontal: 12,
  },
  dropdownItemText: {
    color: STRONG_TEXT,
    fontSize: 15,
  },

  buttonsRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 12,
  },
  button: {
    paddingVertical: 9,
    paddingHorizontal: 16,
    borderRadius: 999,
  },
  buttonSecondary: {
    backgroundColor: "transparent",
  },
  buttonSecondaryText: {
    color: SUBTEXT,
    fontSize: 15,
    fontWeight: "500",
  },
  buttonPrimary: {
    backgroundColor: MAIN_COLOR,
  },
  buttonPrimaryText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },
});
