import React, { useMemo, useState } from 'react';
import {
  ALTITUDE_LEVELS,
  RESIDENCES,
  type ResidenceCategory,
} from '../data/residences';
import { FloorplanBlueprint } from './FloorplanBlueprint';

interface ResidencesSectionProps {
  onEnquire: (residenceLabel: string) => void;
}

const FILTER_OPTIONS: { key: ResidenceCategory; label: string }[] = [
  { key: 'All', label: 'All Estates' },
  { key: 'Available', label: 'Immediate Release' },
  { key: 'Penthouses', label: 'Sky Penthouses' },
  { key: 'Full-Floor', label: 'Full-Floor' },
];

export const ResidencesSection: React.FC<ResidencesSectionProps> = ({
  onEnquire,
}) => {
  const [filter, setFilter] = useState<ResidenceCategory>('All');
  const [selectedId, setSelectedId] = useState<string>(RESIDENCES[0].id);
  const [altitudeIndex, setAltitudeIndex] = useState<number>(ALTITUDE_LEVELS.length - 1);

  const filteredResidences = useMemo(() => {
    return RESIDENCES.filter((res) => {
      if (filter === 'All') return true;
      if (filter === 'Available') return res.status === 'Available';
      return res.category === filter;
    });
  }, [filter]);

  const activeResidence =
    filteredResidences.find((r) => r.id === selectedId) ??
    filteredResidences[0] ??
    RESIDENCES[0];

  const activeAltitude = ALTITUDE_LEVELS[altitudeIndex] ?? ALTITUDE_LEVELS[4];

  return (
    <section
      id="skyline-homes"
      className="relative z-10 border-t border-white/10 bg-[#0A081C] px-6 py-24 sm:px-10 lg:px-20 lg:py-32"
    >
      <div className="mx-auto max-w-[1200px]">
        {/* Header + Filter Controls */}
        <div
          data-scroll-item
          className="flex flex-col justify-between gap-6 border-b border-white/10 pb-8 lg:flex-row lg:items-end"
        >
          <div>
            <span className="text-xs font-medium uppercase tracking-[0.22em] text-[#F2B8C0]">
              03 · Skyline Homes
            </span>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Private Residences & Floorplans
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/65">
              Select an estate below to inspect full spatial dimensions, acoustic glazing
              exposures, and interactive room layouts.
            </p>
          </div>

          <div
            role="tablist"
            aria-label="Filter residences"
            className="inline-flex flex-wrap items-center gap-1 rounded-xl border border-white/10 bg-white/[0.04] p-1"
          >
            {FILTER_OPTIONS.map((opt) => (
              <button
                key={opt.key}
                type="button"
                role="tab"
                aria-selected={filter === opt.key}
                onClick={() => {
                  setFilter(opt.key);
                  const nextMatch = RESIDENCES.find((r) => {
                    if (opt.key === 'All') return true;
                    if (opt.key === 'Available') return r.status === 'Available';
                    return r.category === opt.key;
                  });
                  if (nextMatch) setSelectedId(nextMatch.id);
                }}
                className={`rounded-lg px-3.5 py-2 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  filter === opt.key
                    ? 'bg-white text-[#180F3C] font-semibold'
                    : 'text-white/75 hover:bg-white/10 hover:text-white'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Master-Detail Portfolio Explorer */}
        <div
          data-scroll-item
          className="mt-10 grid gap-8 lg:grid-cols-[0.95fr_1.65fr] lg:items-start"
        >
          {/* Left: Residence Selector List */}
          <div className="space-y-3">
            {filteredResidences.map((res) => {
              const isSelected = activeResidence.id === res.id;
              return (
                <button
                  key={res.id}
                  type="button"
                  onClick={() => setSelectedId(res.id)}
                  className={`w-full rounded-2xl border p-5 text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'border-[#F2B8C0]/70 bg-[#18133A]'
                      : 'border-white/10 bg-[#110D29]/80 hover:border-white/25 hover:bg-[#151033]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3 text-xs">
                    <span className="tabular-nums font-medium text-[#F2B8C0]">
                      {res.level} · {res.elevationM} m
                    </span>
                    <span
                      className={`tabular-nums font-medium ${
                        res.status === 'Available' ? 'text-white/80' : 'text-white/45'
                      }`}
                    >
                      {res.status}
                    </span>
                  </div>

                  <div className="mt-2 text-lg font-semibold text-white">
                    {res.name}
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-white/60 tabular-nums">
                    <span>{res.interiorSqFt.toLocaleString()} sq ft Interior</span>
                    <span aria-hidden="true">·</span>
                    <span>{res.bedrooms} Bed</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-semibold text-white">{res.priceUsd}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right: Detailed Dossier + Floorplan */}
          <div className="space-y-6 rounded-3xl border border-white/10 bg-[#110D29] p-6 sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-white/10 pb-6">
              <div>
                <div className="flex items-center gap-2 text-xs text-[#F2B8C0] tabular-nums">
                  <span>{activeResidence.level}</span>
                  <span aria-hidden="true">·</span>
                  <span>{activeResidence.elevationM} m Elevation</span>
                  <span aria-hidden="true">·</span>
                  <span>{activeResidence.status}</span>
                </div>
                <h3 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                  {activeResidence.name}
                </h3>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/70">
                  {activeResidence.summary}
                </p>
              </div>

              <div className="text-left sm:text-right">
                <div className="text-xs uppercase tracking-[0.16em] text-white/50">
                  Guide Valuation
                </div>
                <div className="mt-1 tabular-nums text-2xl font-semibold text-white">
                  {activeResidence.priceUsd}
                </div>
              </div>
            </div>

            {/* Technical Spec Strip */}
            <div className="grid grid-cols-2 gap-4 border-b border-white/10 pb-6 sm:grid-cols-3 lg:grid-cols-6">
              <div>
                <div className="text-[11px] uppercase tracking-wider text-white/50">
                  Interior
                </div>
                <div className="mt-1 tabular-nums text-sm font-semibold text-white">
                  {activeResidence.interiorSqFt.toLocaleString()} sq ft
                </div>
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-wider text-white/50">
                  Terrace
                </div>
                <div className="mt-1 tabular-nums text-sm font-semibold text-white">
                  {activeResidence.exteriorSqFt.toLocaleString()} sq ft
                </div>
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-wider text-white/50">
                  Ceiling
                </div>
                <div className="mt-1 tabular-nums text-sm font-semibold text-white">
                  {activeResidence.ceilingM}
                </div>
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-wider text-white/50">
                  Layout
                </div>
                <div className="mt-1 tabular-nums text-sm font-semibold text-white">
                  {activeResidence.bedrooms} Bed / {activeResidence.bathrooms} Bath
                </div>
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-wider text-white/50">
                  Exposure
                </div>
                <div className="mt-1 text-sm font-semibold text-white">
                  {activeResidence.exposure}
                </div>
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-wider text-white/50">
                  Private Lifts
                </div>
                <div className="mt-1 tabular-nums text-sm font-semibold text-white">
                  {activeResidence.privateLifts} Direct
                </div>
              </div>
            </div>

            {/* Interactive SVG Floorplan */}
            <FloorplanBlueprint key={activeResidence.id} residence={activeResidence} />

            {/* Highlights & Action */}
            <div className="flex flex-col justify-between gap-6 pt-2 sm:flex-row sm:items-end">
              <ul className="grid gap-2 text-xs text-white/75 sm:grid-cols-2 sm:gap-x-6">
                {activeResidence.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-2">
                    <span className="mt-1 text-[#F2B8C0]" aria-hidden="true">
                      —
                    </span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>

              <button
                type="button"
                onClick={() => onEnquire(activeResidence.name)}
                className="inline-flex h-11 shrink-0 items-center justify-center rounded-full bg-[#F2B8C0] px-7 text-sm font-semibold text-[#180F3C] transition hover:-translate-y-0.5 hover:bg-[#F7C9D0] cursor-pointer whitespace-nowrap"
              >
                Request Full Dossier
              </button>
            </div>
          </div>
        </div>

        {/* 04 · Interactive Altitude Sightline Explorer */}
        <div
          data-scroll-item
          className="mt-16 rounded-3xl border border-white/10 bg-[#130F2E]/70 p-6 sm:p-10"
        >
          <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr] lg:items-center">
            <div>
              <span className="text-xs font-medium uppercase tracking-[0.22em] text-[#F2B8C0]">
                04 · Horizon Sightlines
              </span>
              <h3 className="mt-2 text-2xl font-semibold tracking-tight text-white">
                Inspect atmospheric clarity by floor altitude
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-white/65">
                {activeAltitude.vantageNote}
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                {ALTITUDE_LEVELS.map((lvl, idx) => (
                  <button
                    key={lvl.level}
                    type="button"
                    onClick={() => setAltitudeIndex(idx)}
                    className={`rounded-full px-4 py-2 text-xs tabular-nums font-semibold transition cursor-pointer ${
                      altitudeIndex === idx
                        ? 'bg-white text-[#180F3C]'
                        : 'border border-white/15 bg-white/5 text-white/75 hover:bg-white/12 hover:text-white'
                    }`}
                  >
                    {lvl.level}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="rounded-2xl border border-white/10 bg-[#0D0A22] p-5">
                <div className="text-[11px] uppercase tracking-wider text-white/50">
                  Altitude
                </div>
                <div className="mt-2 tabular-nums text-2xl font-semibold text-white">
                  {activeAltitude.altitudeM} m
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-[#0D0A22] p-5">
                <div className="text-[11px] uppercase tracking-wider text-white/50">
                  Sea Horizon
                </div>
                <div className="mt-2 tabular-nums text-2xl font-semibold text-[#F2B8C0]">
                  {activeAltitude.horizonKm} km
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-[#0D0A22] p-5">
                <div className="text-[11px] uppercase tracking-wider text-white/50">
                  Sway Damped
                </div>
                <div className="mt-2 tabular-nums text-2xl font-semibold text-white">
                  {activeAltitude.windDampening}
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-[#0D0A22] p-5">
                <div className="text-[11px] uppercase tracking-wider text-white/50">
                  Interior Quiet
                </div>
                <div className="mt-2 tabular-nums text-2xl font-semibold text-white">
                  {activeAltitude.noiseFloorDb}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
