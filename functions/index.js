const admin = require('firebase-admin');
const functions = require('firebase-functions');

admin.initializeApp();

const db = admin.firestore();

exports.handleSuccessfulPayments = functions.firestore
  .document('customers/{customerId}/payments/{paymentId}')
  .onWrite((change, _context) => {
    const data = change.after.data();

    if (data.status !== 'succeeded') {
      return;
    }

    const metadata = data.metadata;

    if (!metadata.reservationId) {
      return;
    }

    return db.doc(`reservations/${metadata.reservationId}`).update({
      paid: true,
    });
  });
