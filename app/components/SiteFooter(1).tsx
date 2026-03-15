import Footer from "./Footer";
import { getSettingsData } from "@/lib/fetchers";

export default async function SiteFooter() {
  const settings = await getSettingsData();
  const logoUrl = settings?.logoUrl || "";
  const companyName = settings?.companyName || "Forte Harbor Solution";
  const footerText =
    settings?.footerText || "Leading Education Consultancy Service";

  return (
    <Footer
      logoUrl={logoUrl}
      companyName={companyName}
      footerText={footerText}
    />
  );
}
