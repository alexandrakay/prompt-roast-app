import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';
import type { RoastDocument } from './types';

export async function getRoast(id: string): Promise<RoastDocument | null> {
  const snap = await getDoc(doc(db, 'roasts', id));
  if (!snap.exists()) return null;
  const data = snap.data();
  return {
    id: snap.id,
    userId: data.userId ?? null,
    originalPrompt: data.originalPrompt,
    roast: data.roast,
    charges: data.charges,
    fixed: data.fixed,
    createdAt: data.createdAt?.toMillis?.() ?? data.createdAt ?? 0,
  };
}
