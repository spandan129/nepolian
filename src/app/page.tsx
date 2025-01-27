"use client"
import Hero from './_components/hero';
import HaircutFinder from './_components/HaircutFinder';
import MarqueeText from './_components/MarqueeText';
import Reviews from './_components/Reviews';
import Content from './_components/Content';
import Services from './_components/Services';
import PlaneStack from './_components/PlaneStack';
import ScrollText from './_components/ScrollText';
import "@fontsource/syne";
import Navbar from './products/_components/Navbar';

import { useState } from 'react';

export default function Home() {
  const [openLogin, setOpenLogin] = useState(false);
  return (
    <>
     <Navbar open={openLogin} setOpen={setOpenLogin} />
      <Hero />
      <MarqueeText />
      <HaircutFinder />
      <Services />
      <PlaneStack />
      <ScrollText />
      <Reviews />
      <Content />
    </>
  );
}