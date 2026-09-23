"use client";

import { ParentSize } from "@visx/responsive";
import { Group } from "@visx/group";
import { scaleBand, scaleLinear } from "@visx/scale";
import { Bar } from "@visx/shape";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { useTooltip, useTooltipInPortal } from "@visx/tooltip";
import { C } from "@/lib/palette";

export interface Bin {
  label: string;
  value: number;
}

function Chart({
  width,
  height,
  bins,
  color = C.primary,
  yLabel,
}: {
  width: number;
  height: number;
  bins: Bin[];
  color?: string;
  yLabel?: string;
}) {
  const m = { top: 12, right: 8, bottom: 30, left: 34 };
  const iw = width - m.left - m.right;
  const ih = height - m.top - m.bottom;
  const x = scaleBand({ domain: bins.map((b) => b.label), range: [0, iw], padding: 0.25 });
  const max = Math.max(1, ...bins.map((b) => b.value));
  const y = scaleLinear({ domain: [0, max], range: [ih, 0], nice: true });

  const { tooltipData, tooltipLeft, tooltipTop, tooltipOpen, showTooltip, hideTooltip } =
    useTooltip<Bin>();
  const { containerRef, TooltipInPortal } = useTooltipInPortal({ scroll: true });

  return (
    <div className="relative">
      <svg ref={containerRef} width={width} height={height}>
        <Group left={m.left} top={m.top}>
          <AxisLeft
            scale={y}
            numTicks={4}
            stroke={C.faint}
            tickStroke={C.faint}
            label={yLabel}
            labelProps={{ fill: C.muted, fontSize: 11 }}
            tickLabelProps={() => ({ fill: C.muted, fontSize: 10, dx: -2, dy: 3, textAnchor: "end" })}
          />
          {bins.map((b) => {
            const bw = x.bandwidth();
            const bh = ih - y(b.value);
            return (
              <Bar
                key={b.label}
                x={x(b.label)}
                y={y(b.value)}
                width={bw}
                height={bh}
                rx={4}
                fill={color}
                onMouseMove={(e) =>
                  showTooltip({
                    tooltipData: b,
                    tooltipLeft: (x(b.label) ?? 0) + m.left + bw / 2,
                    tooltipTop: y(b.value) + m.top,
                  })
                }
                onMouseLeave={hideTooltip}
              />
            );
          })}
          <AxisBottom
            top={ih}
            scale={x}
            stroke={C.faint}
            tickStroke={C.faint}
            tickLabelProps={() => ({ fill: C.muted, fontSize: 10, textAnchor: "middle" })}
          />
        </Group>
      </svg>
      {tooltipOpen && tooltipData && (
        <TooltipInPortal
          left={tooltipLeft}
          top={tooltipTop}
          className="!rounded-md !bg-ink !px-2 !py-1 !text-xs !text-white"
        >
          <strong>{tooltipData.value}</strong> · {tooltipData.label}
        </TooltipInPortal>
      )}
    </div>
  );
}

export default function Distribution(props: {
  bins: Bin[];
  color?: string;
  yLabel?: string;
  height?: number;
}) {
  const { height = 220, ...rest } = props;
  return (
    <div style={{ height }}>
      <ParentSize>{({ width }) => <Chart width={width} height={height} {...rest} />}</ParentSize>
    </div>
  );
}
