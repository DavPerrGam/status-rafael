import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { Search, Phone, Mail, Shield, FileJson } from 'lucide-react';

import { authService } from '../services/auth.service.js';
import { statusService } from '../services/status.service.js';
import { EventCondition } from '../types/index.js';
import { Button } from './ui/Button';
import { HospitalLogo } from './HospitalLogo';
import { InstitutionStrip } from './InstitutionStrip';
import { GlobalStatusChip } from './GlobalStatusChip';

interface HeaderProps {
  isAdmin?: boolean;
}

export function Header({ isAdmin = false }: HeaderProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(() => searchParams.get('q') ?? '');
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = authService.isAuthenticated();
  const globalStatus = statusService.getGlobalStatus();
  const isHealthy = globalStatus === EventCondition.CONDITION_ACTIVE;

  useEffect(() => {
    setSearch(searchParams.get('q') ?? '');
  }, [searchParams]);

  useEffect(() => {
    if (location.pathname !== '/') return;
    const timer = setTimeout(() => {
      const trimmed = search.trim();
      const current = searchParams.get('q') ?? '';
      if (trimmed === current) return;
      if (trimmed) setSearchParams({ q: trimmed });
      else setSearchParams({});
    }, 450);
    return () => clearTimeout(timer);
  }, [search, location.pathname, searchParams, setSearchParams]);

  const applySearch = () => {
    const trimmed = search.trim();
    if (location.pathname === '/') {
      if (trimmed) setSearchParams({ q: trimmed });
      else setSearchParams({});
    } else if (trimmed) {
      navigate(`/?q=${encodeURIComponent(trimmed)}`);
    } else {
      navigate('/');
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/');
  };

  const navLinkClass = (path: string) => {
    const active = location.pathname === path;
    return `rounded-full px-4 py-2 font-medium transition focus-ring ${
      active
        ? 'bg-brand text-white shadow-md shadow-brand/20'
        : 'text-brand-dark/85 hover:bg-brand-soft hover:text-brand'
    }`;
  };

  const hashLinkClass =
    'rounded-full px-4 py-2 font-medium text-brand-dark/80 transition hover:bg-brand-soft hover:text-brand focus-ring';

  return (
    <header className="sticky top-0 z-30 shadow-lg shadow-brand/8">
      <div className="bg-gradient-to-r from-brand-dark via-brand to-brand-dark text-white">
        <div className="mx-auto flex h-10 max-w-7xl items-center justify-between px-4 text-xs font-medium sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <Phone size={13} />
              <span>+57 (8) 745 6060</span>
            </div>
            <div className="hidden h-4 w-px bg-white/25 sm:block" />
            <div className="hidden items-center gap-1.5 sm:flex">
              <Mail size={13} />
              <span>contacto@sanrafael.gov.co</span>
            </div>
          </div>
          <p className="hidden text-[11px] font-semibold uppercase tracking-[0.2em] text-white/80 md:block">
            Portal de estado operativo · San Rafael
          </p>
        </div>
      </div>

      <InstitutionStrip />

      <div className="header-main">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <Link to="/" className="group flex items-center gap-3 focus-ring rounded-2xl">
              <div className="relative">
                <HospitalLogo size="md" showText />
                {isHealthy && (
                  <span
                    className="absolute -right-1 -top-1 flex h-4 w-4"
                    title="Sistemas operativos"
                  >
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-status-active opacity-50" />
                    <span className="relative inline-flex h-4 w-4 rounded-full border-2 border-white bg-status-active" />
                  </span>
                )}
              </div>
            </Link>

            <GlobalStatusChip />

            <div className="relative flex max-w-xl flex-1 gap-2 lg:mx-2">
              <div className="relative flex-1">
                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-brand/40"
                />
                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && applySearch()}
                  placeholder="Buscar servicio hospitalario..."
                  className="input-field w-full py-2.5 pl-11 pr-4 text-sm"
                  aria-label="Buscar servicios"
                />
              </div>
              <button
                type="button"
                onClick={applySearch}
                className="button-primary shrink-0 !px-4 !py-2.5 !text-sm"
              >
                Buscar
              </button>
            </div>

            <div className="flex items-center justify-end gap-3">
              {isAdmin || isAuthenticated ? (
                <>
                  <Link
                    to="/admin"
                    className="button-secondary hidden !py-2.5 !text-sm sm:inline-block"
                  >
                    Panel
                  </Link>
                  <Button variant="danger" onClick={handleLogout} className="!py-2.5 !text-sm">
                    Salir
                  </Button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="button-primary inline-block !py-2.5 !text-sm focus-ring"
                >
                  Acceso administrativo
                </Link>
              )}
            </div>
          </div>
        </div>

        <nav className="border-t border-brand/8 bg-brand-soft/40">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-2 px-4 py-2.5 text-sm sm:px-6 lg:px-8">
            <Link to="/" className={navLinkClass('/')}>
              Inicio
            </Link>
            <Link to="/#servicios" className={hashLinkClass}>
              Servicios TI
            </Link>
            <Link to="/#estado" className={hashLinkClass}>
              Estado general
            </Link>
            <Link to="/status" className={navLinkClass('/status')}>
              <span className="inline-flex items-center gap-1">
                <FileJson size={14} />
                JSON
              </span>
            </Link>
            <Link to="/#informacion" className={hashLinkClass}>
              Información
            </Link>
            <Link to="/#contacto" className={hashLinkClass}>
              Contacto
            </Link>
            {isAuthenticated ? (
              <Link
                to="/admin"
                className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-brand px-4 py-2 font-semibold text-white shadow-md focus-ring"
              >
                <Shield size={14} />
                Administración
              </Link>
            ) : (
              <Link
                to="/login"
                className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-brand/15 bg-white px-4 py-2 font-semibold text-brand-dark shadow-sm focus-ring"
              >
                <Shield size={14} />
                Ingresar
              </Link>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
