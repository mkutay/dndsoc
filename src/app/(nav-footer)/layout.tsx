import { Footer } from "@/components/footer";
import { NavBar } from "@/components/nav-bar/nav-bar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NavBar />
      <div className="flex-1">{children}</div>
      <Footer />
    </>
  );
}
