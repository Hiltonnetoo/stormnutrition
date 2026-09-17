# Graph Report - Isanutri V5  (2026-09-17)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 703 nodes · 1856 edges · 28 communities (25 shown, 3 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 12 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `abd3a54e`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- firebaseService.ts
- DietGenerator.tsx
- PatientProfile.tsx
- Dashboard.tsx
- FoodDatabase.tsx
- NewPatientModal.tsx
- pdfExporter.ts
- BillingSection.tsx
- DietPlanViewer.tsx
- Calendar.tsx
- devDependencies
- Login.tsx
- build-foods.mjs
- icons.tsx
- compilerOptions
- package.json
- Home.tsx
- react
- Sidebar.tsx
- scripts
- App.tsx
- dependencies
- manifest.json
- EmailAdmin.tsx
- vite.config.ts
- eslint.config.js
- @playwright/test
- @testing-library/dom

## God Nodes (most connected - your core abstractions)
1. `react` - 60 edges
2. `react-i18next` - 46 edges
3. `Patient` - 38 edges
4. `useAuth()` - 32 edges
5. `getPatients()` - 19 edges
6. `Button` - 19 edges
7. `compilerOptions` - 17 edges
8. `react-router-dom` - 17 edges
9. `DietPlan` - 15 edges
10. `Dashboard()` - 15 edges

## Surprising Connections (you probably didn't know these)
- `Step4Props` --references--> `Patient`  [EXTRACTED]
  src/components/patient-form/Step4Nutritional.tsx → src/types/patient.ts
- `PatientDietHistoryModalProps` --references--> `Patient`  [EXTRACTED]
  src/components/modals/PatientDietHistoryModal.tsx → src/types/patient.ts
- `Props` --references--> `WeightRecord`  [EXTRACTED]
  src/components/patient-profile/WeightEvolutionChart.tsx → src/types/patient.ts
- `AuthContextType` --references--> `PatientPortalProfile`  [EXTRACTED]
  src/contexts/AuthContext.tsx → src/types/patient.ts
- `Props` --references--> `ClinicalTag`  [EXTRACTED]
  src/components/diet-generator/ClinicalTagSelector.tsx → src/types/diet.ts

## Import Cycles
- None detected.

## Communities (28 total, 3 thin omitted)

### Community 0 - "firebaseService.ts"
Cohesion: 0.06
Nodes (58): ref_firebase_firestore, ref_firebase_storage, ref_react_dom_client, App(), Props, WeightEvolutionChart(), AuthContext, AuthContextType (+50 more)

### Community 1 - "DietGenerator.tsx"
Cohesion: 0.06
Nodes (50): DietGenerator, ClinicalTagSelector(), Props, TagOption, tags, DietCalculations, DietFormData, MacroSplit (+42 more)

### Community 2 - "PatientProfile.tsx"
Cohesion: 0.06
Nodes (50): DietPlanDisplay(), DietPlanDisplayProps, ExportDietModal, loadTemplates(), translateMealName(), AlertTriangleIcon(), BrainIcon(), ClipboardListIcon() (+42 more)

### Community 3 - "Dashboard.tsx"
Cohesion: 0.08
Nodes (40): @emailjs/browser, ScaleIcon(), TrendingUpIcon(), UsersIcon(), UtensilsIcon(), PatientAccessModal(), useAuth(), ACTIVITY_ICON (+32 more)

### Community 4 - "FoodDatabase.tsx"
Cohesion: 0.09
Nodes (35): brazilianFoods, coreFoods, _seen, extraFoods, DietGenerator(), FoodDatabase(), loadCustomFoods(), dietTemplates (+27 more)

### Community 5 - "NewPatientModal.tsx"
Cohesion: 0.08
Nodes (30): EditIcon(), initialFormData, NewPatientModal(), NewPatientModalProps, Props, ProgressBar(), ProgressBarProps, steps (+22 more)

### Community 6 - "pdfExporter.ts"
Cohesion: 0.07
Nodes (32): html2canvas, jspdf, NutritionLabel(), NutritionLabelProps, MealOptionTable(), OptionTable(), parseAmounts(), parseFoodNames() (+24 more)

### Community 7 - "BillingSection.tsx"
Cohesion: 0.12
Nodes (25): @testing-library/react, vitest, CreditCardIcon(), BillingSection(), resources, src_locales_en_common, src_locales_pt_common, NOTE: vi.mock is hoisted, so the helpers must live inside the factory. (+17 more)

### Community 8 - "DietPlanViewer.tsx"
Cohesion: 0.16
Nodes (23): i18next, DietPlanViewer(), DietPlanViewerProps, isV2Plan(), translateMealName(), MetabolicCalculator(), ActivityLevel, activityMultipliers (+15 more)

### Community 9 - "Calendar.tsx"
Cohesion: 0.14
Nodes (20): Calendar, PageHeader(), ApptModalProps, Calendar(), TYPE_DOT, TYPE_LIGHT, addAppointment(), deleteAppointment() (+12 more)

### Community 10 - "devDependencies"
Cohesion: 0.08
Nodes (24): devDependencies, eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, @firebase/rules-unit-testing, globals, jsdom (+16 more)

### Community 11 - "Login.tsx"
Cohesion: 0.14
Nodes (19): ref_firebase_app, ref_firebase_auth, AuthLayout(), CheckCircleIcon(), EyeIcon(), EyeOffIcon(), GoogleIcon(), LogoIcon() (+11 more)

### Community 12 - "build-foods.mjs"
Cohesion: 0.15
Nodes (18): @firebase/rules-unit-testing, ref_node_fs, ref_node_path, ref_node_url, buildColumnIndex(), CANONICAL_CATEGORIES, CATEGORY_MAP, COLUMN_MAP (+10 more)

### Community 13 - "icons.tsx"
Cohesion: 0.16
Nodes (12): Patients, ClockIcon(), HeartIcon(), IconProps, PlusIcon(), SearchIcon(), ShieldIcon(), StarIcon() (+4 more)

### Community 14 - "compilerOptions"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, allowJs, experimentalDecorators, isolatedModules, jsx, lib, module (+9 more)

### Community 15 - "package.json"
Cohesion: 0.12
Nodes (16): name, private, type, version, eslint, firebase, @google/genai, jsdom (+8 more)

### Community 17 - "react"
Cohesion: 0.21
Nodes (12): react, react-i18next, react-router-dom, AppShell(), AuthLayoutProps, Breadcrumbs(), BreadcrumbsProps, routeNameMap (+4 more)

### Community 18 - "Sidebar.tsx"
Cohesion: 0.15
Nodes (8): BarChart3Icon(), LogInIcon(), TargetIcon(), deriveNotifications(), GlobalSearch(), NavItemProps, NotificationBell(), NotifItem

### Community 19 - "scripts"
Cohesion: 0.17
Nodes (12): scripts, build, dev, format, lint, preview, test, test:coverage (+4 more)

### Community 20 - "App.tsx"
Cohesion: 0.17
Nodes (10): Dashboard, FoodDatabase, Home, Login, MetabolicCalculator, PatientPortal, PatientProfile, Register (+2 more)

### Community 21 - "dependencies"
Cohesion: 0.18
Nodes (11): dependencies, @emailjs/browser, firebase, @google/genai, html2canvas, i18next, jspdf, react (+3 more)

### Community 22 - "manifest.json"
Cohesion: 0.20
Nodes (9): background_color, description, display, icons, name, orientation, short_name, start_url (+1 more)

### Community 23 - "EmailAdmin.tsx"
Cohesion: 0.25
Nodes (6): EmailAdmin, PaperAirplaneIcon(), XCircleIcon(), EmailLog, src_types_index_anydietplan, src_types_index_emaillog

### Community 24 - "vite.config.ts"
Cohesion: 0.29
Nodes (5): ref_path, @tailwindcss/vite, vite, @vitejs/plugin-react, ref_vitest_config

### Community 25 - "eslint.config.js"
Cohesion: 0.33
Nodes (5): @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals, typescript-eslint

## Knowledge Gaps
- **178 isolated node(s):** `MealSlot`, `DietProgressBarProps`, `LabCategory`, `V1_DietPlan`, `V1_Meal` (+173 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 252 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `firebaseService.ts`, `DietGenerator.tsx`, `PatientProfile.tsx`, `Dashboard.tsx`, `FoodDatabase.tsx`, `NewPatientModal.tsx`, `pdfExporter.ts`, `BillingSection.tsx`, `DietPlanViewer.tsx`, `Calendar.tsx`, `Login.tsx`, `icons.tsx`, `package.json`, `Home.tsx`, `Sidebar.tsx`, `App.tsx`, `EmailAdmin.tsx`?**
  _High betweenness centrality (0.174) - this node is a cross-community bridge._
- **Why does `react-i18next` connect `react` to `firebaseService.ts`, `DietGenerator.tsx`, `PatientProfile.tsx`, `Dashboard.tsx`, `FoodDatabase.tsx`, `NewPatientModal.tsx`, `pdfExporter.ts`, `BillingSection.tsx`, `DietPlanViewer.tsx`, `Calendar.tsx`, `Login.tsx`, `icons.tsx`, `package.json`, `Home.tsx`, `Sidebar.tsx`, `EmailAdmin.tsx`?**
  _High betweenness centrality (0.118) - this node is a cross-community bridge._
- **Why does `devDependencies` connect `devDependencies` to `package.json`?**
  _High betweenness centrality (0.062) - this node is a cross-community bridge._
- **What connects `MealSlot`, `DietProgressBarProps`, `LabCategory` to the rest of the system?**
  _178 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `firebaseService.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06180733162830349 - nodes in this community are weakly interconnected._
- **Should `DietGenerator.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.058823529411764705 - nodes in this community are weakly interconnected._
- **Should `PatientProfile.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06174863387978142 - nodes in this community are weakly interconnected._