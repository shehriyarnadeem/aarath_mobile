import { useMemo } from "react";
import { useLanguage } from "../context/LanguageContext";
import { categoryImages, categoryColors } from "../constants/categoryImages";

/**
 * Custom hook for getting home screen categories
 * Only returns the 5 allowed agricultural categories
 */
export const useHomeCategories = () => {
  const { t } = useLanguage();

  /**
   * Returns only the 5 allowed agricultural categories
   * According to project guidelines: wheat, rice, cotton, corn, barley
   */
  const categories = useMemo(
    () => [
      {
        id: "Wheat",
        name: t("categories.wheat"),
        image: categoryImages.wheat,
        color: categoryColors.wheat,
      },
      {
        id: "Rice",
        name: t("categories.rice"),
        image: categoryImages.rice,
        color: categoryColors.rice,
      },
      {
        id: "Cotton",
        name: t("categories.cotton"),
        image: categoryImages.cotton,
        color: categoryColors.cotton,
      },
      {
        id: "Corn",
        name: t("categories.corn"),
        image: categoryImages.corn,
        color: categoryColors.corn,
      },
      {
        id: "Barley",
        name: t("categories.barley"),
        image: categoryImages.barley,
        color: categoryColors.barley,
      },
    ],
    [t]
  );

  return categories;
};
