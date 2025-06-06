"use server";
import { pppCoupons } from '@/data/pppCoupons';
import { headers } from 'next/headers';

const COUNTRY_HEADER_KEY = 'x-user-country';

export async function getUserCoupon() {
  const h = await headers();
  const country = h.get(COUNTRY_HEADER_KEY);
  if (!country) return null;
  return pppCoupons.find(coupon => coupon.countryCodes.includes(country)) ?? null;
} 