"use client"
import Link from 'next/link';

export default function Content() {
  return (
    <div className="bg-[#232323] px-[2rem] py-[2rem] md:px-24 lg:min-h-[620px] md:min-h-[620px] w-full flex flex-col justify-between">
      <Section1 />
      <Section2 />
    </div>
  );
}

const Section1 = () => {
  return (
    <div>
      <Nav />
    </div>
  );
};

const Section2 = () => {
  return (
    <div className="flex flex-col md:flex-row lg:justify-between w-full text-[#DFDED9]">
      <h1 className="text-4xl md:text-[92px] sm:leading-relaxed max-sm:mt-6 lg:font-bold sm:font-semibold text-[#DFDED9] tracking-tighter max-sm:-tracking-normal text-left">
        <span className="block sm:inline">NEPOLIAN </span>{" "}
      </h1>
      <div className="flex flex-col md:items-end justify-end absolute bottom-4 right-4 md:static">
        <p className="text-sm max-sm:text-[12px] md:text-lg font-inter text-[#dfded999] text-right lg:mb-8 md:mb-8">
          Copyright © 2024 NEPOLIAN HAIR AND BEAUTY ACADEMY
        </p>
      </div>
    </div>
  );
};

const Nav = () => {
  return (
    <div className="flex flex-col sm:grid sm:grid-cols-2 lg:grid-cols-3 md:grid-cols-3 mt-4 md:mt-28 gap-1 md:gap-20 text-[#DFDED9]">
      <div className="grid grid-cols-2 max-sm:gap-32 sm:col-span-2 w-full md:mb-24 max-sm:px-2">
        <nav className="space-y-6 sm:space-y-8 md:space-y-8 mt-2 md:mt-[5rem]">
          <ul className="space-y-6 sm:space-y-8 md:space-y-6 text-xl md:text-xl font-inter">
            <li>
              <Link
                href="/"
                className="nav-link text-[#7B7B78] hover:text-[#DFDED9] block"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/products"
                className="nav-link text-[#7B7B78] hover:text-[#DFDED9] block"
              >
                Product
              </Link>
            </li>
            <li>
              <Link
                href="/cart"
                className="nav-link text-[#7B7B78] hover:text-[#DFDED9] block"
              >
                Cart
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="nav-link text-[#7B7B78] hover:text-[#DFDED9] block"
              >
                Contact
              </Link>
            </li>
          </ul>
        </nav>

        <nav className="space-y-6 sm:space-y-8 md:space-y-6 text-xl md:text-xl font-inter md:ml-[-3rem]">
          <ul className="space-y-6 sm:space-y-8 md:space-y-6 mt-2 md:mt-[5rem]">
            <li>
              <Link
                href="#"
                className="nav-link text-[#7B7B78] hover:text-[#DFDED9] block"
              >
                YouTube
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="nav-link text-[#7B7B78] hover:text-[#DFDED9] block"
              >
                Instagram
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="nav-link text-[#7B7B78] hover:text-[#DFDED9] block"
              >
                Tiktok
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      <div className="w-full h-[2px] mt-12 mb-12 lg:hidden md:hidden bg-[#818181]"></div>

      <div className="text-left lg:text-right md:text-right text-lg md:text-xl max-sm:text-2xl max-sm:mb-6 mt-2 md:mt-[5rem]">
        <address className="not-italic text-[#DFDED9]">
          Hetauda sub metropolitan city
          <br />
          Ward - 04
          <br />
          Hetauda
        </address>
      </div>

    </div>
  );
};
