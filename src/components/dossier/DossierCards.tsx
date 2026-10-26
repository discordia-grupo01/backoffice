import type { ReactNode } from "react";

import { formatDateTime } from "@/utils/formatDate";
import type {
  DossierModerationAction,
  DossierModerationKind,
  DossierReport,
} from "@/types/dossier.types";

export function DossierCardList({ children }: { children: ReactNode }) {
  return <ul className="space-y-2">{children}</ul>;
}

export function DossierCard({ children }: { children: ReactNode }) {
  return (
    <li className="border-line bg-surface-input flex items-center gap-3 rounded-xl border px-4 py-3">
      {children}
    </li>
  );
}

export function DossierDatedText({
  text,
  date,
}: {
  text: string;
  date: string;
}) {
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

export function ReportCards({ items }: { items: DossierReport[] }) {
  return (
    <DossierCardList>
      {items.map((report) => (
        <DossierCard key={report.id}>
          <DossierDatedText text={report.reason} date={report.created_at} />
        </DossierCard>
      ))}
    </DossierCardList>
  );
}

const MODERATION_LABEL: Record<DossierModerationKind, string> = {
  suspension: "Suspensión",
  reactivation: "Reactivación",
};

export function ModerationCards({
  items,
}: {
  items: DossierModerationAction[];
}) {
  return (
    <DossierCardList>
      {items.map((action) => (
        <DossierCard key={action.id}>
          <DossierDatedText
            text={MODERATION_LABEL[action.kind]}
            date={action.applied_at}
          />
        </DossierCard>
      ))}
    </DossierCardList>
  );
}
