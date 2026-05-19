import "./globals.css";
import { Toaster } from "react-hot-toast";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
<Toaster
  position="bottom-right"
  reverseOrder={false}
  gutter={12}
  containerStyle={{
    bottom: 20,
    right: 20,
  }}
  toastOptions={{
    duration: 3000,

    style: {
      background: "rgba(17, 24, 39, 0.95)",
      color: "#fff",
      border: "1px solid rgba(255,255,255,0.08)",
      backdropFilter: "blur(10px)",
      padding: "14px 16px",
      borderRadius: "16px",
      fontSize: "14px",
      fontWeight: "500",
      boxShadow:
        "0 10px 30px rgba(0,0,0,0.35)",
      zIndex: 99999,
    },

    success: {
      iconTheme: {
        primary: "#8b5cf6",
        secondary: "#fff",
      },
    },

    error: {
      iconTheme: {
        primary: "#ef4444",
        secondary: "#fff",
      },
    },
  }}
/>
      </body>
    </html>
  );
}
