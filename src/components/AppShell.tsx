import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Sidebar from "./Sidebar";
import Breadcrumbs from "./Breadcrumbs";
import { Dialog } from "./Dialog";
import { routeNameKey } from "../utils/routes";
import ErrorBoundary from "./ErrorBoundary";
import { useAuth } from "../contexts/AuthContext";
import { DemoGuideModal } from "./modals/DemoGuideModal";
import { SparklesIcon, CloseIcon } from "./icons";

const APP_NAME = "Storm Nutrition";

const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [guideModalOpen, setGuideModalOpen] = useState(false);
  const { currentUser } = useAuth();
  const [bannerDismissed, setBannerDismissed] = useState(() => {
    try {
      return (
        sessionStorage.getItem("stormnutrition_demo_banner_dismissed") ===
        "true"
      );
    } catch {
      return false;
    }
  });

  const location = useLocation();
  const { t } = useTranslation();
  const mainRef = useRef<HTMLElement>(null);
  const previousPath = useRef(location.pathname);

  const isDemoSession = Boolean(
    currentUser?.email?.includes("@demo.stormnutrition.com") ||
    import.meta.env.VITE_USE_FIREBASE_EMULATOR === "true" ||
    import.meta.env.VITE_DEMO_MODE === "true",
  );

  const handleDismissBanner = () => {
    setBannerDismissed(true);
    try {
      sessionStorage.setItem("stormnutrition_demo_banner_dismissed", "true");
    } catch {
      // ignore
    }
  };

  // Route change: close the mobile drawer and move focus to the new content
  // (SPA navigation is otherwise silent for screen-reader and keyboard
  // users). Depends on the path only, so a language switch never moves focus.
  useEffect(() => {
    if (previousPath.current === location.pathname) return;
    previousPath.current = location.pathname;
    setDrawerOpen(false);
    mainRef.current?.focus({ preventScroll: true });
  }, [location.pathname]);

  // Name the page in the document title (follows the active language).
  useEffect(() => {
    const key = routeNameKey(location.pathname);
    document.title = key ? `${t(key)} · ${APP_NAME}` : APP_NAME;
  }, [location.pathname, t]);

  // The drawer only exists below the lg breakpoint; close it if the viewport
  // grows so the desktop layout is never left inert behind a hidden dialog.
  useEffect(() => {
    const desktop = window.matchMedia?.("(min-width: 1024px)");
    if (!desktop) return;
    const onChange = () => desktop.matches && setDrawerOpen(false);
    desktop.addEventListener("change", onChange);
    return () => desktop.removeEventListener("change", onChange);
  }, []);

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900 overflow-hidden">
      <a
        href="#main-content"
        onClick={(e) => {
          e.preventDefault();
          mainRef.current?.focus();
        }}
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[200] focus:rounded-xl focus:bg-white focus:px-4 focus:py-2.5 focus:text-sm focus:font-bold focus:text-sage-700 focus:shadow-pop focus:ring-2 focus:ring-sage-600"
      >
        {t("a11y.skip_to_content")}
      </a>

      {/* Desktop sidebar */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Mobile drawer */}
      <Dialog
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        label={t("a11y.navigation_menu")}
        overlayClassName="lg:hidden fixed inset-0 z-50 flex"
        backdropClassName="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-fade-in"
        className="relative animate-slide-in-right"
      >
        <Sidebar onNavigate={() => setDrawerOpen(false)} />
      </Dialog>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <Breadcrumbs onMenu={() => setDrawerOpen(true)} menuOpen={drawerOpen} />

        {isDemoSession && !bannerDismissed && (
          <div
            role="region"
            aria-label={t("demo.banner_title")}
            className="bg-gradient-to-r from-amber-500/15 via-sage-500/15 to-emerald-500/15 dark:from-amber-950/40 dark:via-sage-950/30 dark:to-emerald-950/40 border-b border-amber-200/80 dark:border-amber-800/40 px-4 py-2 sm:px-6 transition-all"
          >
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-xs text-slate-800 dark:text-slate-200">
                <span className="inline-block w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                <span className="font-bold text-amber-950 dark:text-amber-200">
                  {t("demo.banner_title")}:
                </span>
                <span className="hidden md:inline text-slate-600 dark:text-slate-400">
                  {t("demo.banner_desc")}
                </span>
              </div>
              <div className="flex items-center gap-2 self-end sm:self-auto">
                <button
                  type="button"
                  onClick={() => setGuideModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-950 dark:text-amber-200 font-bold text-xs transition-colors cursor-pointer"
                >
                  <SparklesIcon className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  {t("demo.guide_button")}
                </button>
                <button
                  type="button"
                  onClick={handleDismissBanner}
                  aria-label={t("demo.dismiss_banner")}
                  className="p-1 rounded-lg hover:bg-slate-200/60 dark:hover:bg-slate-700/60 text-slate-500 dark:text-slate-400 transition-colors cursor-pointer"
                >
                  <CloseIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        <main
          id="main-content"
          ref={mainRef}
          tabIndex={-1}
          className="flex-1 overflow-y-auto focus:outline-none"
        >
          <ErrorBoundary level="route" resetKey={location.pathname}>
            {children}
          </ErrorBoundary>
        </main>
      </div>

      <DemoGuideModal
        open={guideModalOpen}
        onClose={() => setGuideModalOpen(false)}
      />
    </div>
  );
};

export default AppShell;
