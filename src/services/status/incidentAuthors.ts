import "server-only";

import { getUserDossier } from "@/services/users/service";
import type { IncidentAuthor, ResolvedIncident } from "@/types/status.types";

import type { RawIncident } from "./service";

async function findAuthor(token: string, id: string): Promise<IncidentAuthor> {
  const result = await getUserDossier(token, id);
  return result.ok
    ? { id, name: result.data.user.name, email: result.data.user.email }
    : { id, name: null, email: null };
}

/**
 * Cambia los ids de staff por su nombre de usuario y email. Metrics solo
 * guarda el id; los datos del usuario los tiene admin. Se pide una vez por
 * cada staff distinto de la página, que suelen ser uno o dos.
 */
export async function withIncidentAuthors(
  token: string,
  incidents: RawIncident[],
): Promise<ResolvedIncident[]> {
  const ids = [
    ...new Set(
      incidents.flatMap(({ created_by, resolved_by }) =>
        [created_by, resolved_by].filter((id): id is string => Boolean(id)),
      ),
    ),
  ];
  const authors = new Map(
    (await Promise.all(ids.map((id) => findAuthor(token, id)))).map(
      (author) => [author.id, author],
    ),
  );
  const authorOf = (id?: string) => (id ? (authors.get(id) ?? null) : null);

  return incidents.map((incident) => ({
    ...incident,
    created_by: authorOf(incident.created_by),
    resolved_by: authorOf(incident.resolved_by),
  }));
}
