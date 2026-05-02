import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'wouter';
import { Menu, X, Lock, Sparkles, Shield, FileText, Info, Mail, Key } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Logo } from '@/components/Logo';

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
    if (href === '/' && (window.location.pathname === '/' || window.location.pathname.startsWith('/note/'))) {
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

export const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, loading: authLoading, signOut } = useAuth();
  const menuRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const [location] = useLocation();

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // Handle clicks outside of menus
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Close main menu when clicking outside (mobile view only)
      if (menuRef.current && !menuRef.current.contains(event.target as Node) && window.innerWidth < 768) {
        setIsMenuOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setIsMenuOpen(false);
    setIsProfileOpen(false);
  }, [location]);

  const isAuthRoute = location.startsWith('/auth');

  const initials = React.useMemo(() => {
    if (!user?.email) return 'U';
    const local = user.email.split('@')[0] || '';
    const parts = local.split(/[._-]+/).filter(Boolean);
    const chars = parts.length ? parts.map((part) => part[0]) : [local[0]];
    return chars.filter(Boolean).slice(0, 2).join('').toUpperCase();
  }, [user?.email]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-blue-100/80 dark:border-gray-800/80 shadow-[0_1px_6px_rgba(15,23,42,0.05)]">
      {/* Same max width + horizontal padding as main content (e.g. Home note editor column) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4 md:gap-6">
          {/* Left: Logo */}
          <NavLink
            href="/"
            closeMenu={closeMenu}
            className="flex shrink-0 items-center gap-2 cursor-pointer"
          >
            <Logo size={30} className="shrink-0" />
            <span className="font-bold text-2xl text-primary">
              privateNote
              <span className="text-xs text-primary align-super ml-0.5">.ai</span>
            </span>
          </NavLink>

          {/* Desktop: primary links (left, widened) + About + account (right) */}
          <div className="hidden md:flex flex-1 min-w-0 items-center justify-between gap-6 lg:gap-8">
            <nav
              className="flex flex-wrap items-center justify-start gap-x-10 gap-y-1 text-sm font-medium lg:gap-x-12 lg:text-[15px]"
              aria-label="Primary"
            >
              <NavLink
                href="/"
                closeMenu={closeMenu}
                className="text-primary hover:text-primary/80 transition-colors whitespace-nowrap"
              >
                Write a Note
              </NavLink>
              <NavLink
                href="/password-generator"
                closeMenu={closeMenu}
                className="text-primary hover:text-primary/80 transition-colors whitespace-nowrap"
              >
                Share a Password
              </NavLink>
              <NavLink
                href="/how-it-works"
                closeMenu={closeMenu}
                className="text-primary hover:text-primary/80 transition-colors whitespace-nowrap"
              >
                How It Works
              </NavLink>
              <NavLink
                href="/security-resources"
                closeMenu={closeMenu}
                className="text-primary hover:text-primary/80 transition-colors whitespace-nowrap"
              >
                Security
              </NavLink>
              <NavLink
                href="/blog"
                closeMenu={closeMenu}
                className="text-primary hover:text-primary/80 transition-colors whitespace-nowrap"
              >
                Blog
              </NavLink>
            </nav>

            <div className="flex shrink-0 items-center gap-x-10 lg:gap-x-12">
              <NavLink
                href="/about"
                closeMenu={closeMenu}
                className="text-sm font-medium lg:text-[15px] text-primary hover:text-primary/80 transition-colors whitespace-nowrap"
              >
                About
              </NavLink>
              <div className="flex items-center gap-3 mr-1" ref={profileRef}>
                {authLoading ? null : user?.email ? (
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsProfileOpen((open) => !open)}
                      className="inline-flex items-center justify-center h-9 w-9 rounded-full bg-primary text-white text-sm font-semibold"
                      aria-haspopup="menu"
                      aria-expanded={isProfileOpen}
                    >
                      {initials}
                    </button>
                    {isProfileOpen && (
                      <div className="absolute right-0 mt-2 w-52 rounded-md border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-lg overflow-hidden">
                        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-800">
                          <p className="text-xs text-gray-500 dark:text-gray-400">Signed in as</p>
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user.email}</p>
                        </div>
                        <div className="py-1">
                          <NavLink
                            href="/account/security"
                            closeMenu={closeMenu}
                            className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800/60"
                          >
                            Security settings
                          </NavLink>
                          <button
                            type="button"
                            onClick={() => {
                              signOut();
                              setIsProfileOpen(false);
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800/60"
                          >
                            Sign out
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : isAuthRoute ? null : (
                  <>
                    <NavLink
                      href="/auth/sign-in"
                      closeMenu={closeMenu}
                      className="inline-flex items-center rounded-md px-4 py-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
                    >
                      Sign in
                    </NavLink>
                    <NavLink
                      href="/auth/sign-up"
                      closeMenu={closeMenu}
                      className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 transition-colors"
                    >
                      Sign up
                    </NavLink>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Right: Mobile Menu */}
          <div className="flex-shrink-0 flex items-center md:hidden" ref={menuRef}>
            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="appearance-none border-0 bg-transparent shadow-none p-0 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
              aria-label="Toggle navigation"
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>

            {/* Menu Dropdown - Mobile */}
            {isMenuOpen && (
              <div
                id="mobile-menu"
                className="absolute top-16 right-4 w-64 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg rounded-lg shadow-lg border border-gray-200 dark:border-gray-800 overflow-hidden z-50 transition-all duration-200 ease-in-out"
              >
                <div className="py-2">
                  <NavLink href="/" closeMenu={closeMenu} className="flex items-center gap-3 px-4 py-2.5 text-sm text-primary hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors">
                    <Lock className="h-4 w-4" />
                    <span>Write a Note</span>
                  </NavLink>

                  <NavLink href="/how-it-works" closeMenu={closeMenu} className="flex items-center gap-3 px-4 py-2.5 text-sm text-primary hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors">
                    <Shield className="h-4 w-4" />
                    <span>How It Works</span>
                  </NavLink>

                  <NavLink href="/security-resources" closeMenu={closeMenu} className="flex items-center gap-3 px-4 py-2.5 text-sm text-primary hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors">
                    <Sparkles className="h-4 w-4" />
                    <span>Security</span>
                  </NavLink>

                  <NavLink href="/password-generator" closeMenu={closeMenu} className="flex items-center gap-3 px-4 py-2.5 text-sm text-primary hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors">
                    <Key className="h-4 w-4" />
                    <span>Share a Password</span>
                  </NavLink>

                  <NavLink href="/blog" closeMenu={closeMenu} className="flex items-center gap-3 px-4 py-2.5 text-sm text-primary hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors">
                    <FileText className="h-4 w-4" />
                    <span>Blog</span>
                  </NavLink>

                  <NavLink href="/about" closeMenu={closeMenu} className="flex items-center gap-3 px-4 py-2.5 text-sm text-primary hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors">
                    <Info className="h-4 w-4" />
                    <span>About</span>
                  </NavLink>

                  {authLoading ? null : user?.email ? (
                    <>
                      <NavLink href="/account/security" closeMenu={closeMenu} className="flex items-center gap-3 px-4 py-2.5 text-sm text-primary hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors">
                        <Shield className="h-4 w-4" />
                        <span>Account</span>
                      </NavLink>
                      <button
                        type="button"
                        onClick={signOut}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-primary hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors"
                      >
                        <Mail className="h-4 w-4" />
                        <span>Sign out</span>
                      </button>
                    </>
                  ) : isAuthRoute ? null : (
                    <>
                      <NavLink href="/auth/sign-in" closeMenu={closeMenu} className="flex items-center gap-3 px-4 py-2.5 text-sm text-primary hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors">
                        <Mail className="h-4 w-4" />
                        <span>Sign in</span>
                      </NavLink>
                      <NavLink href="/auth/sign-up" closeMenu={closeMenu} className="flex items-center gap-3 px-4 py-2.5 text-sm text-primary hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors">
                        <Key className="h-4 w-4" />
                        <span>Sign up</span>
                      </NavLink>
                    </>
                  )}

                  <a
                    href="https://www.buymeacoffee.com/marjanskrobot"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.216 6.415l-.132-.666c-.119-.598-.388-1.163-1.001-1.379-.197-.069-.42-.098-.57-.241-.152-.143-.196-.366-.231-.572-.065-.378-.125-.756-.192-1.133-.057-.325-.102-.69-.25-.987-.195-.4-.597-.634-.996-.788a5.723 5.723 0 00-.626-.194c-1-.263-2.05-.36-3.077-.416a25.834 25.834 0 00-3.7.062c-.915.083-1.88.184-2.75.5-.318.116-.646.256-.888.501-.297.302-.393.77-.177 1.146.154.267.415.456.692.58.36.162.737.284 1.123.366 1.075.238 2.189.331 3.287.37 1.218.05 2.437.01 3.65-.118.299-.033.598-.073.896-.119.352-.054.578-.513.474-.834-.124-.383-.457-.531-.834-.473-.466.074-.96.108-1.382.146-1.177.08-2.358.082-3.536.006a22.228 22.228 0 01-1.157-.107c-.086-.01-.18-.025-.258-.036-.243-.036-.484-.08-.724-.13-.111-.027-.111-.185 0-.212h.005c.277-.06.557-.108.838-.147h.002c.131-.009.263-.032.394-.048a25.076 25.076 0 013.426-.12c.674.019 1.347.067 2.017.144l.228.031c.267.04.533.088.798.145.392.085.895.113 1.07.542.055.137.08.288.111.431l.319 1.484a.237.237 0 01-.199.284h-.003c-.037.006-.075.01-.112.015a36.704 36.704 0 01-4.743.295 37.059 37.059 0 01-4.699-.304c-.14-.017-.293-.042-.417-.06-.326-.048-.649-.108-.973-.161-.393-.065-.768-.032-1.123.161-.29.16-.527.404-.675.701-.154.316-.199.66-.267 1-.069.34-.176.707-.135 1.056.087.753.613 1.365 1.37 1.502a39.69 39.69 0 0011.343.376.483.483 0 01.535.53l-.071.697-1.018 9.907c-.041.41-.047.832-.125 1.237-.122.637-.553 1.028-1.182 1.171-.577.131-1.165.2-1.756.205-.656.004-1.31-.025-1.966-.022-.699.004-1.556-.06-2.095-.58-.475-.458-.54-1.174-.605-1.793l-.731-7.013-.322-3.094c-.037-.351-.286-.695-.678-.678-.336.015-.718.3-.678.679l.228 2.185.949 9.112c.147 1.344 1.174 2.068 2.446 2.272.742.12 1.503.144 2.257.156.966.016 1.942.053 2.892-.122 1.408-.258 2.465-1.198 2.616-2.657.34-3.332.683-6.663 1.024-9.995l.215-2.087a.484.484 0 01.39-.426c.402-.078.787-.212 1.074-.518.455-.488.546-1.124.385-1.766zm-1.478.772c-.145.137-.363.201-.578.233-2.416.359-4.866.54-7.308.46-1.748-.06-3.477-.254-5.207-.498-.17-.024-.353-.055-.47-.18-.22-.236-.111-.71-.054-.995.052-.26.152-.609.463-.646.484-.057 1.046.148 1.526.22.577.088 1.156.159 1.737.212 2.48.226 5.002.19 7.472-.14.45-.06.899-.13 1.345-.21.399-.072.84-.206 1.08.206.166.281.188.657.162.974a.544.544 0 01-.169.364zm-6.159 3.9c-.862.37-1.84.788-3.109.788a5.884 5.884 0 01-1.569-.217l.877 9.004c.065.78.717 1.38 1.5 1.38 0 0 1.243.065 1.658.065.447 0 1.786-.065 1.786-.065.783 0 1.434-.6 1.499-1.38l.94-9.95a3.996 3.996 0 00-1.322-.238c-.826 0-1.491.284-2.26.613z" />
                    </svg>
                    <span>Buy Me Coffee</span>
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
