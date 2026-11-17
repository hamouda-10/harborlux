import React from 'react';
import {
  ENGINEERING_PILLARS,
  FIRM_METRICS,
  HARBOUR_PROXIMITY,
} from '../data/residences';

interface FirmSectionProps {
  onReplayIntro: () => void;
  onEnquire: (preset?: string) => void;
}

export const FirmSection: React.FC<FirmSectionProps> = ({
  onReplayIntro,
  onEnquire,
}) => {
  return (
    <section
      id="the-firm"
      className="relative z-10 border-t border-white/10 bg-[#0D0A22] px-6 py-24 sm:px-10 lg:px-20 lg:py-32"
    >
      <div className="mx-auto max-w-[1200px]">
        {/* Architectural Thesis + Metrics Split */}
        <div className="grid gap-14 lg:grid-cols-[1.15fr_1fr] lg:items-start">
          <div data-scroll-item>
            <div className="flex items-center gap-3 text-xs font-medium uppercase tracking-[0.22em] text-[#F2B8C0]">
              <span>01 · The Firm</span>
            </div>
            <h2 className="mt-4 max-w-2xl text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-[44px] lg:leading-[1.12]">
              Engineered for absolute stillness three hundred metres above the storm.
            </h2>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-white/70">
              Harborlux develops single-tower vertical estates positioned directly on deep-water
              metropolitan basins. Rather than stacking apartments, our structural engineers dedicate
              every upper floor to a solitary residence—combining acoustic storm glass, tuned
              rooftop water ballast, and direct biometric lift access from yacht berth to penthouse.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={() => onEnquire('Crown Triplex — The Summit')}
                className="inline-flex h-11 items-center justify-center rounded-full bg-[#F2B8C0] px-7 text-sm font-semibold text-[#180F3C] transition hover:-translate-y-0.5 hover:bg-[#F7C9D0] cursor-pointer whitespace-nowrap"
              >
                Schedule Private Briefing
              </button>
              <button
                type="button"
                onClick={onReplayIntro}
                className="inline-flex h-11 items-center justify-center rounded-full border border-white/18 bg-white/6 px-6 text-sm font-medium text-white/90 transition hover:bg-white/14 cursor-pointer whitespace-nowrap"
              >
                Replay Arrival Sequence ↑
              </button>
            </div>
          </div>

          {/* Quantified Architectural Proof Grid */}
          <div
            data-scroll-item
            className="grid grid-cols-2 border-l border-t border-white/10"
          >
            {FIRM_METRICS.map((item) => (
              <div
                key={item.label}
                className="border-b border-r border-white/10 p-6 sm:p-8"
              >
                <div className="tabular-nums text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                  {item.value}
                </div>
                <div className="mt-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#F2B8C0]">
                  {item.label}
                </div>
                <p className="mt-2 text-xs leading-relaxed text-white/60">
                  {item.detail}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 02 · Engineering & Materiality Asymmetric Grid */}
        <div className="mt-24 border-t border-white/10 pt-16">
          <div
            data-scroll-item
            className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"
          >
            <div>
              <span className="text-xs font-medium uppercase tracking-[0.22em] text-[#F2B8C0]">
                02 · Structural Craft
              </span>
              <h3 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                Four systems separating the summit from the city below
              </h3>
            </div>
            <p className="max-w-sm text-sm text-white/60">
              Every specification is measured against Category-4 harbour squall conditions and
              verified by independent acoustic testing.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {ENGINEERING_PILLARS.map((pillar) => (
              <article
                key={pillar.num}
                data-scroll-item
                className="flex flex-col justify-between rounded-2xl border border-white/10 bg-[#130F2E]/70 p-7 transition-colors hover:border-white/20"
              >
                <div>
                  <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
                    <span className="tabular-nums text-sm font-semibold text-white/50">
                      {pillar.num}.
                    </span>
                    <span className="tabular-nums text-xs font-medium tracking-wide text-[#F2B8C0]">
                      {pillar.metric}
                    </span>
                  </div>
                  <h4 className="mt-5 text-xl font-semibold text-white">
                    {pillar.title}
                  </h4>
                  <p className="mt-3 text-sm leading-relaxed text-white/70">
                    {pillar.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Harbour Transit & Marina Proximity Table */}
        <div
          data-scroll-item
          className="mt-16 rounded-2xl border border-white/10 bg-[#110D29] p-6 sm:p-8"
        >
          <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-white/10 pb-4">
            <h4 className="text-base font-semibold text-white">
              Direct Harbour Basin & Aviation Connectivity
            </h4>
            <span className="text-xs text-white/55">
              180 Sovereign Quay · Deep-Water Channel Access
            </span>
          </div>
          <div className="mt-4 divide-y divide-white/10">
            {HARBOUR_PROXIMITY.map((row) => (
              <div
                key={row.place}
                className="grid grid-cols-2 gap-3 py-3.5 text-sm sm:grid-cols-[1.5fr_1.2fr_0.6fr_0.6fr] sm:items-center"
              >
                <div className="font-medium text-white">{row.place}</div>
                <div className="text-white/60">{row.mode}</div>
                <div className="tabular-nums font-semibold text-[#F2B8C0] sm:text-right">
                  {row.time}
                </div>
                <div className="tabular-nums text-white/55 sm:text-right">
                  {row.distance}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
