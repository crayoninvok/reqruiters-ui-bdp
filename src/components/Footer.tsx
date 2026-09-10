import React from "react";
import Link from "next/link";
import {
  Code2,
  Calendar,
  ExternalLink,
  ShieldCheck,
  Mail,
  MapPin,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";

interface FooterLinkProps {
  href: string;
  label: string;
  external?: boolean;
}

function FooterLink({ href, label, external }: FooterLinkProps) {
  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-slate-400 hover:text-white transition-colors duration-200 flex items-center gap-1 group"
      >
        <span>{label}</span>
        <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
      </a>
    );
  }

  return (
    <Link
      href={href}
      className="text-sm text-slate-400 hover:text-white transition-colors duration-200"
    >
      {label}
    </Link>
  );
}

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-slate-400 border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Company Brand Column (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/bdplogo01.png"
                alt="Logo PT Batara Dharma Persada"
                className="h-12 w-auto object-contain brightness-110"
              />
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight">
                  PT Batara Dharma Persada
                </h3>
                <p className="text-xs text-teal-400 font-medium tracking-wide uppercase">
                  Recruitment & Talent Management Portal
                </p>
              </div>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed max-w-md">
              Portal resmi manajemen rekrutmen dan pengembangan talenta terpadu.
              Menghubungkan tenaga kerja profesional dan berkompeten dengan
              peluang karir strategis di industri pertambangan nasional.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-400">
              <span className="px-2.5 py-1 rounded-lg bg-slate-800/90 border border-slate-700/60 font-medium">
                Mining Contractor
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-800/90 border border-slate-700/60 font-medium">
                Heavy Equipment
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-800/90 border border-slate-700/60 font-medium">
                Hauling & Logistics
              </span>
            </div>
          </div>

          {/* Quick Links Column (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Tautan Cepat
            </h4>
            <ul className="space-y-2.5">
              <li>
                <FooterLink href="/" label="Beranda" />
              </li>
              <li>
                <FooterLink href="/informasi-posisi" label="Informasi Posisi" />
              </li>
              <li>
                <FooterLink href="/tracking" label="Lacak Status Lamaran" />
              </li>
              <li>
                <FooterLink
                  href="https://www.bataramining.com/"
                  label="Website Perusahaan"
                  external
                />
              </li>
            </ul>
          </div>

          {/* Legal & Support Column (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Bantuan & Kebijakan
            </h4>
            <ul className="space-y-2.5">
              <li>
                <FooterLink href="/privacy" label="Kebijakan Privasi" />
              </li>
              <li>
                <FooterLink href="/terms" label="Syarat & Ketentuan" />
              </li>
              <li>
                <FooterLink href="/support" label="Pusat Bantuan" />
              </li>
              <li>
                <FooterLink
                  href="https://www.bataramining.com/kontak"
                  label="Hubungi Kami"
                  external
                />
              </li>
            </ul>
          </div>

          {/* Developer & Credits Column (3 cols) */}
          <div className="lg:col-span-3">
            <div className="bg-gradient-to-br from-slate-800/90 via-slate-800/60 to-slate-900/90 p-5 rounded-2xl border border-slate-700/70 shadow-lg backdrop-blur-sm space-y-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-blue-500/15 border border-blue-500/30 text-blue-400">
                  <Code2 className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                  Pengembang Aplikasi
                </span>
              </div>

              <div>
                <h5 className="text-sm font-bold text-white tracking-wide">
                  Dzaky Athariq Ferreira
                </h5>
                <p className="text-xs text-blue-400 font-medium mt-0.5">
                  Full Stack Developer
                </p>
                <p className="text-[11px] text-slate-400">
                  PMO & IT Programmer
                </p>
              </div>

              <div className="pt-3 border-t border-slate-700/60 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5 text-[11px] text-slate-400">
                  <Calendar className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                  Dibuat tahun 2025
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-mono text-[10px] font-semibold border border-emerald-500/30">
                  Est. 2025
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Sub-Footer Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p className="text-center sm:text-left">
            © 2025{" "}
            <span className="text-slate-300 font-medium">
              PT Batara Dharma Persada
            </span>
            . Seluruh hak cipta dilindungi undang-undang.
          </p>

          <p className="text-center sm:text-right flex items-center gap-1.5 text-slate-400">
            <span>Aplikasi web ini dibuat tahun 2025 oleh</span>
            <span className="text-slate-200 font-semibold">
              Dzaky Athariq Ferreira
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}
