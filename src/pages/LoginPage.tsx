import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import type { FormEvent } from 'react';
import { Lock, Server, Activity, Database, ChevronDown, MapPin } from 'lucide-react';

import { PageLayout } from '../components/PageLayout';
import { HospitalLogo } from '../components/HospitalLogo';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { authService } from '../services/auth.service.js';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showCredentials, setShowCredentials] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? '/admin';

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (authService.login(email, password)) {
      navigate(from, { replace: true });
    } else {
      setError('Email o contraseña incorrectos');
      setIsLoading(false);
    }
  };

  return (
    <PageLayout
      showFooter={false}
      mainClassName="!max-w-none !px-4 !py-10 flex items-center justify-center min-h-[calc(100vh-200px)]"
    >
      <div className="mx-auto grid w-full max-w-5xl overflow-hidden rounded-[1.75rem] border border-brand/12 bg-white shadow-brand-lg md:grid-cols-2">
        <div className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-brand-dark via-brand to-accent p-10 text-white md:flex">
          <div className="absolute -right-8 -top-8 h-48 w-48 rounded-full bg-white/5" />
          <div className="absolute -bottom-12 -left-8 h-56 w-56 rounded-full bg-boyaca/20" />
          <div className="relative">
            <HospitalLogo size="lg" variant="light" />
            <p className="mt-6 inline-flex items-center gap-1.5 text-xs font-semibold text-blue-100">
              <MapPin size={12} />
              Tunja, Boyacá
            </p>
            <h2 className="mt-6 font-display text-2xl font-bold leading-tight">
              Panel de gestión de sistemas hospitalarios
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-blue-100/90">
              Acceso exclusivo para el equipo de tecnología y coordinación de la información del
              Hospital Universitario San Rafael.
            </p>
          </div>
          <div className="relative mt-10 space-y-3">
            {[
              { icon: Server, label: 'Historia clínica y HIS' },
              { icon: Activity, label: 'Disponibilidad en tiempo real' },
              { icon: Database, label: 'Registro de incidentes TI' },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-sm"
              >
                <Icon size={18} />
                <span className="text-sm font-medium">{label}</span>
              </div>
            ))}
          </div>
        </div>

        <Card className="rounded-none border-0 p-8 sm:p-10 shadow-none">
          <div className="mb-8 text-center md:text-left">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand to-brand-dark text-white shadow-lg shadow-brand/25 md:mx-0">
              <Lock size={26} />
            </div>
            <h2 className="font-display text-2xl font-bold text-brand-dark">
              Acceso administrativo
            </h2>
            <p className="mt-2 text-sm text-muted">
              Hospital San Rafael de Tunja — personal autorizado
            </p>
          </div>

          {error && (
            <div className="mb-6 rounded-2xl border border-status-error/25 bg-red-50 px-4 py-3 text-sm font-medium text-red-800">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-bold text-brand-dark" htmlFor="email">
                Correo institucional
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="input-field"
                placeholder="admin@sanrafael.gov.co"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-brand-dark" htmlFor="password">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="input-field"
                required
              />
            </div>

            <Button type="submit" fullWidth disabled={isLoading}>
              {isLoading ? 'Verificando acceso...' : 'Ingresar al panel'}
            </Button>
          </form>

          <div className="mt-8">
            <button
              type="button"
              onClick={() => setShowCredentials(!showCredentials)}
              className="flex w-full items-center justify-between rounded-2xl border border-brand/12 bg-brand-soft/60 px-4 py-3 text-sm font-semibold text-brand-dark focus-ring"
            >
              Credenciales de demostración
              <ChevronDown
                size={18}
                className={`transition ${showCredentials ? 'rotate-180' : ''}`}
              />
            </button>
            {showCredentials && (
              <div className="mt-3 space-y-2 rounded-2xl border border-brand/10 bg-slate-50 p-4 font-mono text-xs text-slate-600">
                <p>usuario: admin@sanrafael.gov.co</p>
                <p>clave: SanRafael2026*</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </PageLayout>
  );
}
