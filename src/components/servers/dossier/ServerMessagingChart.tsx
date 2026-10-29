import { DossierEmpty } from "@/components/dossier/DossierOverview";
import { TimeBarChart } from "@/components/ui/TimeBarChart";
import { formatInteger, formatSeriesTooltipLabel } from "@/utils/chartFormat";
import type { ServerMessagingDay } from "@/types/servers.types";

export function ServerMessagingChart({ days }: { days: ServerMessagingDay[] }) {
  if (days.every((day) => day.messages === 0)) {
    return <DossierEmpty>No hubo mensajes en los últimos 7 días.</DossierEmpty>;
  }

  return (
    <div className="border-line bg-surface-input rounded-xl border px-2 pt-3 pb-1">
      <div aria-hidden="true" className="h-48">
        <TimeBarChart
          data={days}
          dataKey="messages"
          granularity="day"
          valueLabel="mensajes"
          colorVar="--success"
        />
      </div>
      <div className="sr-only">
        <table>
          <caption>Mensajes por día en los últimos 7 días</caption>
          <thead>
            <tr>
              <th scope="col">Día</th>
              <th scope="col">Mensajes</th>
            </tr>
          </thead>
          <tbody>
            {days.map((day) => (
              <tr key={day.date}>
                <td>{formatSeriesTooltipLabel(day.date, "day")}</td>
                <td>{formatInteger(day.messages)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
