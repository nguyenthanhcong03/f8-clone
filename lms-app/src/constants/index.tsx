import { Earth, PlayCircle } from "lucide-react";
import React from "react";

export const menuItems: {
  href: string;
  title: string;
  icon?: React.ReactNode;
}[] = [
  { href: "/", title: "Khu vực học tập", icon: <PlayCircle /> },
  { href: "/explore", title: "Khám phá", icon: <Earth /> },
];
