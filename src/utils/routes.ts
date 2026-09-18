/** i18n key of each professional route, shared by breadcrumbs and the document title. */
export const routeNameMap: Record<string, string> = {
  "/dashboard": "nav.overview",
  "/patients": "nav.patients",
  "/calendar": "nav.calendar",
  "/diet-generator": "nav.diet_generator",
  "/metabolic-calculator": "nav.metabolic_calculator",
  "/food-database": "nav.food_database",
  "/reports": "nav.reports",
  "/email-admin": "nav.send_plans",
  "/settings": "nav.settings",
};

/** Name key for any pathname, including the dynamic /patients/:id route. */
export const routeNameKey = (pathname: string): string | undefined => {
  if (routeNameMap[pathname]) return routeNameMap[pathname];
  if (/^\/patients\/[^/]+$/.test(pathname)) return "nav.patient_profile";
  return undefined;
};
