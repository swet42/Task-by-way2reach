import "./globals.css";

export const metadata = {
  title: "Task Manager",
  description: "Manage your tasks",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen text-gray-900 antialiased">
        {children}
      </body>
    </html>
  );
}
