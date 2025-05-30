'use server';

import { stripeServerClient } from '@/services/stripe/stripeServer';
import { canRefundPurchases } from '../permissions/products';
import { getCurrentUser } from '@/services/clerk';
import { database } from '@/drizzle/db';
import { updatePurchase } from '../db/purchases';
import { revokeUserCourseAccess } from '@/features/courses/db/userCourseAccess';

export async function refundPurchase(id: string) {
    if (!canRefundPurchases(await getCurrentUser())) {
        return {
            error: true,
            message: 'There was an error refunding this purchase',
        };
    }

    const data = await database.transaction(async (trx) => {
        const refundedPurchase = await updatePurchase(
            id,
            { refundedAt: new Date() },
            trx,
        );

        const session = await stripeServerClient.checkout.sessions.retrieve(
            refundedPurchase.stripeSessionId,
        );

        if (session.payment_intent == null) {
            trx.rollback();
            return {
                error: true,
                message: 'There was an error refunding this purchase',
            };
        }

        try {
            await stripeServerClient.refunds.create({
                payment_intent:
                    typeof session.payment_intent === 'string'
                        ? session.payment_intent
                        : session.payment_intent.id,
            });
            await revokeUserCourseAccess(refundedPurchase, trx);
        } catch {
            trx.rollback();
            return {
                error: true,
                message: 'There was an error refunding this purchase',
            };
        }
    });

    return data ?? { error: false, message: 'Successfully refunded purchase' };
}
