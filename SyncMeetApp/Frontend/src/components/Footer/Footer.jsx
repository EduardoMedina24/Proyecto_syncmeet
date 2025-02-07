import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";

function Footer() {
    return (
        <footer style={styles.footer}>
            <p>&copy; 2025 SyncMeet. Todos los derechos reservados.</p>
            <div style={styles.socialLinks}>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" style={styles.icon}>
                    <FaFacebook size={24} />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" style={styles.icon}>
                    <FaTwitter size={24} />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" style={styles.icon}>
                    <FaInstagram size={24} />
                </a>
            </div>
        </footer>
    );
}

// 🎨 Estilos en JS (CSS en objeto)
const styles = {
    footer: {
        textAlign: "center",
        padding: "20px",
        backgroundColor: "#222",
        color: "white",
        marginTop: "20px",
    },
    socialLinks: {
        marginTop: "10px",
        display: "flex",
        justifyContent: "center",
        gap: "15px",
    },
    icon: {
        color: "white",
        fontSize: "24px",
        transition: "transform 0.3s ease, color 0.3s ease",
        textDecoration: "none",
    },
    iconHover: {
        color: "#ffcc00",
        transform: "scale(1.2)",
    },
};

export default Footer;
