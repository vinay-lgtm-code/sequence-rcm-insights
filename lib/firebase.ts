import * as admin from "firebase-admin";

// Initialize Firebase Admin SDK
function getFirebaseAdmin() {
  if (admin.apps.length > 0) {
    return admin.app();
  }

  const projectId = process.env.GCP_PROJECT_ID;
  const clientEmail = process.env.GCP_CLIENT_EMAIL;
  const privateKey = process.env.GCP_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!projectId || !clientEmail || !privateKey) {
    console.warn("Firebase credentials not configured - email storage disabled");
    return null;
  }

  return admin.initializeApp({
    credential: admin.credential.cert({
      projectId,
      clientEmail,
      privateKey,
    }),
  });
}

export interface SubscriberData {
  email: string;
  source: "analysis" | "subscribe";
  createdAt: Date;
  analysisCount?: number;
  lastAnalysisAt?: Date;
  metadata?: Record<string, unknown>;
}

export async function saveSubscriber(data: SubscriberData): Promise<void> {
  const app = getFirebaseAdmin();
  if (!app) {
    console.log("Firebase not configured - skipping subscriber save");
    return;
  }

  try {
    const db = admin.firestore();
    const subscribersRef = db.collection("subscribers");

    // Check if email already exists
    const existing = await subscribersRef.where("email", "==", data.email).get();

    if (existing.empty) {
      // Create new subscriber
      await subscribersRef.add({
        ...data,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        analysisCount: 1,
        lastAnalysisAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    } else {
      // Update existing subscriber
      const doc = existing.docs[0];
      await doc.ref.update({
        analysisCount: admin.firestore.FieldValue.increment(1),
        lastAnalysisAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }
  } catch (error) {
    console.error("Failed to save subscriber:", error);
    // Don't throw - this is non-critical
  }
}

export async function logAnalysis(data: {
  email: string;
  claimCount: number;
  metrics: {
    denialRate: number;
    daysInAR: number;
    cleanClaimRate: number;
    collectionRate: number;
  };
}): Promise<void> {
  const app = getFirebaseAdmin();
  if (!app) {
    return;
  }

  try {
    const db = admin.firestore();
    await db.collection("analyses").add({
      ...data,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  } catch (error) {
    console.error("Failed to log analysis:", error);
  }
}
