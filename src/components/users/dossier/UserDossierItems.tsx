import type { ReactNode } from "react";

import { Avatar } from "@/components/ui/Avatar";
import { formatDateTime } from "@/utils/formatDate";
import type {
  DossierModerationKind,
  DossierSection,
  DossierSectionItems,
} from "@/types/users.types";

export const DOSSIER_SECTIONS: Record<
  DossierSection,
  { title: string; empty: string }
> = {
  servers: {
    title: "Servidores",
    empty: "No pertenece a ningún servidor.",
  },
  activity: {
    title: "Actividad reciente",
    empty: "No tiene actividad reciente.",
  },
  reports: {
    title: "Reportes recibidos",
    empty: "No recibió reportes.",
  },
  moderation: {
    title: "Acciones de moderación",
    empty: "No tiene acciones de moderación aplicadas.",
  },
};

export const DOSSIER_SECTION_ORDER = Object.keys(
  DOSSIER_SECTIONS,
) as DossierSection[];

const MODERATION_LABEL: Record<DossierModerationKind, string> = {
  suspension: "Suspensión",
  reactivation: "Reactivación",
};

export type DossierItemsProps = {
  [S in DossierSection]: { section: S; items: DossierSectionItems[S][] };
}[DossierSection];

export function DossierItems(props: DossierItemsProps) {
  return <ul className="space-y-2">{renderRows(props)}</ul>;
}

function renderRows({ section, items }: DossierItemsProps) {
  switch (section) {
    case "servers":
      return items.map((membership) => (
        <Row key={membership.server_id}>
          <Avatar
            name={membership.server_name}
            size={28}
            className="rounded-lg"
          />
          <p className="min-w-0 flex-1 truncate text-sm">
            {membership.server_name}
          </p>
        </Row>
      ));
    case "activity":
      return items.map((item) => (
        <Row key={item.id}>
          <Dated text={item.description} date={item.occurred_at} />
        </Row>
      ));
    case "reports":
      return items.map((report) => (
        <Row key={report.id}>
          <Dated text={report.reason} date={report.created_at} />
        </Row>
      ));
    case "moderation":
      return items.map((action) => (
        <Row key={action.id}>
          <Dated
            text={MODERATION_LABEL[action.kind]}
            date={action.applied_at}
          />
        </Row>
      ));
  }
}

function Row({ children }: { children: ReactNode }) {
  return (
    <li className="border-line bg-surface-input flex items-center gap-3 rounded-xl border px-4 py-3">
      {children}
    </li>
  );
}

function Dated({ text, date }: { text: string; date: string }) {
  return (
    <div className="min-w-0 flex-1">
      <p className="text-sm">{text}</p>
      <time
        dateTime={date}
        className="text-content-muted mt-0.5 block text-xs tabular-nums"
      >
        {formatDateTime(date)}
      </time>
    </div>
  );
}
