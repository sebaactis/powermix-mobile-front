import { CARD_BG, STRONG_TEXT, SUBTEXT, BG, MAIN_COLOR } from '@/src/constant';
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
import Icon from 'react-native-vector-icons/FontAwesome';

type Category = 'Problema técnico' | 'Facturación' | 'Consulta general' | 'Seguridad/abuso';


export default function SupportScreen() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [category, setCategory] = useState<Category>('Problema técnico');
    const [message, setMessage] = useState('');
    const [showCat, setShowCat] = useState(false);
    const [attachmentName, setAttachmentName] = useState<string | null>(null);

    const categories: Category[] = ['Problema técnico', 'Facturación', 'Consulta general', 'Seguridad/abuso']

    const emailValid = useMemo(() => /\S+@\S+\.\S+/.test(email.trim()), [email]);
    const canSend = name.trim() && emailValid && message.trim();

    const handlePickFile = async () => {
        // TO DO -> tengo que agregar para subir archivos, algo asi:
        // const res = await DocumentPicker.getDocumentAsync({ copyToCacheDirectory: true });
        // if (res.type === 'success') setAttachmentName(res.name);
        // else setAttachmentName(null);

        setAttachmentName('captura_error.png');
    };

    const handleSubmit = () => {
        if (!canSend) return;

        console.log({
            name,
            email,
            category,
            message,
            attachmentName,
        });
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

                    <Text style={styles.title}>Ayuda y Soporte</Text>


                    <View style={styles.searchBox}>
                        <Icon name="search" size={16} color={SUBTEXT} />
                        <Text style={styles.searchPlaceholder}>¿En qué podemos ayudarte?</Text>
                    </View>


                    <View style={styles.card}>
                        <SupportRow
                            icon="question-circle"
                            title="Preguntas Frecuentes (FAQs)"
                            onPress={() => { }}
                        />
                        <Separator />
                        <SupportRow
                            icon="file-text-o"
                            title="Enviar una consulta / Abrir ticket"
                            onPress={() => { }}
                        />
                        <Separator />
                        <SupportRow
                            icon="headphones"
                            title="Contacto Directo"
                            onPress={() => { }}
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
                                onChangeText={setName}
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
                                onChangeText={setEmail}
                                style={[styles.input, !emailValid && email ? styles.inputError : undefined]}
                            />
                            {!emailValid && email ? (
                                <Text style={styles.errorText}>Ingresá un email válido.</Text>
                            ) : null}
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
                                onChangeText={setMessage}
                                style={[styles.input, styles.multiline]}
                                multiline
                                numberOfLines={5}
                                textAlignVertical="top"
                            />
                        </Field>


                        <Pressable style={styles.attach} onPress={handlePickFile}>
                            <Icon name="paperclip" size={16} color={SUBTEXT} />
                            <Text style={[styles.attachText, { marginLeft: 8 }]}>
                                {attachmentName ?? 'Adjuntar archivo (opcional)'}
                            </Text>
                        </Pressable>


                        <Pressable
                            onPress={handleSubmit}
                            disabled={!canSend}
                            style={({ pressed }) => [
                                styles.cta,
                                !canSend && { opacity: 0.5 },
                                pressed && { transform: [{ scale: 0.99 }] },
                            ]}
                        >
                            <Text style={styles.ctaText}>Enviar Mensaje</Text>
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
                                    setCategory(item);
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

function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <View style={{ marginTop: 14 }}>
            <Text style={styles.label}>{label}</Text>
            {children}
        </View>
    );
}

function Separator() {
    return <View style={styles.separator} />;
}

function SupportRow({
    icon,
    title,
    onPress,
}: {
    icon: string;
    title: string;
    onPress: () => void;
}) {
    return (
        <Pressable style={styles.row} onPress={onPress}>
            <View style={styles.rowIconWrap}>
                <Icon name={icon} size={18} color={MAIN_COLOR} />
            </View>
            <Text style={styles.rowText}>{title}</Text>
            <Icon name="chevron-right" size={14} color={SUBTEXT} />
        </Pressable>
    );
}

const styles = StyleSheet.create({
    title: { color: STRONG_TEXT, fontSize: 22, fontWeight: '700', marginBottom: 12 },
    searchBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: CARD_BG,
        borderColor: BG,
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 12,
        height: 44,
        marginBottom: 14,
    },
    searchPlaceholder:
    {
        color: SUBTEXT,
        marginLeft: 8
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
    sectionHelp: { color: SUBTEXT, marginTop: 4 },
    label: { color: STRONG_TEXT, marginBottom: 6, fontWeight: '600' },
    input: {
        backgroundColor: BG,
        borderColor: CARD_BG,
        borderWidth: 1,
        borderRadius: 12,
        color: STRONG_TEXT,
        paddingHorizontal: 12,
        height: 44,
    },
    inputError: { borderColor: '#ef4444' },
    multiline: { height: 120, paddingTop: 10 },
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
    selectText: { color: STRONG_TEXT },
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
    ctaText: { color: 'white', fontWeight: '800', fontSize: 16 },
    row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
    rowIconWrap: {
        width: 36,
        height: 36,
        borderRadius: 20,
        backgroundColor: '#be185d3a',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    rowText: { color: STRONG_TEXT, flex: 1, fontSize: 15, fontWeight: '600' },
    separator: { height: 1, backgroundColor: "#424242", marginVertical: 6 },
    errorText: { color: '#ef4444', marginTop: 6 },
    modalBackdrop: { position: 'absolute', inset: 0 as any, backgroundColor: '#00000088' },
    modalCard: {
        position: 'absolute',
        left: 16, right: 16, top: '25%',
        backgroundColor: CARD_BG, borderRadius: 16, borderWidth: 1, borderColor: BG,
        padding: 14,
    },
    modalTitle: { color: STRONG_TEXT, fontWeight: '700', fontSize: 16, marginBottom: 10 },
    modalRow: {
        paddingVertical: 10,
        paddingHorizontal: 6,
        borderRadius: 10,
        backgroundColor: BG,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    modalRowText: { color: STRONG_TEXT },
});
