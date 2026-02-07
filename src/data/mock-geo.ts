export interface ProvinceProperties {
  id: string;
  name: string;
  salinity: number;
  heat: number;
  flood: number;
  pollution: number;
  compound_index?: number;
  risk_level?: string;
}

interface Feature {
  type: "Feature";
  properties: ProvinceProperties;
  geometry: {
    type: "Polygon";
    coordinates: number[][][];
  };
}

export const MEKONG_GEOJSON: {
  type: "FeatureCollection";
  features: Feature[];
} = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        id: "CT",
        name: "Can Tho",
        salinity: 0.2,
        heat: 0.8,
        flood: 0.6,
        pollution: 0.4,
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [105.5, 10.2],
            [105.9, 10.2],
            [105.9, 9.8],
            [105.5, 9.8],
            [105.5, 10.2],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        id: "AG",
        name: "An Giang",
        salinity: 0.1,
        heat: 0.6,
        flood: 0.9,
        pollution: 0.3,
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [104.9, 10.9],
            [105.5, 10.9],
            [105.5, 10.3],
            [104.9, 10.3],
            [104.9, 10.9],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        id: "CM",
        name: "Ca Mau",
        salinity: 0.95,
        heat: 0.5,
        flood: 0.8,
        pollution: 0.2,
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [104.7, 9.6],
            [105.3, 9.6],
            [105.3, 8.5],
            [104.7, 8.5],
            [104.7, 9.6],
          ],
        ],
      },
    },
  ],
};
