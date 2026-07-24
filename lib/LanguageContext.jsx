"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { en } from "@/translations/en";
import { mr } from "@/translations/mr";

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState("mr"); // Default to Marathi

  useEffect(() => {
    const savedLang = localStorage.getItem("lang");
    if (savedLang) {
      setLanguage(savedLang);
    }
  }, []);

  const toggleLanguage = () => {
    const newLang = language === "en" ? "mr" : "en";
    setLanguage(newLang);
    localStorage.setItem("lang", newLang);
  };

  const t = (key) => {
    const keys = key.split(".");
    let value = language === "en" ? en : mr;
    
    for (const k of keys) {
      if (value && value[k] !== undefined) {
        value = value[k];
      } else {
        return key; // Return key if not found
      }
    }
    return value;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useTranslation must be used within a LanguageProvider");
  }
  return context;
};
