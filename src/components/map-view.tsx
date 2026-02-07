"use client";

import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, GeoJSON, ZoomControl, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useLayerStore } from "@/store/layer-store";
import { MEKONG_GEOJSON, ProvinceProperties } from "@/data/mock-geo";
import { calculateCompoundIndex } from "@/lib/stress-calc";
import L from "leaflet";

// Component phụ để cập nhật giao diện khi store thay đổi
function MapUpdater() {
  const map = useMap();
  const activeLayers = useLayerStore((state) => state.activeLayers);
  const opacity = useLayerStore((state) => state.opacity);
  const amplifyFactor = useLayerStore((state) => state.amplifyFactor);

  useEffect(() => {
    map.eachLayer((layer) => {
      if (layer instanceof L.GeoJSON) {
        // @ts-ignore: Accessing internal leaflet options to force style update
        layer.setStyle(layer.options.style);
      }
    });
  }, [activeLayers, opacity, amplifyFactor, map]);

  return null;
}

export default function MapView() {
  const activeLayers = useLayerStore((state) => state.activeLayers);
  const opacity = useLayerStore((state) => state.opacity);
  const amplifyFactor = useLayerStore((state) => state.amplifyFactor);
  const setSelectedProvince = useLayerStore((state) => state.setSelectedProvince);
  const selectedProvince = useLayerStore((state) => state.selectedProvince);

  // 🔥 FIX LỖI CLICK: Dùng Ref để luôn lấy giá trị mới nhất bên trong event listener
  const stateRef = useRef({ activeLayers, amplifyFactor, opacity });

  // Cập nhật Ref mỗi khi store thay đổi
  useEffect(() => {
    stateRef.current = { activeLayers, amplifyFactor, opacity };
  }, [activeLayers, amplifyFactor, opacity]);

  // Hàm tính style (dùng cho hiển thị)
  const styleProvince = (feature: any) => {
    const props = feature.properties as ProvinceProperties;
    
    // Tính toán dựa trên state hiện tại
    const result = calculateCompoundIndex(props, activeLayers, amplifyFactor);

    let color = "#10b981"; // Low (Green)
    if (result.risk_level === "moderate") color = "#eab308"; // Yellow
    if (result.risk_level === "high") color = "#f97316";     // Orange
    if (result.risk_level === "extreme") color = "#ef4444";  // Red

    const isSelected = selectedProvince?.id === props.id;

    return {
      fillColor: color,
      weight: isSelected ? 3 : 1,
      opacity: 1,
      color: isSelected ? "#22d3ee" : "white", // Cyan border if selected
      dashArray: isSelected ? "" : "3",
      fillOpacity: result.score * 0.8 * opacity + 0.2,
    };
  };

  const onEachFeature = (feature: any, layer: L.Layer) => {
    layer.on({
      click: (e) => {
        L.DomEvent.stopPropagation(e);
        
        const props = feature.properties as ProvinceProperties;
        
        // 🔥 QUAN TRỌNG: Dùng state từ REF để tính toán chính xác tại thời điểm click
        const currentRef = stateRef.current;
        const result = calculateCompoundIndex(
            props, 
            currentRef.activeLayers, 
            currentRef.amplifyFactor
        );
        
        const enrichedData = {
          ...props,
          compound_index: result.score,
          risk_level: result.risk_level // Đã sửa từ .level thành .risk_level
        };

        console.log("🖱️ Clicked with live data:", enrichedData);
        setSelectedProvince(enrichedData);
      },
      mouseover: (e) => {
        const layer = e.target;
        layer.setStyle({ weight: 3, color: "#fff", fillOpacity: 0.9 });
      },
      mouseout: (e) => {
        const layer = e.target;
        // Logic reset style đơn giản
        // Lưu ý: MapUpdater sẽ lo phần render lại màu đúng sau 1 tick
        if (selectedProvince?.id !== feature.properties.id) {
             layer.setStyle({ weight: 1, color: "white", dashArray: "3" });
        }
      }
    });
  };

  return (
    <div className="w-full h-full relative z-0">
      <MapContainer
        center={[10.0, 105.5]}
        zoom={8}
        className="w-full h-full bg-slate-900"
        zoomControl={false} // 1. Tắt zoom mặc định (trái)
      >
        <MapUpdater />
        
        {/* 2. Thêm zoom mới ở góc phải */}
        <ZoomControl position="topright" />

        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        <GeoJSON 
          // @ts-ignore
          data={MEKONG_GEOJSON} 
          style={styleProvince}
          onEachFeature={onEachFeature}
        />
      </MapContainer>
    </div>
  );
}
