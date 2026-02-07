import { create } from "zustand";
import { ProvinceProperties } from "@/data/mock-geo";

export type LayerType = "salinity" | "heat" | "flood" | "pollution";

interface LayerState {
  activeLayers: Record<LayerType, boolean>;
  opacity: number;
  amplifyFactor: number;
  selectedProvince: ProvinceProperties | null;

  toggleLayer: (layer: LayerType) => void;
  setOpacity: (val: number) => void;
  setAmplify: (val: number) => void;
  setSelectedProvince: (prov: ProvinceProperties | null) => void;
}

export const useLayerStore = create<LayerState>((set) => ({
  activeLayers: {
    salinity: true,
    heat: false,
    flood: false,
    pollution: false,
  },
  opacity: 0.7,
  amplifyFactor: 1.0,
  selectedProvince: null,

  toggleLayer: (layer) =>
    set((state) => ({
      activeLayers: {
        ...state.activeLayers,
        [layer]: !state.activeLayers[layer],
      },
    })),

  setOpacity: (val) => set({ opacity: val }),
  setAmplify: (val) => set({ amplifyFactor: val }),
  setSelectedProvince: (prov) => set({ selectedProvince: prov }),
}));
