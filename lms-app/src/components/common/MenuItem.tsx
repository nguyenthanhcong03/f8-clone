"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface MenuItemProps {
  href: string;
  title: string;
  icon?: React.ReactNode;
}

export function MenuItem({ href = "/", title = "", icon }: MenuItemProps) {
  const pathname = usePathname();
  console.log("pathname", pathname);
  const isActive = pathname === href;
  return (
    <li>
      <Link
        href={href}
        className={`flex items-center gap-3 rounded-md p-3 transition-all ${
          isActive
            ? "bg-primary text-white"
            : "hover:bg-gray-100 hover:text-primary"
        }`}
      >
        {icon && <span className="mr-2 inline-block">{icon}</span>}
        {title}
      </Link>
    </li>
  );
}
