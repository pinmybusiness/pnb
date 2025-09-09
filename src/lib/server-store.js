// lib/server-store.js
import { makeStore } from '@/store';

export async function createServerStore() {
  const store = makeStore();
  
  // You can dispatch actions here to initialize state from server data
  // For example, if you need to preload some data
  
  return store;
}

export function getServerState(store) {
  return store.getState();
}