import { resolve as pathResolve } from 'path';
import { dev } from '$app/env';
import { cert, initializeApp, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import type { RequestHandler } from '@sveltejs/kit';

export const post: RequestHandler = async ({ request }) => {
  if (!dev) {
    return {
      status: 400,
    };
  }

  const auth = getAuth();
  const data = await request.formData();

  const uid = String(data.get('uid'));

  if (!uid) {
    return {
      status: 400,
    };
  }

  const credential = cert(pathResolve('src', 'firebase-admin.json'));

  const apps = getApps();

  if (apps.length === 0) {
    initializeApp({
      credential,
    });
  }

  await auth.setCustomUserClaims(uid, { admin: true });

  return {
    status: 200,
    body: 'ok',
  };
};
