import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Dashboard } from "./pages/Dashboard";
import { CropDisease } from "./pages/CropDisease";
import { CropMonitoring } from "./pages/CropMonitoring";
import { CropRecommendation } from "./pages/CropRecommendation";
import { SoilIntelligence } from "./pages/SoilIntelligence";
import { IrrigationSystem } from "./pages/IrrigationSystem";
import { RiskPrediction } from "./pages/RiskPrediction";
import { WeatherAlerts } from "./pages/WeatherAlerts";
import { YieldEstimation } from "./pages/YieldEstimation";
import { MarketPrice } from "./pages/MarketPrice";
import { GovernmentSchemes } from "./pages/GovernmentSchemes";
import { Community } from "./pages/Community";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import { VerifyEmail } from "./pages/VerifyEmail";

export const router = createBrowserRouter([
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/signup",
    Component: Signup,
  },
  {
    path: "/verify-email",
    Component: VerifyEmail,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, Component: Dashboard },
      { path: "crop-disease", Component: CropDisease },
      { path: "monitoring", Component: CropMonitoring },
      { path: "recommendation", Component: CropRecommendation },
      { path: "soil", Component: SoilIntelligence },
      { path: "irrigation", Component: IrrigationSystem },
      { path: "risk", Component: RiskPrediction },
      { path: "weather", Component: WeatherAlerts },
      { path: "yield", Component: YieldEstimation },
      { path: "market", Component: MarketPrice },
      { path: "schemes", Component: GovernmentSchemes },
      { path: "community", Component: Community },
    ],
  },
]);