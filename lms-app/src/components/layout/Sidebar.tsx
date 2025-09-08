import { PlayCircle } from "lucide-react";
import React from "react";
import { menuItems } from "../../constants";
import Link from "next/link";
import { MenuItem } from "../common/MenuItem";

const Sidebar = () => {
  return (
    <div className="p-5 border-r border-gray-200 ">
      <a href="/" className="font-bold text-3xl inline-block">
        AhihiLMS
      </a>
      <ul className="mt-10 space-y-2">
        {menuItems.map((item, index) => (
          <MenuItem key={index} href={item.href} title={item.title} icon={item.icon} />
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
