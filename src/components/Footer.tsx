import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, FileJson } from 'lucide-react';

import { HospitalLogo } from './HospitalLogo';

export function Footer() {
  return (
    <footer
      className="mt-20 border-t-4 border-boyaca/30 bg-gradient-to-br from-brand-dark via-brand to-brand-dark text-white"
      id="contacto"
    >
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-col gap-8 border-b border-white/15 pb-12 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-md">
            <HospitalLogo size="lg" variant="light" />
            <p className="mt-5 text-sm leading-relaxed text-blue-100/90">
              Hospital Universitario San Rafael de Tunja — Empresa Social del Estado dedicada a la
              atención integral en salud. Esta presentación usa datos de ejemplo para ilustrar el
              funcionamiento del tablero.
            </p>
            <p className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-bold text-white">
              <MapPin size={12} />
              Sede principal · Tunja
            </p>
          </div>

          <div className="grid flex-1 gap-8 sm:grid-cols-3">
            <div>
              <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-blue-200">
                Dirección
              </h3>
              <p className="text-sm leading-relaxed text-blue-100">
                Calle 6 # 11-50
                <br />
                Tunja, Boyacá
                <br />
                Colombia
              </p>
            </div>
            <div>
              <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-blue-200">
                Contacto
              </h3>
              <p className="flex items-center gap-2 text-sm text-blue-100">
                <Phone size={14} />
                +57 (8) 745 6060
              </p>
              <p className="mt-2 flex items-center gap-2 text-sm text-blue-100">
                <Mail size={14} />
                contacto@sanrafael.gov.co
              </p>
            </div>
            <div>
              <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-blue-200">
                Atención
              </h3>
              <p className="flex items-start gap-2 text-sm text-blue-100">
                <Clock size={14} className="mt-0.5 shrink-0" />
                <span>
                  Urgencias y hospitalización: 24 horas
                  <br />
                  Consulta externa: L–V 7:00–17:00
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 text-center text-xs text-blue-200/90 sm:flex-row sm:text-left">
          <p>
            © {new Date().getFullYear()} Hospital Universitario San Rafael de Tunja. Portal de
            monitoreo de sistemas tecnológicos.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/status"
              className="inline-flex items-center gap-1 font-medium text-blue-100 hover:text-white"
            >
              <FileJson size={14} />
              Estado JSON público
            </Link>
            <span className="font-medium">Vigilado Supersalud · Colombia</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
