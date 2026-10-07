import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/aboutus", label: "About" },
  { href: "/faculty", label: "Faculty" },
  { href: "/services", label: "Services" },
  { href: "/Training", label: "Training" },
  { href: "/contact", label: "Contact" },
  { href: "/donate", label: "Donate" },
];

const resourceLinks = [
  { href: "/patient-stories", label: "Patient Stories" },
  { href: "/educational-videos", label: "Educational Videos" },
  { href: "/activities", label: "Activities" },
  { href: "/news", label: "In The News" },
  { href: "/documents", label: "Documents" },
  { href: "/links", label: "External Links" },
];

const LOGO_ALT = "Department of Palliative Medicine, CMC Vellore – Home";
const DESKTOP_QUERY = "(min-width: 1100px)";

export default function Navbar() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const hamburgerRef = useRef(null);
  const closeRef = useRef(null);
  const menuRef = useRef(null);
  const dropdownRef = useRef(null);
  const wasOpen = useRef(false);

  const isCurrent = (href) => (router.asPath.split(/[?#]/)[0] === href ? "page" : undefined);

  // Scroll lock + focus management for the mobile menu
  useEffect(() => {
    document.documentElement.classList.toggle("nav-open", mobileMenuOpen);
    if (mobileMenuOpen) {
      requestAnimationFrame(() => closeRef.current?.focus());
    } else if (wasOpen.current) {
      hamburgerRef.current?.focus();
    }
    wasOpen.current = mobileMenuOpen;
    return () => document.documentElement.classList.remove("nav-open");
  }, [mobileMenuOpen]);

  // Close everything on navigation, Escape, outside clicks and desktop resize
  useEffect(() => {
    const closeAll = () => {
      setMobileMenuOpen(false);
      setDropdownOpen(false);
    };
    const onKeyDown = (e) => {
      if (e.key === "Escape") closeAll();
    };
    const onClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false);
    };
    const desktop = window.matchMedia(DESKTOP_QUERY);
    const onDesktop = (e) => e.matches && setMobileMenuOpen(false);

    router.events.on("routeChangeStart", closeAll);
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("click", onClick);
    desktop.addEventListener("change", onDesktop);
    return () => {
      router.events.off("routeChangeStart", closeAll);
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("click", onClick);
      desktop.removeEventListener("change", onDesktop);
    };
  }, [router.events]);

  // Keep keyboard focus inside the open mobile menu
  const trapFocus = (e) => {
    if (e.key !== "Tab") return;
    const focusable = Array.from(menuRef.current.querySelectorAll("a[href], button")).filter(
      (el) => el.offsetParent !== null
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  const renderDesktopLink = (link) => (
    <li className="nav-item" key={link.href}>
      <Link href={link.href} aria-current={isCurrent(link.href)}>
        {link.label}
      </Link>
    </li>
  );

  const renderMobileLink = (link) => (
    <li key={link.href}>
      <Link
        href={link.href}
        className="nav-link"
        aria-current={isCurrent(link.href)}
        onClick={() => setMobileMenuOpen(false)}
      >
        {link.label}
      </Link>
    </li>
  );

  return (
    <>
      <header className="navbar-container">
        <nav className="navbar" aria-label="Main">
          <Link href="/" className="navbar-logo">
            <img src="/Images/we in the spot.png" width="1000" height="193" alt={LOGO_ALT} />
          </Link>
          <ul className="navbar-links">
            {navLinks.slice(0, 5).map(renderDesktopLink)}
            <li
              className="nav-item dropdown"
              ref={dropdownRef}
              onBlur={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget)) setDropdownOpen(false);
              }}
            >
              <button
                type="button"
                className="dropdown-toggle"
                aria-expanded={dropdownOpen}
                aria-controls="resources-menu"
                onClick={() => setDropdownOpen((prev) => !prev)}
              >
                Resources <span className="dropdown-icon" aria-hidden="true">▼</span>
              </button>
              <ul className={`dropdown-menu${dropdownOpen ? " open" : ""}`} id="resources-menu">
                {resourceLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} aria-current={isCurrent(link.href)}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
            {navLinks.slice(5).map(renderDesktopLink)}
          </ul>
          <button
            type="button"
            ref={hamburgerRef}
            className="hamburger"
            aria-label="Open menu"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="hamburger-icon" aria-hidden="true"></span>
          </button>
        </nav>
      </header>

      <div
        ref={menuRef}
        id="mobile-menu"
        className={`mobile-menu${mobileMenuOpen ? " active" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        onKeyDown={trapFocus}
      >
        <div className="mobile-menu-header">
          <Link href="/" onClick={() => setMobileMenuOpen(false)}>
            <img src="/Images/we in the spot.png" width="1000" height="193" alt={LOGO_ALT} className="mobile-logo" />
          </Link>
          <button
            type="button"
            ref={closeRef}
            className="close-menu"
            aria-label="Close menu"
            onClick={() => setMobileMenuOpen(false)}
          >
            <span aria-hidden="true">✕</span>
          </button>
        </div>
        <nav className="mobile-menu-content" aria-label="Mobile">
          <ul>
            {navLinks.slice(0, 5).map(renderMobileLink)}
            <li>
              <button
                type="button"
                className="mobile-dropdown-trigger"
                aria-expanded={mobileDropdownOpen}
                aria-controls="mobile-resources"
                onClick={() => setMobileDropdownOpen((prev) => !prev)}
              >
                Resources
              </button>
              <ul className="mobile-dropdown" id="mobile-resources" hidden={!mobileDropdownOpen}>
                {resourceLinks.map(renderMobileLink)}
              </ul>
            </li>
            {navLinks.slice(5).map(renderMobileLink)}
          </ul>
        </nav>
      </div>
      <style jsx global>{`
        .navbar-container,
        .mobile-menu {
          --nav-bg: #002855;
          --nav-fg: #ffffff;
          --nav-focus: #ffd166;
          --nav-height: 72px;
          font-family: "Montserrat", sans-serif;
        }

        .navbar-container {
          display: flex;
          justify-content: center;
          background-color: var(--nav-bg);
          width: 100%;
          position: relative;
          z-index: 1000;
        }

        .navbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          max-width: 1352px;
          width: 100%;
          height: var(--nav-height);
          padding: 0 16px;
        }

        .navbar-logo {
          display: block;
          flex: 0 1 auto;
          min-width: 0;
          border-radius: 4px;
        }

        .navbar-logo img {
          display: block;
          height: 48px;
          width: auto;
          max-width: 100%;
          object-fit: contain;
        }

        .navbar-container a:focus-visible,
        .navbar-container button:focus-visible,
        .mobile-menu a:focus-visible,
        .mobile-menu button:focus-visible {
          outline: 3px solid var(--nav-focus);
          outline-offset: 3px;
        }

        .navbar-links {
          display: none;
          align-items: center;
          list-style: none;
          margin: 0;
          padding: 0;
          gap: 20px;
        }

        .nav-item {
          position: relative;
        }

        .nav-item > a,
        .dropdown-toggle {
          display: inline-flex;
          align-items: center;
          min-height: 44px;
          padding: 0 2px;
          color: var(--nav-fg);
          background: none;
          border: 0;
          font: inherit;
          font-weight: 600;
          font-size: 16px;
          text-decoration: none;
          white-space: nowrap;
          cursor: pointer;
        }

        .nav-item > a:hover,
        .dropdown-toggle:hover,
        .nav-item > a[aria-current="page"] {
          text-decoration: underline;
          text-underline-offset: 6px;
          text-decoration-thickness: 2px;
        }

        .dropdown-icon {
          margin-left: 6px;
          font-size: 12px;
          transition: transform 0.2s ease;
        }

        .dropdown-toggle[aria-expanded="true"] .dropdown-icon {
          transform: rotate(180deg);
        }

        .dropdown-menu {
          display: none;
          position: absolute;
          top: 100%;
          left: -16px;
          margin: 0;
          padding: 8px 0;
          min-width: 220px;
          list-style: none;
          background-color: var(--nav-bg);
          border-radius: 8px;
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.25);
          z-index: 1001;
        }

        .dropdown-menu.open {
          display: block;
        }

        @media (hover: hover) and (pointer: fine) {
          .nav-item.dropdown:hover .dropdown-menu {
            display: block;
          }
        }

        .dropdown-menu a {
          display: block;
          padding: 10px 16px;
          color: var(--nav-fg);
          font-weight: 500;
          font-size: 15px;
          text-decoration: none;
        }

        .dropdown-menu a:hover,
        .dropdown-menu a[aria-current="page"] {
          background-color: rgba(255, 255, 255, 0.1);
          text-decoration: underline;
        }

        .hamburger {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex: 0 0 auto;
          width: 48px;
          height: 48px;
          padding: 0;
          background: none;
          border: 0;
          border-radius: 6px;
          cursor: pointer;
        }

        .hamburger-icon,
        .hamburger-icon::before,
        .hamburger-icon::after {
          display: block;
          width: 26px;
          height: 3px;
          border-radius: 2px;
          background-color: var(--nav-fg);
        }

        .hamburger-icon {
          position: relative;
        }

        .hamburger-icon::before,
        .hamburger-icon::after {
          content: "";
          position: absolute;
          left: 0;
        }

        .hamburger-icon::before {
          top: -8px;
        }

        .hamburger-icon::after {
          top: 8px;
        }

        @media (min-width: 1100px) {
          .navbar-container {
            --nav-height: 100px;
          }

          .navbar {
            padding: 0 32px;
          }

          .navbar-logo img {
            height: 56px;
          }

          .navbar-links {
            display: flex;
          }

          .hamburger,
          .mobile-menu {
            display: none;
          }
        }

        @media (min-width: 1280px) {
          .navbar-logo img {
            height: 70px;
          }

          .navbar-links {
            gap: 32px;
          }
        }

        @media (max-width: 360px) {
          .navbar {
            padding: 0 8px;
          }

          .navbar-logo img {
            height: 40px;
          }
        }

        .mobile-menu {
          position: fixed;
          inset: 0;
          z-index: 1100;
          display: flex;
          flex-direction: column;
          background-color: var(--nav-bg);
          color: var(--nav-fg);
          transform: translateY(-100%);
          visibility: hidden;
          transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1), visibility 0s linear 0.35s;
        }

        .mobile-menu.active {
          transform: translateY(0);
          visibility: visible;
          transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1), visibility 0s;
        }

        .mobile-menu-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          flex: 0 0 auto;
          height: var(--nav-height);
          padding: 0 16px;
        }

        .mobile-logo {
          display: block;
          height: 48px;
          width: auto;
          max-width: 100%;
          object-fit: contain;
        }

        .close-menu {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex: 0 0 auto;
          width: 48px;
          height: 48px;
          padding: 0;
          color: var(--nav-fg);
          background: none;
          border: 0;
          border-radius: 6px;
          font-size: 26px;
          line-height: 1;
          cursor: pointer;
        }

        .mobile-menu-content {
          flex: 1 1 auto;
          overflow-y: auto;
          overscroll-behavior: contain;
          padding: 8px 20px calc(24px + env(safe-area-inset-bottom, 0px));
        }

        .mobile-menu-content ul {
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .mobile-menu-content li {
          border-bottom: 1px solid rgba(255, 255, 255, 0.12);
        }

        .mobile-menu .nav-link,
        .mobile-dropdown-trigger {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          min-height: 52px;
          padding: 12px 0;
          color: var(--nav-fg);
          background: none;
          border: 0;
          font: inherit;
          font-size: 18px;
          font-weight: 600;
          text-align: left;
          text-decoration: none;
          cursor: pointer;
        }

        .mobile-menu .nav-link[aria-current="page"] {
          text-decoration: underline;
          text-underline-offset: 6px;
        }

        .mobile-dropdown-trigger::after {
          content: "+";
          content: "+" / "";
          font-size: 26px;
          font-weight: 400;
          line-height: 1;
        }

        .mobile-dropdown-trigger[aria-expanded="true"]::after {
          content: "\\2212";
          content: "\\2212" / "";
        }

        .mobile-dropdown {
          padding-left: 16px;
          background-color: rgba(255, 255, 255, 0.05);
        }

        .mobile-dropdown[hidden] {
          display: none;
        }

        .mobile-dropdown li:last-child {
          border-bottom: 0;
        }

        .mobile-dropdown .nav-link {
          font-size: 16px;
          font-weight: 500;
          min-height: 48px;
        }

        @media (prefers-reduced-motion: reduce) {
          .mobile-menu,
          .mobile-menu.active,
          .dropdown-icon {
            transition: none;
          }
        }

        html.nav-open,
        html.nav-open body {
          overflow: hidden;
        }
      `}</style>
    </>
  );
}
