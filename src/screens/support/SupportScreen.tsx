import Field from '@/components/support/Field';
import SupportRow from '@/components/support/SupportRow';
import { CARD_BG, STRONG_TEXT, SUBTEXT, BG, MAIN_COLOR } from '@/src/constant';
import { useAuth } from '@/src/context/AuthContext';
import { ApiHelper } from '@/src/helpers/apiHelper';
import { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    Pressable,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Modal,
    FlatList,
    StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/FontAwesome';

type Category = 'Cuenta' | 'Problema técnico' | 'Comprobantes' | 'Consulta general' | 'Seguridad/abuso' | 'Otras consultas';

type ContactRequest = {
    name: string;
    email: string;
    category: Category;
    message: string;
}

const categories: Category[] = ['Cuenta', 'Problema técnico', 'Comprobantes', 'Consulta general', 'Seguridad/abuso', 'Otras consultas']

export default function SupportScreen({ navigation }) {

    const { accessToken } = useAuth();

    const [contactRequest, setContactRequest] = useState<ContactRequest>({
        name: '',
        email: '',
        category: 'Problema técnico',
        message: '',
    })

    const [loading, setLoading] = useState(false);

    const { name, email, category, message } = contactRequest;

    const [showCat, setShowCat] = useState(false);
    const canSend = name.trim() && message.trim();

    const handlerContactRequest = (patch: Partial<ContactRequest>) => {
        setContactRequest((prev) => ({ ...prev, ...patch }))
    }

    const handleSubmit = async () => {
        if (!canSend) return;
        setLoading(true)

        try {
            const url = `${process.env.EXPO_PUBLIC_POWERMIX_API_URL}/api/v1/user/contact`;

            const res = await ApiHelper(url, 'POST', { name, email, category, message }, {
                Authorization: `Bearer ${accessToken}`,
            })

            if (!res.success || !res.data) {
                const backendMsg: string = res.error?.message

                Toast.show({
                    type: "appWarning",
                    text1: "No pudimos enviar tu consulta",
                    text2: backendMsg,
                })
                return
            }

            Toast.show({
                type: "appSuccess",
                text1: "Consulta enviada correctamente!",
                text2: "Te responderemos lo antes posible",
            })

            setContactRequest({
                name: "",
                email: "",
                category: "Problema técnico",
                message: "",

            })


        } catch {
            Toast.show({
                type: "appWarning",
                text1: "No pudimos enviar tu consulta",
                text2: "Por favor intente mas tarde",
            })
            return
        } finally {
            setLoading(false)
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: BG }} edges={['top', 'bottom']}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <ScrollView
                    contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
                    keyboardShouldPersistTaps="handled"
                >

                    <View style={styles.header}>
                        <Pressable style={styles.headerBtnLeft} onPress={() => navigation.navigate("Home")} hitSlop={8}>
                            <Icon name="arrow-left" size={20} color="#FFFFFF" />
                        </Pressable>

                        <Text style={styles.headerTitle}>Ayuda y Soporte</Text>
                    </View>

                    <View style={styles.card}>
                        <SupportRow
                            icon="question-circle"
                            title="Preguntas Frecuentes (FAQs)"
                            onPress={() => { navigation.navigate("Faq") }}
                        />
                    </View>


                    <View style={[styles.card, { marginTop: 16 }]}>
                        <Text style={styles.sectionTitle}>Envíanos tu consulta</Text>
                        <Text style={styles.sectionHelp}>
                            Rellena el formulario y nuestro equipo se pondrá en contacto contigo lo antes
                            posible.
                        </Text>

                        <Field label="Nombre">
                            <TextInput
                                placeholder="Tu nombre completo"
                                placeholderTextColor={SUBTEXT}
                                value={name}
                                onChangeText={(text) => handlerContactRequest({ name: text })}
                                style={styles.input}
                            />
                        </Field>

                        <Field label="Email">
                            <TextInput
                                placeholder="tu@email.com"
                                placeholderTextColor={SUBTEXT}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                value={email}
                                onChangeText={(text) => handlerContactRequest({ email: text })}
                                style={styles.input}
                            />
                        </Field>

                        <Field label="Categoría del problema">
                            <Pressable style={styles.select} onPress={() => setShowCat(true)}>
                                <Text style={styles.selectText}>{category}</Text>
                                <Icon name="chevron-down" size={14} color={SUBTEXT} />
                            </Pressable>
                        </Field>

                        <Field label="Mensaje">
                            <TextInput
                                placeholder="Describe tu problema con detalle..."
                                placeholderTextColor={SUBTEXT}
                                value={message}
                                onChangeText={(text) => handlerContactRequest({ message: text })}
                                style={[styles.input, styles.multiline]}
                                multiline
                                numberOfLines={5}
                                textAlignVertical="top"
                            />
                        </Field>

                        <Pressable
                            onPress={handleSubmit}
                            disabled={!canSend}
                            style={({ pressed }) => [
                                styles.cta,
                                !canSend && { opacity: 0.5 },
                                pressed && { transform: [{ scale: 0.99 }] },
                            ]}
                        >
                            <Text style={styles.ctaText}>{loading ? "Enviando consulta..." : "Enviar"}</Text>
                        </Pressable>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>

            <Modal visible={showCat} transparent animationType="fade" onRequestClose={() => setShowCat(false)}>
                <Pressable style={styles.modalBackdrop} onPress={() => setShowCat(false)}>
                    <View />
                </Pressable>
                <View style={styles.modalCard}>
                    <Text style={styles.modalTitle}>Seleccionar categoría</Text>
                    <FlatList
                        data={categories}
                        keyExtractor={(it) => it}
                        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
                        renderItem={({ item }) => (
                            <Pressable
                                onPress={() => {
                                    handlerContactRequest({ category: item })
                                    setShowCat(false);
                                }}
                                style={styles.modalRow}
                            >
                                <Text style={styles.modalRowText}>{item}</Text>
                                {item === category ? <Icon name="check" size={14} color={MAIN_COLOR} /> : null}
                            </Pressable>
                        )}
                    />
                </View>
            </Modal>
        </SafeAreaView>
    );
}



const styles = StyleSheet.create({
    header: {
        height: 56,
        justifyContent: "center",
        alignItems: "center",
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: "#838383",
        marginBottom: 20,
    },
    headerTitle: {
        color: STRONG_TEXT,
        fontSize: 18,
        fontWeight: "700",
    },
    headerBtnLeft: {
        position: "absolute",
        left: 20,
        height: 40,
        width: 40,
        alignItems: "center",
        justifyContent: "center",
    },
    card: {
        backgroundColor: CARD_BG,
        borderColor: BG,
        borderWidth: 1,
        borderRadius: 16,
        padding: 14,
    },
    sectionTitle:
    {
        color: STRONG_TEXT,
        fontSize: 18,
        fontWeight: '700'
    },
    sectionHelp: {
        color: SUBTEXT,
        marginTop: 4
    },
    input: {
        backgroundColor: BG,
        borderColor: CARD_BG,
        borderWidth: 1,
        borderRadius: 12,
        color: STRONG_TEXT,
        paddingHorizontal: 12,
        height: 44,
    },
    multiline:
    {
        height: 120,
        paddingTop: 10
    },
    select: {
        backgroundColor: BG,
        borderColor: CARD_BG,
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 12,
        height: 44,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    selectText:
    {
        color: STRONG_TEXT
    },
    attach: {
        marginTop: 16,
        borderWidth: 1,
        borderStyle: 'dashed',
        borderRadius: 12,
        padding: 14,
        borderColor: CARD_BG,
        backgroundColor: BG,
        flexDirection: 'row',
        alignItems: 'center',
    },
    attachText: { color: SUBTEXT },
    cta: {
        marginTop: 16,
        height: 50,
        borderRadius: 14,
        backgroundColor: MAIN_COLOR,
        alignItems: 'center',
        justifyContent: 'center',
    },
    ctaText: {
        color: 'white',
        fontWeight: '800',
        fontSize: 16
    },
    modalBackdrop: {
        position: 'absolute',
        inset: 0 as any,
        backgroundColor: '#00000088'
    },
    modalCard: {
        position: 'absolute',
        left: 16, right: 16, top: '25%',
        backgroundColor: CARD_BG,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: BG,
        padding: 14,
    },
    modalTitle: {
        color: STRONG_TEXT,
        fontWeight: '700',
        fontSize: 16,
        marginBottom: 10
    },
    modalRow: {
        paddingVertical: 10,
        paddingHorizontal: 6,
        borderRadius: 10,
        backgroundColor: BG,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    modalRowText: {
        color: STRONG_TEXT
    }
});
