export function getStatusConfig(status: ReceiptStatus) {
    switch (status) {
        case "APROBADO":
            return {
                label: "Aprobado",
                textColor: "#1CC8A0",
                iconName: "check",
                iconColor: "#E6FFFA",
                outerBg: "#003B3A",
                innerBg: "#007266",
            };
        case "PENDIENTE":
            return {
                label: "Pendiente",
                textColor: "#F5B41B",
                iconName: "clock-o",
                iconColor: "#FFF7D6",
                outerBg: "#3A2A00",
                innerBg: "#7A4B00",
            };
        case "RECHAZADO":
        default:
            return {
                label: "Rechazado",
                textColor: "#FF4B7D",
                iconName: "close",
                iconColor: "#FFE5EC",
                outerBg: "#3F0016",
                innerBg: "#7C0030",
            };
    }
}