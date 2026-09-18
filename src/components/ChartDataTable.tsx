import React from "react";
import { useTranslation } from "react-i18next";

/**
 * Text alternative for a chart: a native disclosure (<details>) with the data
 * the chart plots. Keyboard and screen-reader friendly without extra script;
 * the chart graphic itself should be marked aria-hidden.
 */
export const ChartDataTable: React.FC<{
  caption: string;
  columns: string[];
  rows: Array<Array<React.ReactNode>>;
  className?: string;
}> = ({ caption, columns, rows, className }) => {
  const { t } = useTranslation();
  return (
    <details className={`mt-3 text-sm ${className ?? ""}`}>
      <summary className="cursor-pointer select-none rounded-lg px-1 py-0.5 text-xs font-semibold text-slate-600 hover:text-slate-800 dark:text-slate-300">
        {t("a11y.show_data_table")}
      </summary>
      <div className="mt-2 overflow-x-auto">
        <table className="min-w-full text-left text-xs">
          <caption className="sr-only">{caption}</caption>
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-700">
              {columns.map((c) => (
                <th
                  key={c}
                  scope="col"
                  className="px-2 py-1.5 font-bold text-slate-600 dark:text-slate-300"
                >
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr
                key={i}
                className="border-b border-slate-100 last:border-0 dark:border-slate-800"
              >
                {row.map((cell, j) =>
                  j === 0 ? (
                    <th
                      key={j}
                      scope="row"
                      className="px-2 py-1.5 font-semibold text-slate-700 dark:text-slate-200"
                    >
                      {cell}
                    </th>
                  ) : (
                    <td
                      key={j}
                      className="px-2 py-1.5 text-slate-700 dark:text-slate-200"
                    >
                      {cell}
                    </td>
                  ),
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </details>
  );
};

export default ChartDataTable;
