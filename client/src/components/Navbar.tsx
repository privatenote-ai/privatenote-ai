import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'wouter';
import { Menu, X, Lock, Sparkles, Shield, ShieldCheck, FileText, Info, Mail, Key, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Logo } from '@/components/Logo';
import { useLanguage } from '@/context/LanguageContext';
import { isLocaleSiteHomeHref, localizedPath } from '@/utils/localizedPath';
import { shouldEagerPrefetchAuth } from '@/utils/authPrefetch';

// Custom NavLink component that closes the menu when clicked
interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  closeMenu: () => void;
}

const NavLink: React.FC<NavLinkProps> = ({ href, children, className, closeMenu }) => {
  const [_, navigate] = useLocation();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    closeMenu();

    // For the home path, force a full reload if we're already on home or viewing a note
    // This resets any in-page state (e.g., success view) back to the note editor.
    if (
      isLocaleSiteHomeHref(href) &&
      (isLocaleSiteHomeHref(window.location.pathname) || window.location.pathname.startsWith('/note/'))
    ) {
      window.location.href = href;
    } else {
      navigate(href);
    }
  };

  return (
    <a href={href} onClick={handleClick} className={className}>
      {children}
    </a>
  );
};

type MobileSheet = "closed" | "nav" | "account";

export const Navbar: React.FC = () => {
  const [mobileSheet, setMobileSheet] = useState<MobileSheet>("closed");
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, loading: authLoading, signOut, refresh: refreshAuth } = useAuth();
  const { language, t } = useLanguage();
  const profileRef = useRef<HTMLDivElement>(null);
  const [location] = useLocation();

  // Solid translucent bg only after the user scrolls; transparent on hero
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 8);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMobileSheetsAndProfile = useCallback(() => {
    setMobileSheet("closed");
    setIsProfileOpen(false);
  }, []);

  /** Mobile nav drawer + desktop profile dropdown: close overlays when navigating */
  const closeMenu = closeMobileSheetsAndProfile;

  const toggleMobileNav = useCallback(() => {
    setMobileSheet((s) => {
      if (s === "nav") return "closed";
      return "nav";
    });
  }, []);

  const toggleMobileAccount = useCallback(() => {
    setMobileSheet((s) => (s === "account" ? "closed" : "account"));
  }, []);

  // Handle clicks outside of desktop profile menu.
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Close menus on route change, and re-check auth state.
  // This is a safety net so the navbar always reflects sign-in state after
  // any auth flow completes and redirects, even if the flow forgot to await refresh().
  useEffect(() => {
    setMobileSheet("closed");
    setIsProfileOpen(false);
    if (shouldEagerPrefetchAuth(location)) {
      void refreshAuth();
    }
  }, [location, refreshAuth]);

  // Mobile sheet: reduce background scroll while open (avoid `position:fixed` on body — breaks nested `fixed` nav).
  useEffect(() => {
    if (mobileSheet === "closed") return;
    const html = document.documentElement;
    const body = document.body;
    const prevHtmlOverflow = html.style.overflow;
    const prevBodyOverflow = body.style.overflow;
    const prevOverscroll = body.style.overscrollBehavior;
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    body.style.overscrollBehavior = "none";
    return () => {
      html.style.overflow = prevHtmlOverflow;
      body.style.overflow = prevBodyOverflow;
      body.style.overscrollBehavior = prevOverscroll;
    };
  }, [mobileSheet]);

  useEffect(() => {
    if (mobileSheet === "closed") return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeMenu();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [mobileSheet, closeMenu]);

  const isAuthRoute = location.startsWith('/auth');
  const lp = (path: string) => localizedPath(path, language);

  const initials = React.useMemo(() => {
    if (!user?.email) return 'U';
    const local = user.email.split('@')[0] || '';
    const parts = local.split(/[._-]+/).filter(Boolean);
    const chars = parts.length ? parts.map((part) => part[0]) : [local[0]];
    return chars.filter(Boolean).slice(0, 2).join('').toUpperCase();
  }, [user?.email]);

  const logoInner = (
    <>
      <Logo size={30} className="shrink-0" />
      <span className="font-bold text-xl sm:text-2xl text-primary">
        privateNote
        <span className="text-xs text-primary align-super ml-0.5">.ai</span>
      </span>
    </>
  );

  /** Desktop nav link — visible pill hover with a slight lift */
  const desktopLink =
    "relative px-3 py-1.5 text-sm font-medium text-primary rounded-md shadow-none transition-all duration-150 hover:text-black dark:hover:text-black hover:bg-primary/12 dark:hover:bg-primary/18 hover:-translate-y-px hover:shadow-none outline-none focus:outline-none focus:ring-0 lg:text-[15px] whitespace-nowrap";

  const authButtonLink =
    "inline-flex items-center whitespace-nowrap rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary/90 outline-none focus:outline-none focus:ring-0";

  const mobileItemClass =
    "flex items-center gap-3 px-5 py-4 text-base font-medium text-primary transition-colors hover:text-black dark:hover:text-black hover:bg-gray-50 dark:hover:bg-gray-800/60";

  const navShellClass = [
    'fixed top-0 left-0 right-0 z-50 overflow-visible',
    'transition-[background-color,backdrop-filter,box-shadow,border-color] duration-200',
    isScrolled
      ? 'bg-background/95 backdrop-blur-md border-b border-blue-100 dark:border-gray-800 shadow-[0_1px_6px_rgba(15,23,42,0.06)]'
      : 'bg-transparent border-b border-transparent shadow-none backdrop-blur-0',
  ].join(' ');

  const authCluster = user?.email || !isAuthRoute ? (
    user?.email ? (
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsProfileOpen((open) => !open)}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white"
          aria-haspopup="menu"
          aria-expanded={isProfileOpen}
        >
          {initials}
        </button>
        {isProfileOpen && (
          <div className="absolute right-0 mt-2 w-52 overflow-hidden rounded-md border border-gray-200 bg-white shadow-lg dark:border-gray-800 dark:bg-gray-900">
            <div className="border-b border-gray-200 px-4 py-3 dark:border-gray-800">
              <p className="text-xs text-gray-500 dark:text-gray-400">{t.signedInAs}</p>
              <p className="truncate text-sm font-medium text-gray-900 dark:text-white">{user.email}</p>
            </div>
            <div className="py-1">
              <NavLink
                href="/account"
                closeMenu={closeMenu}
                className="block px-4 py-2 text-sm text-primary hover:text-black dark:hover:text-black hover:bg-gray-50 dark:hover:bg-gray-800/60"
              >
                {t.account}
              </NavLink>
              <NavLink
                href="/account/security"
                closeMenu={closeMenu}
                className="block px-4 py-2 text-sm text-primary hover:text-black dark:hover:text-black hover:bg-gray-50 dark:hover:bg-gray-800/60"
              >
                {t.security}
              </NavLink>
              <button
                type="button"
                onClick={() => {
                  signOut();
                  setIsProfileOpen(false);
                }}
                className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-800/60"
              >
                {t.signOut}
              </button>
            </div>
          </div>
        )}
      </div>
    ) : (
      <NavLink
        href="/auth"
        closeMenu={closeMenu}
        className={authButtonLink}
      >
        {t.signIn}
      </NavLink>
    )
  ) : null;

  return (
    <>
    <nav className={navShellClass}>
      {/* Desktop ≥ xl only. Below xl the layout is too tight for 6 nav links + logo + auth,
          so we keep the mobile hamburger menu through tablet / 13" laptop widths. */}
      <div className="hidden xl:block px-4 sm:px-6 lg:px-8">
        <div className="relative mx-auto flex h-16 max-w-4xl items-center gap-6">
          {/* Logo — sits just outside the left edge of the editor column */}
          <NavLink
            href={lp("/")}
            closeMenu={closeMenu}
            className="absolute right-full top-1/2 -translate-y-1/2 pr-6 flex shrink-0 cursor-pointer items-center gap-2 whitespace-nowrap"
            aria-label="PrivateNote.ai home"
          >
            {logoInner}
          </NavLink>

          {/* Primary links — centered group aligned to the editor column */}
          <nav
            className="flex min-w-0 flex-1 items-center justify-center gap-x-7 2xl:gap-x-8"
            aria-label="Primary"
          >
            <NavLink href={lp("/")} closeMenu={closeMenu} className={desktopLink}>
              {t.writeNote}
            </NavLink>
            <NavLink href={lp("/password-generator")} closeMenu={closeMenu} className={desktopLink}>
              {t.sharePassword}
            </NavLink>
            <NavLink href={lp("/how-it-works")} closeMenu={closeMenu} className={desktopLink}>
              {t.howItWorks}
            </NavLink>
            <NavLink href={lp("/security-resources")} closeMenu={closeMenu} className={desktopLink}>
              {t.security}
            </NavLink>
            <NavLink href={lp("/blog")} closeMenu={closeMenu} className={desktopLink}>
              {t.blog}
            </NavLink>
            <NavLink href={lp("/about")} closeMenu={closeMenu} className={desktopLink}>
              {t.about}
            </NavLink>
          </nav>

          {/* Auth — sits just outside the right edge of the editor column */}
          {authCluster && (
            <div
              className="absolute left-full top-1/2 -translate-y-1/2 pl-4 2xl:pl-6 flex min-w-max shrink-0 items-center gap-2.5 2xl:gap-3"
              ref={user?.email ? profileRef : undefined}
            >
              {authCluster}
            </div>
          )}
        </div>
      </div>

      {/* Mobile / tablet / smaller laptop < xl */}
      <div className="xl:hidden">
        <div className="mx-auto grid h-16 max-w-4xl grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 px-4 sm:px-6">
          <div className="flex h-9 min-h-9 min-w-9 items-center justify-start">
            {user?.email ? (
              <button
                type="button"
                onClick={toggleMobileAccount}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white shadow-sm transition-transform hover:scale-105 focus:outline-none focus:ring-0"
                aria-expanded={mobileSheet === "account"}
                aria-controls="mobile-account-sheet"
                aria-label={`${t.account} · ${user.email}`}
                title={user.email}
              >
                {initials}
              </button>
            ) : null}
          </div>

          <NavLink
            href={lp("/")}
            closeMenu={closeMenu}
            className="mx-auto flex min-w-0 max-w-full shrink items-center justify-center gap-2 overflow-hidden whitespace-nowrap"
          >
            {logoInner}
          </NavLink>

          <div className="flex w-10 shrink-0 items-center justify-end">
            <button
              type="button"
              onClick={toggleMobileNav}
              className="nav-icon-button inline-flex h-10 w-10 items-center justify-center text-primary transition-colors hover:text-primary/80 focus:outline-none focus:ring-0"
              aria-expanded={mobileSheet === "nav"}
              aria-controls="mobile-nav-sheet"
              aria-label={mobileSheet === "nav" ? t.closeNavigationMenu : t.toggleNavigation}
            >
              {mobileSheet === "nav" ? (
                <X className="h-7 w-7" strokeWidth={2} />
              ) : (
                <Menu className="h-7 w-7" strokeWidth={2} />
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>

    {mobileSheet === "nav" && (
      <div
        id="mobile-nav-sheet"
        className="fixed inset-0 z-[9999] flex flex-col bg-background xl:hidden"
        role="dialog"
        aria-modal="true"
        aria-label={t.toggleNavigation}
      >
        <div className="shrink-0 border-b border-gray-200 dark:border-gray-800">
          <div className="mx-auto grid h-16 max-w-4xl grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 px-4 sm:px-6">
            <div className="flex min-w-10 items-center justify-start">
              {!authLoading && user?.email ? (
                <button
                  type="button"
                  onClick={toggleMobileAccount}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white shadow-sm transition-transform hover:scale-105 focus:outline-none focus:ring-0"
                  aria-expanded={false}
                  aria-controls="mobile-account-sheet"
                  aria-label={`${t.account} · ${user.email}`}
                  title={user.email}
                >
                  {initials}
                </button>
              ) : null}
            </div>
            <NavLink
              href={lp("/")}
              closeMenu={closeMenu}
              className="mx-auto flex min-w-0 max-w-full shrink items-center justify-center gap-2 overflow-hidden whitespace-nowrap"
            >
              {logoInner}
            </NavLink>
            <div className="flex w-10 shrink-0 items-center justify-end">
              <button
                type="button"
                onClick={closeMenu}
                className="nav-icon-button inline-flex h-10 w-10 items-center justify-center text-primary transition-colors hover:text-primary/80 focus:outline-none focus:ring-0"
                aria-expanded={mobileSheet === "nav"}
                aria-controls="mobile-nav-sheet"
                aria-label={t.closeNavigationMenu}
              >
                <X className="h-7 w-7" strokeWidth={2} />
              </button>
            </div>
          </div>
        </div>

        <nav className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain" aria-label="Mobile">
          <div className="py-2">
            <NavLink href={lp("/")} closeMenu={closeMenu} className={mobileItemClass}>
              <Lock className="h-4 w-4 shrink-0 opacity-80" />
              <span>{t.writeNote}</span>
            </NavLink>
            <NavLink href={lp("/password-generator")} closeMenu={closeMenu} className={mobileItemClass}>
              <Key className="h-4 w-4 shrink-0 opacity-80" />
              <span>{t.sharePassword}</span>
            </NavLink>

            <NavLink href={lp("/how-it-works")} closeMenu={closeMenu} className={mobileItemClass}>
              <Shield className="h-4 w-4 shrink-0 opacity-80" />
              <span>{t.howItWorks}</span>
            </NavLink>
            <NavLink href={lp("/security-resources")} closeMenu={closeMenu} className={mobileItemClass}>
              <Sparkles className="h-4 w-4 shrink-0 opacity-80" />
              <span>{t.security}</span>
            </NavLink>
            <NavLink href={lp("/blog")} closeMenu={closeMenu} className={mobileItemClass}>
              <FileText className="h-4 w-4 shrink-0 opacity-80" />
              <span>{t.blog}</span>
            </NavLink>

            <NavLink href={lp("/about")} closeMenu={closeMenu} className={mobileItemClass}>
              <Info className="h-4 w-4 shrink-0 opacity-80" />
              <span>{t.about}</span>
            </NavLink>

            <div className="my-2 mx-3 h-px bg-gray-100 dark:bg-gray-800" role="separator" />

            {authLoading ? null : user?.email || isAuthRoute ? null : (
              <>
                <NavLink href="/auth" closeMenu={closeMenu} className={mobileItemClass}>
                  <Mail className="h-4 w-4 shrink-0 opacity-80" aria-hidden />
                  <span>{t.signIn}</span>
                </NavLink>
                <div className="my-2 mx-3 h-px bg-gray-100 dark:bg-gray-800" role="separator" />
              </>
            )}

            <a
              href="https://www.buymeacoffee.com/marjanskrobot"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-5 py-4 text-base font-medium text-primary transition-colors hover:text-black dark:hover:text-black hover:bg-gray-50 dark:hover:bg-gray-800/60"
              onClick={closeMenu}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.216 6.415l-.132-.666c-.119-.598-.388-1.163-1.001-1.379-.197-.069-.42-.098-.57-.241-.152-.143-.196-.366-.231-.572-.065-.378-.125-.756-.192-1.133-.057-.325-.102-.69-.25-.987-.195-.4-.597-.634-.996-.788a5.723 5.723 0 00-.626-.194c-1-.263-2.05-.36-3.077-.416a25.834 25.834 0 00-3.7.062c-.915.083-1.88.184-2.75.5-.318.116-.646.256-.888.501-.297.302-.393.77-.177 1.146.154.267.415.456.692.58.36.162.737.284 1.123.366 1.075.238 2.189.331 3.287.37 1.218.05 2.437.01 3.65-.118.299-.033.598-.073.896-.119.352-.054.578-.513.474-.834-.124-.383-.457-.531-.834-.473-.466.074-.96.108-1.382.146-1.177.08-2.358.082-3.536.006a22.228 22.228 0 01-1.157-.107c-.086-.01-.18-.025-.258-.036-.243-.036-.484-.08-.724-.13-.111-.027-.111-.185 0-.212h.005c.277-.06.557-.108.838-.147h.002c.131-.009.263-.032.394-.048a25.076 25.076 0 013.426-.12c.674.019 1.347.067 2.017.144l.228.031c.267.04.533.088.798.145.392.085.895.113 1.07.542.055.137.08.288.111.431l.319 1.484a.237.237 0 01-.199.284h-.003c-.037.006-.075.01-.112.015a36.704 36.704 0 01-4.743.295 37.059 37.059 0 01-4.699-.304c-.14-.017-.293-.042-.417-.06-.326-.048-.649-.108-.973-.161-.393-.065-.768-.032-1.123.161-.29.16-.527.404-.675.701-.154.316-.199.66-.267 1-.069.34-.176.707-.135 1.056.087.753.613 1.365 1.37 1.502a39.69 39.69 0 0011.343.376.483.483 0 01.535.53l-.071.697-1.018 9.907c-.041.41-.047.832-.125 1.237-.122.637-.553 1.028-1.182 1.171-.577.131-1.165.2-1.756.205-.656.004-1.31-.025-1.966-.022-.699.004-1.556-.06-2.095-.58-.475-.458-.54-1.174-.605-1.793l-.731-7.013-.322-3.094c-.037-.351-.286-.695-.678-.678-.336.015-.718.3-.678.679l.228 2.185.949 9.112c.147 1.344 1.174 2.068 2.446 2.272.742.12 1.503.144 2.257.156.966.016 1.942.053 2.892-.122 1.408-.258 2.465-1.198 2.616-2.657.34-3.332.683-6.663 1.024-9.995l.215-2.087a.484.484 0 01.39-.426c.402-.078.787-.212 1.074-.518.455-.488.546-1.124.385-1.766zm-1.478.772c-.145.137-.363.201-.578.233-2.416.359-4.866.54-7.308.46-1.748-.06-3.477-.254-5.207-.498-.17-.024-.353-.055-.47-.18-.22-.236-.111-.71-.054-.995.052-.26.152-.609.463-.646.484-.057 1.046.148 1.526.22.577.088 1.156.159 1.737.212 2.48.226 5.002.19 7.472-.14.45-.06.899-.13 1.345-.21.399-.072.84-.206 1.08.206.166.281.188.657.162.974a.544.544 0 01-.169.364zm-6.159 3.9c-.862.37-1.84.788-3.109.788a5.884 5.884 0 01-1.569-.217l.877 9.004c.065.78.717 1.38 1.5 1.38 0 0 1.243.065 1.658.065.447 0 1.786-.065 1.786-.065.783 0 1.434-.6 1.499-1.38l.94-9.95a3.996 3.996 0 00-1.322-.238c-.826 0-1.491.284-2.26.613z" />
              </svg>
              <span>Buy Me Coffee</span>
            </a>
          </div>
        </nav>
      </div>
    )}

    {mobileSheet === "account" && user?.email ? (
      <div
        id="mobile-account-sheet"
        className="fixed inset-0 z-[9999] flex flex-col bg-background xl:hidden"
        role="dialog"
        aria-modal="true"
        aria-label={t.account}
      >
        <div className="shrink-0 border-b border-gray-200 dark:border-gray-800">
          <div className="mx-auto grid h-16 max-w-4xl grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 px-4 sm:px-6">
            <div className="flex min-w-10 items-center justify-start">
              <button
                type="button"
                onClick={toggleMobileAccount}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white shadow-sm transition-transform hover:scale-105 focus:outline-none focus:ring-0"
                aria-label={t.closeNavigationMenu}
                title={user.email}
              >
                {initials}
              </button>
            </div>
            <NavLink
              href={lp("/")}
              closeMenu={closeMenu}
              className="mx-auto flex min-w-0 max-w-full shrink items-center justify-center gap-2 overflow-hidden whitespace-nowrap"
            >
              {logoInner}
            </NavLink>
            <div className="flex w-10 shrink-0 items-center justify-end">
              <button
                type="button"
                onClick={() => setMobileSheet("nav")}
                className="nav-icon-button inline-flex h-10 w-10 items-center justify-center text-primary transition-colors hover:text-primary/80 focus:outline-none focus:ring-0"
                aria-controls="mobile-nav-sheet"
                aria-label={t.toggleNavigation}
              >
                <Menu className="h-7 w-7" strokeWidth={2} />
              </button>
            </div>
          </div>
        </div>

        <nav className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain" aria-label={t.account}>
          <div className="py-2">
            <div className="border-b border-gray-100 px-5 pb-4 pt-1 dark:border-gray-800">
              <p className="text-xs text-gray-500 dark:text-gray-400">{t.signedInAs}</p>
              <p className="truncate text-sm font-medium text-gray-900 dark:text-white">{user.email}</p>
            </div>
            <NavLink href="/account" closeMenu={closeMenu} className={mobileItemClass}>
              <Shield className="h-4 w-4 shrink-0 opacity-80" />
              <span>{t.account}</span>
            </NavLink>
            <NavLink href="/account/security" closeMenu={closeMenu} className={mobileItemClass}>
              <ShieldCheck className="h-4 w-4 shrink-0 opacity-80" />
              <span>{t.security}</span>
            </NavLink>
            <button
              type="button"
              onClick={() => {
                closeMenu();
                void signOut();
              }}
              className={`${mobileItemClass} w-full text-left`}
            >
              <LogOut className="h-4 w-4 shrink-0 opacity-80" />
              <span>{t.signOut}</span>
            </button>
          </div>
        </nav>
      </div>
    ) : null}
    </>
  );
};
