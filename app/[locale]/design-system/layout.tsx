import { setRequestLocale } from "next-intl/server";

/**
 * Design System Layout
 * 
 * Minimal layout for design system documentation.
 * Removes e-commerce header/footer for clean docs experience.
 */
export default async function DesignSystemLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    setRequestLocale(locale);

    return (
        <div className="min-h-screen bg-background">
            {children}
        </div>
    );
}
