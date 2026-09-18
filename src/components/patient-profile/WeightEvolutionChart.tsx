import React, { useState, useMemo } from "react";
import { WeightRecord } from "../../types";
import { formatCivilDate } from "../../utils/dateTime";

interface Props {
  data: WeightRecord[];
}

type RangeFilter = "recent10" | "last90d" | "all";

const WeightEvolutionChart: React.FC<Props> = ({ data }) => {
  const [filter, setFilter] = useState<RangeFilter>("recent10");

  // Filter and sort data chronologically
  const sortedData = useMemo(() => {
    if (!data || data.length === 0) return [];
    const sorted = [...data].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );

    if (filter === "recent10") {
      return sorted.slice(-10);
    }
    if (filter === "last90d") {
      const ninetyDaysAgo = Date.now() - 90 * 24 * 60 * 60 * 1000;
      const filtered = sorted.filter(
        (d) => new Date(d.date).getTime() >= ninetyDaysAgo,
      );
      return filtered.length > 0 ? filtered : sorted.slice(-5);
    }
    return sorted;
  }, [data, filter]);

  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-800/50 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700">
        <span className="text-4xl mb-2">📊</span>
        <p className="text-gray-400 font-medium">
          Nenhuma medição de peso registrada até o momento.
        </p>
      </div>
    );
  }

  // Handle single data point
  if (sortedData.length === 1) {
    const single = sortedData[0];
    return (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <span className="text-blue-500">📈</span> Evolução do Peso (kg)
          </h3>
          <span className="text-xs font-semibold px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg">
            1ª Medição Registrada
          </span>
        </div>
        <div className="h-48 flex flex-col items-center justify-center bg-blue-50/50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-800/30 p-4">
          <p className="text-3xl font-black text-blue-600 dark:text-blue-400 mb-1">
            {single.weight.toFixed(1)} kg
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Aferido em {formatCivilDate(single.date.split("T")[0])}
            {single.origin ? ` (${single.origin})` : ""}
          </p>
          <p className="text-[11px] text-gray-400 mt-3 text-center">
            Registre medições adicionais para visualizar a linha de tendência
            comparativa.
          </p>
        </div>
      </div>
    );
  }

  // Chart dimensions
  const width = 800;
  const height = 300;
  const padding = 40;

  const weights = sortedData.map((d) => d.weight);
  const minWeight = Math.min(...weights) - 1.5;
  const maxWeight = Math.max(...weights) + 1.5;
  const weightRange = maxWeight - minWeight || 1;

  const points = sortedData.map((d, i) => {
    const x =
      padding + (i * (width - 2 * padding)) / (sortedData.length - 1 || 1);
    const y =
      height -
      padding -
      ((d.weight - minWeight) * (height - 2 * padding)) / weightRange;
    return { x, y, weight: d.weight, date: d.date };
  });

  const linePath = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");

  const areaPath = `${linePath} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`;

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
        <h3 className="font-bold text-gray-800 dark:text-white flex items-center gap-2">
          <span className="text-blue-500">📈</span> Evolução do Peso (kg)
        </h3>

        {/* Range filter buttons */}
        <div className="flex items-center gap-1.5 bg-gray-100 dark:bg-gray-700/50 p-1 rounded-xl">
          <button
            onClick={() => setFilter("recent10")}
            className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
              filter === "recent10"
                ? "bg-white dark:bg-gray-800 text-blue-600 shadow-xs"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Últimas 10
          </button>
          <button
            onClick={() => setFilter("last90d")}
            className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
              filter === "last90d"
                ? "bg-white dark:bg-gray-800 text-blue-600 shadow-xs"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            90 Dias
          </button>
          <button
            onClick={() => setFilter("all")}
            className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
              filter === "all"
                ? "bg-white dark:bg-gray-800 text-blue-600 shadow-xs"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Todos ({data.length})
          </button>
        </div>
      </div>

      <div className="relative h-[300px] w-full">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full overflow-visible"
        >
          {/* Grid lines */}
          {[0, 1, 2, 3, 4].map((i) => {
            const y = padding + (i * (height - 2 * padding)) / 4;
            const labelWeight = maxWeight - (i * weightRange) / 4;
            return (
              <g key={i}>
                <line
                  x1={padding}
                  y1={y}
                  x2={width - padding}
                  y2={y}
                  stroke="currentColor"
                  className="text-gray-100 dark:text-gray-700"
                  strokeDasharray="4"
                />
                <text
                  x={padding - 10}
                  y={y + 4}
                  textAnchor="end"
                  className="text-[11px] fill-gray-400 font-bold"
                >
                  {labelWeight.toFixed(1)}
                </text>
              </g>
            );
          })}

          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Area */}
          <path d={areaPath} fill="url(#chartGradient)" />

          {/* Line */}
          <path
            d={linePath}
            fill="none"
            stroke="#3B82F6"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Points */}
          {points.map((p, i) => (
            <g key={i} className="group">
              <circle
                cx={p.x}
                cy={p.y}
                r="5"
                fill="#3B82F6"
                className="stroke-white dark:stroke-gray-800 stroke-2"
              />
              <circle
                cx={p.x}
                cy={p.y}
                r="14"
                fill="#3B82F6"
                className="opacity-0 group-hover:opacity-20 transition-opacity cursor-pointer"
              />

              {/* Tooltip on hover */}
              <text
                x={p.x}
                y={p.y - 12}
                textAnchor="middle"
                className="text-[11px] font-black fill-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                {p.weight.toFixed(1)}kg
              </text>

              {/* Date Label */}
              <text
                x={p.x}
                y={height - padding + 20}
                textAnchor="middle"
                className="text-[9px] fill-gray-400 font-bold uppercase"
              >
                {formatCivilDate(p.date.split("T")[0]).slice(0, 5)}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
};

export default WeightEvolutionChart;
