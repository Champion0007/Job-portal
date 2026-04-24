"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLoading } from "./LoadingContext";
import { useEffect } from "react";

export default function LoadingLink({ href, children, className, onClick, ...props }) {
  const pathname = usePathname();
  const { startLoading, stopLoading } = useLoading();

  useEffect(() => {
    // Stop loading when pathname changes (navigation completed)
    if (pathname) {
      const timer = setTimeout(() => {
        stopLoading();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [pathname, stopLoading]);

  const handleClick = (e) => {
    // Don't trigger loading for external links or links with modifiers
    if (
      href.startsWith("http") ||
      href.startsWith("mailto:") ||
      href.startsWith("tel:") ||
      e.ctrlKey ||
      e.metaKey ||
      e.shiftKey ||
      e.altKey ||
      href === pathname
    ) {
      if (onClick) onClick(e);
      return;
    }

    // Trigger loading for internal navigation
    startLoading();
    if (onClick) onClick(e);
  };

  return (
    <Link href={href} className={className} onClick={handleClick} {...props}>
      {children}
    </Link>
  );
}

