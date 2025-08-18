'use client'; // Required for hooks

import { useEffect, useState } from 'react';
import api from '../lib/api';
import HeroSection from '@/components/HeroSection';
import Header from '@/components/Header';


export default function Home() {


  return (
    <main className="min-h-screen">
     <Header activeLink="/" />
     <HeroSection />
    </main>
  );
}