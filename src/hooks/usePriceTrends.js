import { useMemo } from "react";
import { useTheme } from "../constants/Theme";

/**
 * Custom hook for price trends data
 * Returns mock agricultural price trend data
 * TODO: Connect to real-time price API when available
 */
export const usePriceTrends = () => {
  const { modernColors } = useTheme();

  const priceTrends = useMemo(
    () => [
      {
        id: "1",
        name: "Basmati Rice",
        price: "120",
        change: "+2.5",
        trend: "up",
        icon: "leaf",
        color: modernColors.textPrimary,
      },
      {
        id: "2",
        name: "Wheat",
        price: "95",
        change: "-1.2",
        trend: "down",
        icon: "nutrition",
        color: modernColors.textPrimary,
      },
      {
        id: "3",
        name: "Maize",
        price: "85",
        change: "+0.8",
        trend: "up",
        icon: "sparkles",
        color: modernColors.textPrimary,
      },
      {
        id: "4",
        name: "Paddy",
        price: "75",
        change: "+1.5",
        trend: "up",
        icon: "flower",
        color: modernColors.textPrimary,
      },
      {
        id: "5",
        name: "Barley",
        price: "65",
        change: "-0.5",
        trend: "down",
        icon: "restaurant",
        color: modernColors.textPrimary,
      },
    ],
    [modernColors.textPrimary]
  );

  return priceTrends;
};
