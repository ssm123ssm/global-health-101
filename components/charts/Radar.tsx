"use client";

import { ParentSize } from "@visx/responsive";
import { Group } from "@visx/group";
import { scaleLinear } from "@visx/scale";
import { Text } from "@visx/text";
import { C } from "@/lib/palette";

export interface RadarSeries {
  name: string;
  color: string;
  values: number[]; // one per axis, already normalized 0..1
}

function point(cx: number, cy: number, r: number, angle: number) {
  return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)] as const;
}

function Chart({
  width,
  height,
  axes,
  series,
}: {
  width: number;
  height: number;
  axes: string[];
  series: RadarSeries[];
}) {
  const cx = width / 2;
  const cy = height / 2;
  const radius = Math.min(width, height) / 2 - 64;
  const n = axes.length;
  const r = scaleLinear({ domain: [0, 1], range: [0, radius] });
  const angle = (i: number) => (Math.PI * 2 * i) / n - Math.PI / 2;
  const rings = [0.25, 0.5, 0.75, 1];

  return (
    <svg width={width} height={height}>
      <Group>
        {rings.map((ring) => (
          <polygon
            key={ring}
            points={axes
              .map((_, i) => point(cx, cy, r(ring), angle(i)).join(","))
              .join(" ")}
            fill="none"
            stroke={C.line}
            strokeWidth={1}
          />
        ))}
        {axes.map((a, i) => {
          const [ex, ey] = point(cx, cy, radius, angle(i));
          const [lx, ly] = point(cx, cy, radius + 16, angle(i));
          return (
            <g key={a}>
              <line x1={cx} y1={cy} x2={ex} y2={ey} stroke={C.line} />
              <Text
                x={lx}
                y={ly}
                fontSize={11}
                fill={C.muted}
                textAnchor={Math.abs(lx - cx) < 8 ? "middle" : lx > cx ? "start" : "end"}
                verticalAnchor="middle"
                width={92}
              >
                {a}
              </Text>
            </g>
          );
        })}
        {series.map((s) => {
          const pts = s.values.map((v, i) => point(cx, cy, r(v), angle(i)));
          return (
            <g key={s.name}>
              <polygon
                points={pts.map((p) => p.join(",")).join(" ")}
                fill={s.color}
                fillOpacity={0.14}
                stroke={s.color}
                strokeWidth={2}
              />
              {pts.map((p, i) => (
                <circle key={i} cx={p[0]} cy={p[1]} r={2.5} fill={s.color} />
              ))}
            </g>
          );
        })}
      </Group>
    </svg>
  );
}

export default function Radar({
  axes,
  series,
  height = 340,
}: {
  axes: string[];
  series: RadarSeries[];
  height?: number;
}) {
  return (
    <div style={{ height }}>
      <ParentSize>{({ width }) => <Chart width={width} height={height} axes={axes} series={series} />}</ParentSize>
    </div>
  );
}
