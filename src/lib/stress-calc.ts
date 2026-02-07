import { ProvinceProperties } from "@/data/mock-geo";

interface ActiveLayers {
  salinity: boolean;
  heat: boolean;
  flood: boolean;
  pollution: boolean;
}

export function calculateCompoundIndex(
  props: ProvinceProperties,
  activeLayers: ActiveLayers,
  amplifyFactor: number = 1.0
): { score: number; risk_level: string } {
  let sum = 0;
  let count = 0;

  if (activeLayers.salinity) {
    sum += props.salinity;
    count++;
  }
  if (activeLayers.heat) {
    sum += props.heat;
    count++;
  }
  if (activeLayers.flood) {
    sum += props.flood;
    count++;
  }
  if (activeLayers.pollution) {
    sum += props.pollution;
    count++;
  }

  if (count === 0) return { score: 0, risk_level: "low" };

  let score = sum / count;

  if (count >= 3) {
    score = score * 1.15 * amplifyFactor;
  } else {
    score = score * amplifyFactor;
  }

  score = Math.min(Math.max(score, 0), 1);

  let risk_level = "low";
  if (score >= 0.8) risk_level = "extreme";
  else if (score >= 0.6) risk_level = "high";
  else if (score >= 0.4) risk_level = "moderate";

  return { score, risk_level };
}
