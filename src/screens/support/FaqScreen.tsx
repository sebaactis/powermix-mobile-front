
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Pressable,

} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome';
import { BG, CARD_BG, STRONG_TEXT, SUBTEXT } from '@/src/constant';
import FaqItem from '@/components/support/faq/FaqItem';

type FAQItem = {
    id: string;
    question: string;
    answer: string;
};

const FAQS: FAQItem[] = [
    {
        id: '1',
        question: '¿Cómo funciona el sistema de sellos/puntos?',
        answer:
            'Cada compra que realizás en la tienda suma sellos en tu cuenta. Al completar el total indicado en la pantalla principal, desbloqueás un beneficio que podrás canjear desde la app.',
    },
    {
        id: '2',
        question: 'No veo mis sellos actualizados, ¿qué hago?',
        answer:
            'En algunos casos la actualización puede demorar unos minutos. Si el problema persiste, probá cerrar sesión y volver a ingresar. Si aún así sigue igual, contactanos desde el formulario de soporte.',
    },
    {
        id: '3',
        question: 'Olvidé mi contraseña, ¿puedo recuperarla?',
        answer:
            'Sí. En la pantalla de inicio de sesión seleccioná “¿Olvidaste tu contraseña?” y seguí los pasos. Te enviaremos un correo con las instrucciones para restablecerla.',
    },
    {
        id: '4',
        question: '¿Puedo usar mi cuenta en varios dispositivos?',
        answer:
            'Podés iniciar sesión con el mismo email en distintos dispositivos, pero por seguridad te recomendamos no compartir tu cuenta con otras personas.',
    },
    {
        id: '5',
        question: 'Tengo un problema con un comprobante',
        answer:
            'Si tuviste un problema al cargar un comprobante, contactanos a través del formulario de ayuda para que podamos analizar el caso!',
    },
];

export default function FaqScreen({ navigation }: any) {
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: BG }} edges={['top', 'bottom']}>
            {/* Header mismo estilo que SupportScreen */}
            <View style={styles.header}>
                <Pressable
                    style={styles.headerBtnLeft}
                    onPress={() => navigation.goBack()}
                    hitSlop={8}
                >
                    <Icon name="arrow-left" size={20} color="#FFFFFF" />
                </Pressable>

                <Text style={styles.headerTitle}>Preguntas frecuentes</Text>
            </View>

            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
            >
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>FAQs</Text>
                    <Text style={styles.sectionHelp}>
                        Encontrá respuestas rápidas a las dudas más comunes sobre el uso de la app,
                        tus sellos y tus beneficios.
                    </Text>

                    <View style={styles.faqQuestionContainer}>
                        {FAQS.map((item) => (
                            <FaqItem
                                key={item.id}
                                question={item.question}
                                answer={item.answer}
                            />
                        ))}
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    header: {
        height: 56,
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#838383',
        marginBottom: 20,
    },
    headerTitle: {
        color: STRONG_TEXT,
        fontSize: 18,
        fontWeight: '700',
    },
    headerBtnLeft: {
        position: 'absolute',
        left: 20,
        height: 40,
        width: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    card: {
        backgroundColor: CARD_BG,
        borderColor: BG,
        borderWidth: 1,
        borderRadius: 16,
        padding: 14,
    },
    sectionTitle: {
        color: STRONG_TEXT,
        fontSize: 20,
        fontWeight: '700',
        textAlign: 'center',
        marginVertical: 10,
    },
    sectionHelp: {
        color: SUBTEXT,
        marginVertical: 10,
        fontSize: 14,
    },
    faqQuestionContainer: {
        marginTop: 10,
        
    }
});