// src/constants/branchStatus.js

export const BRANCH_STATUS = {
  TRIAL: 1,
  ONBOARDING: 2,
  ACTIVE: 3,
  CLOSED: 4
};

export const STATUS_OPTIONS = [
  { value: 1, label: 'Trial' },
  { value: 2, label: 'Onboarding' },
  { value: 3, label: 'Active' },
  { value: 4, label: 'Closed' }
];

export const STATUS_REASON_MAP = {
  1: [
    { value: 101, label: 'Trial Active' },
    { value: 102, label: 'Trial Expired' }
  ],
  2: [
    { value: 201, label: 'Details Pending' },
    { value: 202, label: 'Documents Pending' },
    { value: 203, label: 'Under Review' },
    { value: 204, label: 'Approval Pending' },
    { value: 205, label: 'Payment Pending' }
  ],
  3: [
    { value: 301, label: 'Subscription Active' }
  ],
  4: [
    { value: 401, label: 'Not Converted' },
    { value: 402, label: 'Non Payment' },
    { value: 403, label: 'Subscription Ended' },
    { value: 404, label: 'Violation' }
  ]
};

export const getStatusLabel = (status) => {
  return STATUS_OPTIONS.find(s => s.value === status)?.label || 'Unknown';
};

export const getReasonLabel = (reason) => {
  for (const key in STATUS_REASON_MAP) {
    const found = STATUS_REASON_MAP[key].find(r => r.value === reason);
    if (found) return found.label;
  }
  return '';
};