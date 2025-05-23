import { env } from './env/server';

export const pppCoupons = [
    {
        stripeCouponId: env.STRIPE_PPP_50_COUPON_ID,
        discountPercentage: 0.5,
        countryCodes: [
            'AF',
            'EG',
            'IR',
            'KG',
            'LK',
            'BT',
            'LA',
            'LB',
            'MY',
            'MM',
            'NP',
            'PK',
            'SD',
            'TJ',
            'UZ',
            'SY',
        ],
    },
    {
        stripeCouponId: env.STRIPE_PPP_20_COUPON_ID,
        discountPercentage: 0.2,
        countryCodes: ['AT', 'JP', 'BE', 'BS', 'DE', 'KI', 'KW', 'BZ', 'MT'],
    },
];
