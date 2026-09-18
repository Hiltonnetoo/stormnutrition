import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Sidebar from "./Sidebar";
import Breadcrumbs from "./Breadcrumbs";
import { Dialog } from "./Dialog";
import { routeNameKey } from "../utils/routes";

const APP_NAME = "Storm Nutrition";

const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();
  const { t } = useTranslation();
  const mainRef = useRef<HTMLElement>(null);
  const previousPath = useRef(location.pathname);

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
        <main
          id="main-content"
          ref={mainRef}
          tabIndex={-1}
          className="flex-1 overflow-y-auto focus:outline-none"
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppShell;
