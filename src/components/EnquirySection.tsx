import React, { useEffect, useState } from 'react';
import { RESIDENCES } from '../data/residences';

interface EnquirySectionProps {
  selectedResidencePreset: string;
  onNavigate: (sectionId: string) => void;
  onReplayIntro: () => void;
}

export const EnquirySection: React.FC<EnquirySectionProps> = ({
  selectedResidencePreset,
  onNavigate,
  onReplayIntro,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [residence, setResidence] = useState(
    selectedResidencePreset || RESIDENCES[0].name
  );
  const [viewingFormat, setViewingFormat] = useState('Private Dusk Terrace Walkthrough');
  const [notes, setNotes] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [referenceId, setReferenceId] = useState<string | null>(null);

  useEffect(() => {
    if (selectedResidencePreset) {
      setResidence(selectedResidencePreset);
    }
  }, [selectedResidencePreset]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedEmail = email.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!name.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!emailPattern.test(trimmedEmail)) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    setErrorMsg(null);
    const code = `HLX-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    setReferenceId(code);
  };

  return (
    <>
      <section
        id="talk-to-us"
        className="relative z-10 border-t border-white/10 bg-[#0D0A22] px-6 py-24 sm:px-10 lg:px-20 lg:py-32"
      >
        <div className="mx-auto max-w-[1200px]">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.15fr] lg:items-start">
            {/* Left Editorial Desk Info */}
            <div data-scroll-item>
              <span className="text-xs font-medium uppercase tracking-[0.22em] text-[#F2B8C0]">
                05 · Talk To Us
              </span>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Arrange a Private Dusk Arrival
              </h2>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-white/70">
                Appointments are hosted exclusively after sunset or by helicopter transfer so
                prospective principals experience the harbour acoustics, lighting calibration,
                and glass terrace in nocturnal conditions.
              </p>

              <dl className="mt-10 space-y-5 border-t border-white/10 pt-8 text-sm">
                <div>
                  <dt className="text-xs uppercase tracking-wider text-white/45">
                    Private Gallery & Berth
                  </dt>
                  <dd className="mt-1 text-white/90">
                    180 Sovereign Quay, Victoria Harbour Basin
                  </dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wider text-white/45">
                    Direct Acquisition Desk
                  </dt>
                  <dd className="mt-1 tabular-nums text-white/90">
                    concierge@harborlux.estates · +44 20 7946 0820
                  </dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wider text-white/45">
                    Helipad Coordinates
                  </dt>
                  <dd className="mt-1 tabular-nums text-white/90">
                    Pad VHH-01 · Elevation 318 m AMSL
                  </dd>
                </div>
              </dl>
            </div>

            {/* Right Interactive Registration Form */}
            <div
              data-scroll-item
              className="rounded-3xl border border-white/10 bg-[#130F2E]/80 p-6 sm:p-9"
            >
              {referenceId ? (
                <div className="space-y-5 py-6">
                  <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[#F2B8C0]">
                    Briefing Confirmed
                  </div>
                  <h3 className="text-2xl font-semibold text-white">
                    Your private dossier request is registered.
                  </h3>
                  <p className="text-sm leading-relaxed text-white/75">
                    Thank you, <span className="font-medium text-white">{name}</span>. Our
                    senior private-client advisor has scheduled your{' '}
                    <span className="font-medium text-white">{viewingFormat}</span> for{' '}
                    <span className="font-medium text-white">{residence}</span>.
                  </p>
                  <div className="rounded-xl border border-white/10 bg-[#0D0A22] px-4 py-3 text-xs text-white/70">
                    Reference Code:{' '}
                    <span className="tabular-nums font-semibold text-white">
                      {referenceId}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setReferenceId(null);
                      setNotes('');
                    }}
                    className="inline-flex h-10 items-center justify-center rounded-full border border-white/20 px-6 text-xs font-medium text-white transition hover:bg-white/10 cursor-pointer"
                  >
                    Submit Another Request
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="desk-name"
                        className="mb-1.5 block text-xs text-white/65"
                      >
                        Full Name *
                      </label>
                      <input
                        id="desk-name"
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Alex Mercer"
                        className="w-full rounded-xl border border-white/15 bg-[#0D0A22]/80 px-4 py-3 text-sm text-white placeholder-white/35 focus:border-[#F2B8C0] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="desk-email"
                        className="mb-1.5 block text-xs text-white/65"
                      >
                        Email Address *
                      </label>
                      <input
                        id="desk-email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="principal@familyoffice.com"
                        className="w-full rounded-xl border border-white/15 bg-[#0D0A22]/80 px-4 py-3 text-sm text-white placeholder-white/35 focus:border-[#F2B8C0] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="desk-phone"
                        className="mb-1.5 block text-xs text-white/65"
                      >
                        Direct Telephone (Optional)
                      </label>
                      <input
                        id="desk-phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+44 7700 900077"
                        className="w-full rounded-xl border border-white/15 bg-[#0D0A22]/80 px-4 py-3 text-sm text-white placeholder-white/35 focus:border-[#F2B8C0] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="desk-residence"
                        className="mb-1.5 block text-xs text-white/65"
                      >
                        Estate of Interest
                      </label>
                      <select
                        id="desk-residence"
                        value={residence}
                        onChange={(e) => setResidence(e.target.value)}
                        className="w-full rounded-xl border border-white/15 bg-[#0D0A22] px-4 py-3 text-sm text-white focus:border-[#F2B8C0] focus:outline-none"
                      >
                        {RESIDENCES.map((res) => (
                          <option key={res.id} value={res.name}>
                            {res.name} ({res.priceUsd})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="desk-format"
                      className="mb-1.5 block text-xs text-white/65"
                    >
                      Arrival & Briefing Format
                    </label>
                    <select
                      id="desk-format"
                      value={viewingFormat}
                      onChange={(e) => setViewingFormat(e.target.value)}
                      className="w-full rounded-xl border border-white/15 bg-[#0D0A22] px-4 py-3 text-sm text-white focus:border-[#F2B8C0] focus:outline-none"
                    >
                      <option>Private Dusk Terrace Walkthrough</option>
                      <option>Twilight Helicopter Arrival (Pad VHH-01)</option>
                      <option>Sovereign Marina Berth Transfer</option>
                      <option>Confidential Architectural Video Briefing</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="desk-notes"
                      className="mb-1.5 block text-xs text-white/65"
                    >
                      Acquisition Notes
                    </label>
                    <textarea
                      id="desk-notes"
                      rows={3}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Preferred dates, family office representation, or architectural specifications"
                      className="w-full rounded-xl border border-white/15 bg-[#0D0A22]/80 px-4 py-3 text-sm text-white placeholder-white/35 focus:border-[#F2B8C0] focus:outline-none"
                    />
                  </div>

                  {errorMsg && (
                    <p role="alert" className="text-xs font-medium text-[#F2B8C0]">
                      {errorMsg}
                    </p>
                  )}

                  <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                    <span className="text-xs text-white/45">
                      Strict NDA & private registry compliance.
                    </span>
                    <button
                      type="submit"
                      className="inline-flex h-11 items-center justify-center rounded-full bg-[#F2B8C0] px-7 text-sm font-semibold text-[#180F3C] transition hover:-translate-y-0.5 hover:bg-[#F7C9D0] cursor-pointer whitespace-nowrap"
                    >
                      Request Private Viewing
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Quiet Editorial Footer */}
      <footer className="relative z-10 border-t border-white/10 bg-[#080616] px-6 py-12 sm:px-10 lg:px-20">
        <div className="mx-auto flex max-w-[1200px] flex-col justify-between gap-8 sm:flex-row sm:items-center">
          <div>
            <div className="text-sm font-semibold tracking-[0.28em] text-white">
              HARBORLUX
            </div>
            <p className="mt-2 text-xs text-white/45">
              180 Sovereign Quay · Harbour-view penthouses above a city that never sleeps.
            </p>
          </div>

          <nav className="flex flex-wrap items-center gap-6 text-xs text-white/65">
            <button
              type="button"
              onClick={() => onNavigate('home')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Summit View
            </button>
            <button
              type="button"
              onClick={() => onNavigate('the-firm')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              The Firm
            </button>
            <button
              type="button"
              onClick={() => onNavigate('skyline-homes')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Skyline Homes
            </button>
            <button
              type="button"
              onClick={() => onNavigate('talk-to-us')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Talk To Us
            </button>
            <button
              type="button"
              onClick={onReplayIntro}
              className="text-[#F2B8C0] hover:text-[#F7C9D0] transition-colors cursor-pointer"
            >
              Replay Intro ↑
            </button>
          </nav>
        </div>
      </footer>
    </>
  );
};
