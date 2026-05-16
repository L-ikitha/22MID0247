import "./globals.css";
import NavBar from "./components/NavBar";

export const metadata = {
  title: "Campus Notifications",
  description: "Real-time campus notifications with Priority Inbox",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <NavBar />
        <main
          style={{
            maxWidth: 900,
            margin: "0 auto",
            padding: "24px 16px",
          }}
        >
          {children}
        </main>
      </body>
    </html>
  );
}
