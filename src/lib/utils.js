// lib/utils.js
import { ROLE_MAPPING } from "./constants";

export const getFrontendPanel = (numericRole) => {
  return ROLE_MAPPING[numericRole] || 'default';
};

export const formatMobile = (mobile) => {
  return mobile.replace(/\D/g, '');
};