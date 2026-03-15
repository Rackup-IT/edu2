import Header from "./Header";
import { getSettingsData } from "@/lib/fetchers";

interface SiteHeaderProps {
  forceSticky?: boolean;
}

export default async function SiteHeader({
  forceSticky,
}: SiteHeaderProps = {}) {
  const settings = await getSettingsData();
  const logoUrl = settings?.logoUrl || "";
  const companyName = settings?.companyName || "Forte Harbor Solution";

  return (
    <Header
      logoUrl={logoUrl}
      companyName={companyName}
      forceSticky={forceSticky}
    />
  );
}
