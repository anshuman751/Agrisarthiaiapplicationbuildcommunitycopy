import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
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

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
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
