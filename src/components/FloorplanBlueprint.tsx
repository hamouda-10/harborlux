import React, { useState } from 'react';
import type { FloorplanRoom, Residence } from '../data/residences';

interface FloorplanBlueprintProps {
  residence: Residence;
}

export const FloorplanBlueprint: React.FC<FloorplanBlueprintProps> = ({ residence }) => {
  const [selectedRoomId, setSelectedRoomId] = useState<string>(residence.rooms[0]?.id ?? '');

  const activeRoom: FloorplanRoom | undefined =
    residence.rooms.find((r) => r.id === selectedRoomId) ?? residence.rooms[0];

  return (
    <div className="rounded-2xl border border-white/10 bg-[#0A081C]/90 p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <span className="text-[11px] uppercase tracking-[0.2em] text-white/50">
            Architectural Plan · {residence.level}
          </span>
          <h4 className="mt-1 text-sm font-medium text-white">
            Interactive Spatial Layout — Click or hover any zone
          </h4>
        </div>
        <span className="text-xs tabular-nums text-white/60">
          North ↑ Harbour Aspect
        </span>
      </div>

      <div className="mt-5 grid gap-6 lg:grid-cols-[1.35fr_1fr] lg:items-center">
        {/* SVG Architectural Schematic */}
        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl border border-white/10 bg-[#0D0A22] p-3">
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="h-full w-full"
            role="img"
            aria-label={`Architectural schematic for ${residence.name}`}
          >
            {/* Architectural Grid Hairlines */}
            <defs>
              <pattern id="hl-grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path
                  d="M 10 0 L 0 0 0 10"
                  fill="none"
                  stroke="rgba(255,255,255,0.045)"
                  strokeWidth="0.25"
                />
              </pattern>
            </defs>
            <rect x="0" y="0" width="100" height="100" fill="url(#hl-grid)" />

            {/* Outer Tower Curtain Wall */}
            <rect
              x="2.5"
              y="3.5"
              width="95"
              height="93"
              fill="none"
              stroke="rgba(255,255,255,0.22)"
              strokeWidth="0.5"
            />

            {residence.rooms.map((room) => {
              const isSelected = activeRoom?.id === room.id;
              return (
                <g
                  key={room.id}
                  onMouseEnter={() => setSelectedRoomId(room.id)}
                  onClick={() => setSelectedRoomId(room.id)}
                  className="cursor-pointer"
                >
                  <rect
                    x={room.x}
                    y={room.y}
                    width={room.w}
                    height={room.h}
                    rx="0.8"
                    fill={
                      isSelected
                        ? 'rgba(242, 184, 192, 0.16)'
                        : 'rgba(255, 255, 255, 0.03)'
                    }
                    stroke={
                      isSelected
                        ? '#F2B8C0'
                        : 'rgba(255, 255, 255, 0.22)'
                    }
                    strokeWidth={isSelected ? '0.65' : '0.35'}
                  />
                  <text
                    x={room.x + room.w / 2}
                    y={room.y + room.h / 2 - 1}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill={isSelected ? '#FFFFFF' : 'rgba(255,255,255,0.75)'}
                    fontSize="2.8"
                    fontWeight={isSelected ? '600' : '400'}
                    fontFamily="Inter, sans-serif"
                  >
                    {room.name}
                  </text>
                  <text
                    x={room.x + room.w / 2}
                    y={room.y + room.h / 2 + 3.8}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill={isSelected ? '#F2B8C0' : 'rgba(255,255,255,0.45)'}
                    fontSize="2.2"
                    fontFamily="Inter, sans-serif"
                  >
                    {room.areaSqFt.toLocaleString()} sq ft
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Selected Room Inspector */}
        {activeRoom && (
          <div className="flex flex-col justify-between space-y-5 rounded-xl border border-white/10 bg-white/[0.02] p-5">
            <div>
              <div className="text-[11px] uppercase tracking-[0.2em] text-[#F2B8C0]">
                Selected Zone
              </div>
              <h5 className="mt-1.5 text-lg font-semibold text-white">
                {activeRoom.name}
              </h5>

              <dl className="mt-4 space-y-3 border-t border-white/10 pt-4 text-sm">
                <div className="flex items-baseline justify-between gap-4">
                  <dt className="text-white/55">Dimensions</dt>
                  <dd className="tabular-nums font-medium text-white text-right">
                    {activeRoom.dimensions}
                  </dd>
                </div>
                <div className="flex items-baseline justify-between gap-4">
                  <dt className="text-white/55">Floor Area</dt>
                  <dd className="tabular-nums font-medium text-white">
                    {activeRoom.areaSqFt.toLocaleString()} sq ft
                  </dd>
                </div>
                <div className="border-t border-white/10 pt-3">
                  <dt className="text-xs text-white/55">Specification & Finishes</dt>
                  <dd className="mt-1 text-sm leading-relaxed text-white/85">
                    {activeRoom.finish}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="flex flex-wrap gap-1.5 border-t border-white/10 pt-4">
              {residence.rooms.map((room) => (
                <button
                  key={room.id}
                  type="button"
                  onClick={() => setSelectedRoomId(room.id)}
                  className={`rounded-lg px-2.5 py-1.5 text-xs transition-colors ${
                    activeRoom.id === room.id
                      ? 'bg-[#F2B8C0] font-semibold text-[#180F3C]'
                      : 'bg-white/6 text-white/75 hover:bg-white/12 hover:text-white'
                  }`}
                >
                  {room.name.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
