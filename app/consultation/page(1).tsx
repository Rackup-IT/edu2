import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import ConsultationForm from "./ConsultationForm";

export default function ConsultationPage() {
  return (
    <main className="w-full bg-white min-h-screen flex flex-col">
      <div className="relative z-50">
         <SiteHeader />
      </div>

      <ConsultationForm />

      <SiteFooter />
    </main>
  );
}
