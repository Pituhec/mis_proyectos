import NavBar from "@/frontend/src/components/NavBar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 pb-16 lg:pb-0 lg:pl-60">
      {children}
      <NavBar />
    </div>
  );
}
