"use client";

import React from "react";
import { IconButton, Tooltip } from "@mui/material";
import { Brightness4, Brightness7 } from "@mui/icons-material";
import { useTheme } from "../../../hooks/useTheme";

interface ThemeToggleProps {
  size?: "small" | "medium" | "large";
  showTooltip?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ size = "medium", showTooltip = true }) => {
  const { mode, toggleTheme } = useTheme();

  const toggleButton = (
    <IconButton onClick={toggleTheme} color="inherit" size={size} aria-label="toggle theme">
      {mode === "dark" ? <Brightness7 /> : <Brightness4 />}
    </IconButton>
  );

  if (showTooltip) {
    return <Tooltip title={`Switch to ${mode === "dark" ? "light" : "dark"} mode`}>{toggleButton}</Tooltip>;
  }

  return toggleButton;
};

export default ThemeToggle;
