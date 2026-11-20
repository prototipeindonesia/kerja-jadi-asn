import Navbar from "@/components/Navbar";
import AdminGuard from "@/components/AdminGuard";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <AdminGuard>
        <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
      </AdminGuard>
    </>
  );
}