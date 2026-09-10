"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Briefcase,
  CheckCircle2,
  Search,
  ShieldCheck,
  ArrowRight,
  ChevronRight,
} from "lucide-react";
import {
  FormSettingsService,
  FormSettings,
} from "@/services/form-settings.service";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
  badge?: string;
}

interface StatCardProps {
  number: string;
  label: string;
  description: string;
}


const RECRUITMENT_STEPS = [
  {
    step: "01",
    title: "Eksplorasi Formasi",
    desc: "Pahami garis besar kualifikasi, sertifikasi wajib (SIM B2 Umum, POP, POM, BMC), serta tugas pokok posisi.",
  },
  {
    step: "02",
    title: "Pendaftaran Online",
    desc: "Isi data profil dan unggah berkas resmi (KTP, CV, sertifikasi) saat formasi pendaftaran sedang dibuka.",
  },
  {
    step: "03",
    title: "Pantau Real-Time",
    desc: "Cek progres seleksi mulai dari verifikasi berkas, wawancara, psikotes, hingga MCU dengan ID Pelamar.",
  },
];

export default function Home() {
  const [formSettings, setFormSettings] = useState<FormSettings | null>(null);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await FormSettingsService.getFormSettings().catch(
          () => null
        );
        if (response?.formSettings) {
          setFormSettings(response.formSettings);
        }
      } catch (err) {
        console.error("Failed to load settings:", err);
      }
    };
    loadSettings();
  }, []);

  const isFormOpen = Boolean(formSettings?.isFormOpen);

  return (
    <div className="min-h-screen bg-white text-slate-800 selection:bg-teal-500 selection:text-white">
      {/* 1. Hero Section: Full Mining Landscape Visible + Bright Frosted Glass Card */}
      <section className="relative min-h-[90vh] lg:min-h-[95vh] px-4 sm:px-6 overflow-hidden flex items-center justify-center border-b border-slate-200">
        {/* Real Coal Mining Background Image (Fully Visible & Crisp) */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src="/staffteam.JPG"
            alt="Tim PT Batara Dharma Persada"
            className="w-full h-full object-cover object-center"
          />
          {/* Gentle gradient wash: preserves full clarity of the mine while smoothly fading into the white page below */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/30 via-slate-900/10 to-white"></div>
        </div>

        {/* Floating Translucent Frosted Glass Container: Softly Transparent to Reveal Staff Background */}
        <div className="max-w-4xl mx-auto w-full relative z-10 py-12 sm:py-16">
          <div className="bg-white/35 sm:bg-white/40 backdrop-blur-md border border-white/60 shadow-2xl rounded-3xl p-6 sm:p-10 md:p-12 text-center space-y-6 sm:space-y-7">
            {/* Live Registration Status Pill */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/80 backdrop-blur-sm border border-slate-200/80 shadow-sm">
              <span className="relative flex h-2.5 w-2.5">
                {isFormOpen ? (
                  <>
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600"></span>
                  </>
                ) : (
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
                )}
              </span>
              <span className="text-xs sm:text-sm font-semibold tracking-wide">
                {isFormOpen ? (
                  <span className="text-emerald-700 font-bold">
                    Pendaftaran Dibuka &bull; Menerima Berkas Pelamar
                  </span>
                ) : (
                  <span className="text-amber-800 font-bold">
                    Status: Pendaftaran Sedang Ditutup (Proses Seleksi Berkas)
                  </span>
                )}
              </span>
            </div>

            {/* Title & Branding */}
            <div className="space-y-3">
              <div className="text-teal-700 font-extrabold tracking-wider text-xs sm:text-sm uppercase">
                PT Batara Dharma Persada
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight sm:whitespace-nowrap">
                Portal Rekrutmen &{" "}
                <span className="bg-gradient-to-r from-teal-600 via-teal-700 to-cyan-700 bg-clip-text text-transparent">
                  Karir Terpadu
                </span>
              </h1>
              <p className="text-sm sm:text-base md:text-lg text-slate-800 font-medium max-w-2xl mx-auto leading-relaxed pt-1">
                Wadah resmi informasi karir, eksplorasi formasi operasional tambang
                batubara, dan pemantauan tahapan seleksi secara transparan dan terpercaya.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center pt-2">
              {isFormOpen ? (
                <Link
                  href="/recruitment-form"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold py-3.5 px-8 rounded-xl text-base transition-all duration-200 shadow-md shadow-teal-600/25 hover:-translate-y-0.5"
                >
                  <Briefcase className="w-5 h-5" />
                  <span>Isi Formulir Pendaftaran</span>
                </Link>
              ) : (
                <Link
                  href="/informasi-posisi"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold py-3.5 px-8 rounded-xl text-base transition-all duration-200 shadow-md shadow-teal-600/25 hover:-translate-y-0.5"
                >
                  <Search className="w-5 h-5" />
                  <span>Lihat Informasi Posisi</span>
                </Link>
              )}

              <Link
                href="/tracking"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-white hover:bg-slate-50 text-slate-800 font-semibold py-3.5 px-7 rounded-xl text-base border border-slate-300 hover:border-slate-400 transition-all duration-200 shadow-sm"
              >
                <CheckCircle2 className="w-5 h-5 text-teal-600" />
                <span>Lacak Status Lamaran</span>
              </Link>

              {isFormOpen && (
                <Link
                  href="/informasi-posisi"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-slate-600 hover:text-teal-700 text-sm font-semibold py-2 px-4 transition-colors"
                >
                  <span>Katalog Posisi</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              )}
            </div>


          </div>
        </div>
      </section>

      {/* 2. Core Pillars (Features Section) - Clean Solid White */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16 space-y-3">
            <span className="text-xs font-bold text-teal-700 uppercase tracking-widest bg-teal-50 px-3.5 py-1.5 rounded-full border border-teal-200">
              Layanan Resmi
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
              Layanan Portal Rekrutmen
            </h2>
            <p className="text-base sm:text-lg text-slate-600 max-w-xl mx-auto">
              Akses informasi resmi dan proses seleksi terintegrasi untuk calon karyawan
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <FeatureCard
              icon={<Briefcase className="w-6 h-6 text-teal-700" />}
              title="Formasi & Kualifikasi Posisi"
              description="Pelajari garis besar formasi karir utama: Driver Double Trailer, Mekanik HE & BMC, Admin Operasional, hingga Pengawas (Supervisor & Superintendent)."
              href="/informasi-posisi"
              badge="Resmi BDP"
            />
            <FeatureCard
              icon={<CheckCircle2 className="w-6 h-6 text-emerald-700" />}
              title="Pelacakan Status Terpadu"
              description="Pantau progres seleksi Anda mulai dari screening berkas, wawancara HR, psikotes daring, tes teknis, hingga Medical Check-Up secara real-time."
              href="/tracking"
              badge="Real-Time"
            />
            <FeatureCard
              icon={<ShieldCheck className="w-6 h-6 text-teal-700" />}
              title="100% Bebas Pungutan Biaya"
              description="Seluruh tahapan seleksi penerimaan karyawan di PT Batara Dharma Persada bersifat gratis. Waspada terhadap segala bentuk penipuan yang mengatasnamakan perusahaan."
              href="/informasi-posisi"
              badge="Gratis & Aman"
            />
          </div>
        </div>
      </section>

      {/* 3. Simple 3-Step Flow with Hauling Corridor / Career Pathway Background */}
      <section className="relative py-16 sm:py-24 px-4 sm:px-6 overflow-hidden border-b border-slate-200">
        {/* Background Career Pathway Hauling Corridor Visual (Clearly Visible) */}
        <div className="absolute inset-0 z-0">
          <img
            src="/career-pathway.jpg"
            alt="Jalur Hauling dan Operasional Pertambangan PT Batara Dharma Persada"
            className="w-full h-full object-cover object-center opacity-75"
          />
          {/* Light transparent veil: keeps section bright while showing the hauling corridor scenery clearly */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-white/40 to-white/65"></div>
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-12 sm:mb-16 space-y-2">
            <span className="text-xs font-bold text-teal-700 uppercase tracking-widest bg-white/90 backdrop-blur-sm px-3.5 py-1.5 rounded-full border border-teal-200/80 shadow-xs">
              Alur Penerimaan
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
              3 Langkah Mudah Menuju Karir Anda
            </h2>
            <p className="text-base sm:text-lg text-slate-600 max-w-xl mx-auto">
              Tahapan terstruktur mulai dari seleksi formasi hingga pemantauan status kelulusan secara mandiri
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 relative">
            {RECRUITMENT_STEPS.map((step, idx) => (
              <div
                key={idx}
                className="relative p-6 sm:p-8 rounded-2xl bg-white/92 sm:bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-1"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center font-black text-lg mb-5 shadow-xs">
                    {step.step}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2.5">
                    {step.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Stats / Values Strip (Vibrant Corporate Accent Bar) */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 bg-gradient-to-r from-teal-700 via-teal-800 to-slate-800 text-white">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <StatCard
              number="100%"
              label="Bebas Biaya"
              description="Tanpa perantara & pungutan"
            />
            <StatCard
              number="Resmi"
              label="Katalog Posisi"
              description="Informasi kualifikasi terpadu"
            />
            <StatCard
              number="Real-Time"
              label="Status Seleksi"
              description="Pelacakan mandiri pelamar"
            />
            <StatCard
              number="K3 Tambang"
              label="Standar Keselamatan"
              description="Kepatuhan operasional tinggi"
            />
          </div>
        </div>
      </section>

      {/* 5. Clean Bottom Call to Action */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 max-w-4xl mx-auto text-center bg-white">
        <div className="space-y-4">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900">
            Siap Menjadi Bagian dari Tim BDP?
          </h2>
          <p className="text-base text-slate-600 max-w-xl mx-auto">
            Kunjungi katalog informasi posisi untuk memeriksa kualifikasi peran dan
            persiapkan berkas administrasi Anda untuk pembukaan batch rekrutmen.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/informasi-posisi"
              className="inline-flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-6 rounded-xl text-sm shadow-md shadow-teal-600/20 transition-all"
            >
              <span>Eksplorasi Informasi Posisi</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/tracking"
              className="inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-800 font-semibold py-3 px-6 rounded-xl text-sm border border-slate-300 transition-colors shadow-xs"
            >
              <span>Cek Status Lamaran</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  href,
  badge,
}: FeatureCardProps) {
  return (
    <Link
      href={href}
      className="group flex flex-col justify-between p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/90 hover:border-teal-500/60 transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1"
    >
      <div>
        <div className="flex items-center justify-between mb-5">
          <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-100 group-hover:border-teal-300 transition-colors flex items-center justify-center">
            {icon}
          </div>
          {badge && (
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-teal-800">
              {badge}
            </span>
          )}
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-teal-700 transition-colors">
          {title}
        </h3>
        <p className="text-sm text-slate-600 leading-relaxed">
          {description}
        </p>
      </div>
      <div className="pt-5 flex items-center text-xs font-bold text-teal-700 gap-1.5 group-hover:translate-x-1 transition-transform">
        <span>Akses Layanan</span>
        <ChevronRight className="w-4 h-4" />
      </div>
    </Link>
  );
}

function StatCard({ number, label, description }: StatCardProps) {
  return (
    <div className="p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
      <div className="text-2xl sm:text-3xl font-black text-white mb-1">
        {number}
      </div>
      <div className="text-xs sm:text-sm font-bold text-teal-200 mb-0.5">
        {label}
      </div>
      <div className="text-[11px] text-teal-100/80 truncate">
        {description}
      </div>
    </div>
  );
}
