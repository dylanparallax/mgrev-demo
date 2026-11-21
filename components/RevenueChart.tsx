'use client';

import { useState } from 'react';

type RevenueMonth = {
  month: string;
  shortMonth: string;
  actual: number;
  model: number;
};

const REVENUE_DATA: RevenueMonth[] = [
  { month: 'January', shortMonth: 'JAN', actual: 0, model: 30 },
  { month: 'February', shortMonth: 'FEB', actual: 10, model: 70 },
  { month: 'March', shortMonth: 'MAR', actual: 35, model: 120 },
  { month: 'April', shortMonth: 'APR', actual: 80, model: 180 },
  { month: 'May', shortMonth: 'MAY', actual: 140, model: 250 },
  { month: 'June', shortMonth: 'JUN', actual: 215, model: 330 },
  { month: 'July', shortMonth: 'JUL', actual: 300, model: 420 },
  { month: 'August', shortMonth: 'AUG', actual: 390, model: 520 },
  { month: 'September', shortMonth: 'SEP', actual: 500, model: 640 },
  { month: 'October', shortMonth: 'OCT', actual: 612, model: 780 },
];

const PLOT = { left: 60, right: 780, top: 20, bottom: 230, max: 800 };
const xFor = (index: number) =>
  PLOT.left + (index * (PLOT.right - PLOT.left)) / (REVENUE_DATA.length - 1);
const yFor = (value: number) =>
  PLOT.bottom - (value / PLOT.max) * (PLOT.bottom - PLOT.top);
const pointsFor = (key: 'actual' | 'model') =>
  REVENUE_DATA.map((item, index) => `${xFor(index)},${yFor(item[key])}`).join(' ');

const Y_AXIS_VALUES = [0, 200, 400, 600, 800];
const COLUMN_WIDTH = (PLOT.right - PLOT.left) / (REVENUE_DATA.length - 1);

export default function RevenueChart() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const selected = selectedIndex === null ? null : REVENUE_DATA[selectedIndex];
  const selectedX = selectedIndex === null ? null : xFor(selectedIndex);

  return (
    <svg
      viewBox="0 0 820 270"
      style={{ width: '100%', height: 'auto', display: 'block' }}
      role="img"
      aria-labelledby="revenue-chart-title revenue-chart-description"
      onMouseLeave={() => setSelectedIndex(null)}
    >
      <title id="revenue-chart-title">Cumulative cross-sell revenue versus investment model</title>
      <desc id="revenue-chart-description">
        Cumulative cross-sell revenue from January to October 2026. Actual revenue reaches $612K
        against a modeled $780K. Focus or select a month for details.
      </desc>

      <g stroke="#ECECE8" strokeWidth="1">
        {Y_AXIS_VALUES.map((value) => (
          <line
            key={value}
            x1={PLOT.left}
            y1={yFor(value)}
            x2={PLOT.right}
            y2={yFor(value)}
          />
        ))}
      </g>

      <g
        fontFamily="Space Mono, monospace"
        fontSize="11"
        fill="#6E727C"
        textAnchor="end"
      >
        {Y_AXIS_VALUES.map((value) => (
          <text key={value} x="48" y={yFor(value) + 4}>
            {value === 0 ? '$0' : `$${value}K`}
          </text>
        ))}
      </g>

      <g
        fontFamily="Space Mono, monospace"
        fontSize="11"
        fill="#6E727C"
        textAnchor="middle"
      >
        {REVENUE_DATA.map((item, index) => (
          <text key={item.month} x={xFor(index)} y="254">
            {item.shortMonth}
          </text>
        ))}
      </g>

      <polyline
        fill="none"
        stroke="#8A8F99"
        strokeWidth="2"
        strokeDasharray="6 5"
        points={pointsFor('model')}
      />
      <polyline
        fill="none"
        stroke="#F26322"
        strokeWidth="2.5"
        points={pointsFor('actual')}
      />

      <circle
        cx={xFor(REVENUE_DATA.length - 1)}
        cy={yFor(REVENUE_DATA.at(-1)!.actual)}
        r="4.5"
        fill="#F26322"
      />
      <circle
        cx={xFor(REVENUE_DATA.length - 1)}
        cy={yFor(REVENUE_DATA.at(-1)!.model)}
        r="3.5"
        fill="#FFFFFF"
        stroke="#8A8F99"
        strokeWidth="2"
      />
      <g fontFamily="Space Mono, monospace" fontSize="11" textAnchor="end">
        <text x="770" y={yFor(REVENUE_DATA.at(-1)!.actual) + 19} fill="#B3440F">
          $612K
        </text>
        <text x="770" y={yFor(REVENUE_DATA.at(-1)!.model) - 9} fill="#6E727C">
          $780K
        </text>
      </g>

      {selected && selectedX !== null && (
        <g pointerEvents="none">
          <line
            x1={selectedX}
            y1={PLOT.top}
            x2={selectedX}
            y2={PLOT.bottom}
            stroke="#3D4048"
            strokeWidth="1"
            opacity="0.45"
          />
          <circle
            cx={selectedX}
            cy={yFor(selected.model)}
            r="5"
            fill="#FFFFFF"
            stroke="#8A8F99"
            strokeWidth="2.5"
          />
          <circle
            cx={selectedX}
            cy={yFor(selected.actual)}
            r="5.5"
            fill="#F26322"
            stroke="#FFFFFF"
            strokeWidth="2"
          />

          <g transform={`translate(${selectedX > 600 ? selectedX - 176 : selectedX + 12}, 28)`}>
            <rect width="164" height="102" rx="5" fill="#24262B" />
            <text
              x="12"
              y="20"
              fill="#FFFFFF"
              fontFamily="Space Mono, monospace"
              fontSize="11"
              fontWeight="700"
            >
              {selected.month}
            </text>
            <circle cx="16" cy="40" r="3.5" fill="#F26322" />
            <text x="28" y="44" fill="#FFFFFF" fontFamily="Space Mono, monospace" fontSize="11">
              Actual ${selected.actual}K
            </text>
            <line
              x1="12"
              y1="61"
              x2="22"
              y2="61"
              stroke="#A8ABB2"
              strokeWidth="2"
              strokeDasharray="3 2"
            />
            <text x="28" y="65" fill="#FFFFFF" fontFamily="Space Mono, monospace" fontSize="11">
              Model ${selected.model}K
            </text>
            <text x="12" y="87" fill="#FFFFFF" fontFamily="Space Mono, monospace" fontSize="11">
              Gap ${selected.model - selected.actual}K
            </text>
          </g>
        </g>
      )}

      <g>
        {REVENUE_DATA.map((item, index) => {
          const isFirst = index === 0;
          const isLast = index === REVENUE_DATA.length - 1;
          const x = xFor(index) - (isFirst ? 0 : COLUMN_WIDTH / 2);
          const width = isFirst || isLast ? COLUMN_WIDTH / 2 : COLUMN_WIDTH;

          return (
            <rect
              key={item.month}
              x={x}
              y={PLOT.top}
              width={width}
              height={PLOT.bottom - PLOT.top}
              fill="transparent"
              tabIndex={0}
              role="button"
              aria-label={`${item.month}: Actual $${item.actual}K, Model $${item.model}K, gap $${item.model - item.actual}K`}
              onPointerEnter={() => setSelectedIndex(index)}
              onFocus={() => setSelectedIndex(index)}
              onClick={() => setSelectedIndex(index)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  setSelectedIndex(index);
                }
              }}
              style={{ cursor: 'pointer', outline: 'none' }}
            />
          );
        })}
      </g>
    </svg>
  );
}
