import { getThemeData } from "@/lib/fetchers";

export default async function ThemeRegistry() {
  const theme = await getThemeData();

  if (!theme) return null;

  return (
    <style dangerouslySetInnerHTML={{ __html: `
      :root {
        --brand-yellow: ${theme.primaryColor};
        --brand-yellow-hover: ${theme.primaryHoverColor || '#eac45a'};
        --background: ${theme.backgroundColor};
        --foreground: ${theme.foregroundColor};
      }
    `}} />
  );
}
