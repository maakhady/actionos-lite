const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

async function requete<T>(chemin: string, options?: RequestInit): Promise<T> {
  const reponse = await fetch(`${BASE}${chemin}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  if (!reponse.ok) {
    const corps = await reponse.json().catch(() => null);
    throw new Error(messageErreur(corps) ?? `Erreur ${reponse.status}`);
  }

  return reponse.status === 204 ? (undefined as T) : reponse.json();
}

function messageErreur(corps: unknown): string | null {
  if (!corps || typeof corps !== 'object') return null;
  const message = (corps as { message?: string | string[] }).message;
  if (Array.isArray(message)) return message.join(' · ');
  return message ?? null;
}

export const api = {
  get: <T>(chemin: string) => requete<T>(chemin),
  post: <T>(chemin: string, corps: unknown) =>
    requete<T>(chemin, { method: 'POST', body: JSON.stringify(corps) }),
  patch: <T>(chemin: string, corps: unknown) =>
    requete<T>(chemin, { method: 'PATCH', body: JSON.stringify(corps) }),
  delete: <T>(chemin: string) => requete<T>(chemin, { method: 'DELETE' }),
};
