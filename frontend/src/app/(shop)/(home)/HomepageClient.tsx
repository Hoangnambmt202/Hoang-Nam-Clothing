"use client";

import React, { useState } from "react";

// Types
interface Product {
  id: number;
  name: string;
  price: string;
}

const HomePageClient: React.FC = () => {
  const [email, setEmail] = useState<string>("");

  const products: Product[] = [
    { id: 1, name: "Over-sized Wool Trench", price: "$890.00" },
    { id: 2, name: "Silk Slip Dress in Sand", price: "$450.00" },
  ];

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Subscribed with email:", email);
    setEmail("");
  };

  return (
    <>
      <section className="relative h-screen w-full overflow-hidden flex flex-col justify-end items-start">
        <div
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{
            backgroundImage:
              'url("https://lh3.googleusercontent.com/aida-public/AB6AXuB8EdxDiB40ACJk03s1JfRk5RnIyBfdPKa7r1HQEtDRTMIASzKSlbVe13LUx1xf-TiRLPdw50rH8o1bwkKHQugriYgALeu_KxK7exLAh4PPbp8dqQKTyJLsX4vP_wNswN0KI5lOBfvG9i3kem79LV8HKhI77IPUaZoYml2LCFpfHJ44fefZz8TdO3-3RjuCBwloGTH-dWhPMuDx0KDE3P-qyDcvrfhOA-TULAllqn2Y-MFU4hcDrtF1hOGb4WenSJUh9JLFXtpGXb8")',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/40"></div>
        </div>

        <div className="relative z-10 w-full px-6 pb-16 lg:px-24 lg:pb-24 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-white/80 text-sm uppercase tracking-[0.3em] font-medium mb-2">
              The New Collection
            </p>
            <h1 className="text-white text-6xl lg:text-9xl font-['Playfair_Display',serif] italic font-light leading-tight tracking-tighter">
              Autumn's Silence
            </h1>
          </div>

          <div className="flex flex-col gap-8 items-start">
            <a
              className="group relative flex flex-col items-start gap-2"
              href="#"
            >
              <span className="text-white text-lg tracking-wide group-hover:text-[#195de6] transition-colors">
                Explore Chapter 1
              </span>
              <div className="w-full h-px bg-white group-hover:bg-[#195de6] transition-all duration-300"></div>
            </a>

            <div className="flex items-center gap-4">
              <span className="text-white text-sm font-bold tracking-widest">
                01
              </span>
              <div className="w-12 h-[1px] bg-white/30 relative">
                <div className="absolute left-0 top-0 h-full w-1/4 bg-[#195de6]"></div>
              </div>
              <span className="text-white/40 text-sm font-bold tracking-widest">
                04
              </span>
            </div>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 hidden lg:flex flex-col items-center gap-2">
          <span className="text-white/60 text-[10px] uppercase tracking-[0.4em] rotate-90 mb-4 origin-center">
            Scroll
          </span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-white to-transparent"></div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-32 px-6 lg:px-24 bg-white">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 relative">
            <img
              alt="High fashion editorial portrait"
              className="w-full h-[80vh] object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuC57GmUnZiUinS1rRPGFJAbTRdoCji6FrQhcTjzHjBH-iKcj4n9x85TvtmKX9OTVFE65mI1By4EVcdUO7EtwLsz15Kgy41qwg-sAlInj5XwgTirJUqmC_kUzzj3ossH72KJe8YWaVEh8Lx7nlI6brsOKx0i67rkBGwHopLwZM-uxGmX0TPVS1M2UNUP3YnJ7sUfRrURqhUUlHst4lZBoOBqGVq4sfhc9tfJJiQ_eQNCqUP9S2zOkmb6duURNLowDyEG8Rj4DsGMdzQ"
            />
            <div className="absolute -bottom-12 -right-12 hidden lg:block w-64 h-80 bg-[#f6f6f8] dark:bg-[#111621] -z-10"></div>
          </div>

          <div className="lg:col-span-5 lg:pl-16 flex items-start gap-8">
            <div className="[writing-mode:vertical-rl] text-[#195de6] text-xs tracking-[0.5em] uppercase font-bold pt-4">
              Collection MMXIV
            </div>
            <div className="space-y-8">
              <h2 className="text-5xl lg:text-7xl font-['Playfair_Display',serif] italic leading-tight">
                The soul of the city is found in its stillness.
              </h2>
              <p className="text-[#4e6797] dark:text-gray-400 text-lg leading-relaxed max-w-sm">
                A narrative told through movement and fabric. Each piece is a
                verse in our seasonal poem of urban exploration.
              </p>
              <a
                className="inline-block text-sm font-bold tracking-widest uppercase border-b border-[#195de6] pb-2 hover:text-[#195de6] transition-colors"
                href="#"
              >
                Read the Journal
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Materials Section */}
      <section className="py-32 bg-[#f6f6f8] overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-24">
          <div className="mb-20">
            <span className="text-[#195de6] font-bold tracking-[0.3em] text-xs uppercase block mb-4">
              Tactile Excellence
            </span>
            <h2 className="text-4xl lg:text-6xl font-['Playfair_Display',serif]">
              Materials &amp; Craftsmanship
            </h2>
          </div>

          <div className="relative grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Material 1 */}
            <div className="group relative">
              <div className="overflow-hidden aspect-[3/4]">
                <img
                  alt="Close-up of premium linen"
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuD_OtHiS_W3P1pIwgEkQOFxsdCQbfPRwRYSAd3zIIg3iYiE1wqdFpSaupSh9EHESUFY0npem0jNEZjNfRKehXovp2VHitjwHF6g2e6oZdzD8BnlCG6uaOA_iDVyfhrcg-emNf4e2Sejax0wdcoUOBGmAp8F-m6FlqGVh88HATS70XffHX_3rixX772B-f4VHUC2k-9k3VI0FGlG7b6f3anpr0XVOJ4gtNOM9Pe2aD3f4wOPCBUcFR8NzOMN-T0O0xbIsywysTVCWr4"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 lg:-bottom-10 lg:-left-10 bg-white dark:bg-[#1a1f2b] p-8 shadow-xl max-w-[280px]">
                <h3 className="text-xl font-['Playfair_Display',serif] italic mb-2 text-white">
                  Sustainable Linen
                </h3>
                <p className="text-xs text-gray-500  leading-relaxed">
                  Sourced from the heart of Normandy, our linen offers a
                  breathable weight that ages with grace.
                </p>
              </div>
            </div>

            {/* Material 2 */}
            <div className="group relative mt-16 lg:mt-32">
              <div className="overflow-hidden aspect-[3/4]">
                <img
                  alt="Close-up of raw silk"
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDUnsSnWO5Jn7RPpgx49RJSVyhtcn87JXeaKrKXR5emcz5PrlyMuIyM1CdQjIIpmkg4dpIYiCBRoeOKkClfCF8hrLC2avIRY1G4S8zMRaxkSJ_yyVtaG9X536IdTMgXukTJeaELZzecWPQDY-vbbXU5yCiYUu2BusRpaAMwUQ7rut8BP77zK0-BA-cPx_8NgryaUQDzroqO3qJhdd8SJT_jz4sKjICLz8-CIvK84yyTat9ToYOqxIvaaINColDNT2Rv0ri9JlBAFx4"
                />
              </div>
              <div className="absolute -top-6 -right-6 lg:-top-10 lg:-right-10 bg-white dark:bg-[#1a1f2b] p-8 shadow-xl max-w-[280px] text-right">
                <h3 className="text-xl font-['Playfair_Display',serif] italic mb-2 text-white">
                  Raw Mulberry Silk
                </h3>
                <p className="text-xs text-gray-500  leading-relaxed">
                  Hand-woven fibers that catch the morning light, creating a
                  fluid silhouette that moves with you.
                </p>
              </div>
            </div>

            {/* Material 3 */}
            <div className="group relative">
              <div className="overflow-hidden aspect-[3/4]">
                <img
                  alt="Close-up of fine wool"
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuC67PESxgzktng9ZH19HsqhhSimZMvxzAzrPf3EdZfHgHzgZ425nmJef6FcoEY3mf92PdUH2V5UFKswGcm3_z5UEjeQsUQLE5gQQLAlEL8PgAxJZ09t2sA4_Rdf_uyc7jzQNCnJU17SrIFrTzH5FdSrg4BBA3HD7O6XkVurFOWJEuxIsPRXj4nw5uvLX-YWInLNk6ndXIyJvydW-TbFqYt4BTssgBwka_kHjNnLx2oRtt3M8V1mNzhyG7pH0Xmd8lywvM3RRouXr_4"
                />
              </div>
              <div className="absolute bottom-12 right-0 left-0 text-center pointer-events-none">
                <span className="text-[10rem] font-['Playfair_Display',serif] text-white/10 select-none">
                  T01
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Lookbook */}
      <section className="relative min-h-screen flex items-center bg-white py-24">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-24 w-full grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-4 order-2 lg:order-1">
            <span className="text-[#195de6] font-bold tracking-[0.3em] text-xs uppercase block mb-6">
              Interactive Lookbook
            </span>
            <h2 className="text-4xl lg:text-6xl font-['Playfair_Display',serif] mb-8 leading-tight">
              Shop in <br />
              <span className="italic">Style</span>
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-10 text-lg">
              Hover over the highlights to discover the individual pieces worn
              in this cinematic capture at Café Noir.
            </p>

            <div className="space-y-6">
              {products.map((product, index) => (
                <div
                  key={product.id}
                  className="flex items-center gap-4 group cursor-pointer border-b border-gray-100 dark:border-gray-800 pb-4"
                >
                  <span className="text-xs font-bold opacity-40">
                    0{index + 1}
                  </span>
                  <div className="flex-1">
                    <h4 className="font-['Playfair_Display',serif] text-lg">
                      {product.name}
                    </h4>
                    <p className="text-sm text-[#195de6]">{product.price}</p>
                  </div>
                  <span className="material-symbols-outlined opacity-0 group-hover:opacity-100 transition-opacity">
                    add
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-8 order-1 lg:order-2 relative">
            <div className="relative overflow-hidden rounded-sm">
              <img
                alt="Model in a Parisian café"
                className="w-full h-auto"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAAJbHSyyljcnB1JvuSmq_5OYBGF7Tlx09XoW_uDix_pU5TKCh0Wyhzqh9lTDL1zALFXhcEEdwEvRZGtNzfF2mIGUyngTUOyag-PwnJy5mhaCP0EzRpaDTKgtL_tWN-sdHkGceRL62H0GVL2HhsCn1mElMPGgkZr3VPcSSuwTHC_oNCZoJMLK3dmnEKC4fQ4rpPxcjnLtbcoM5544jP4u45-6slrgefOtULXR1_tN0uRJITAJUnIVq1KbktdirRwkgylPAk7pAz6tk"
              />

              {/* Hotspot 1 */}
              <div className="absolute top-[30%] left-[45%] group">
                <div className="relative flex items-center justify-center">
                  <div className="absolute w-10 h-10 bg-white/40 rounded-full animate-ping"></div>
                  <div className="relative w-4 h-4 bg-white rounded-full shadow-lg cursor-pointer border-2 border-[#195de6]"></div>
                </div>
                <div className="absolute left-6 top-1/2 -translate-y-1/2 bg-white text-black p-3 text-xs font-bold tracking-widest whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all shadow-xl">
                  WOOL TRENCH • SHOP
                </div>
              </div>

              {/* Hotspot 2 */}
              <div className="absolute top-[60%] left-[55%] group">
                <div className="relative flex items-center justify-center">
                  <div className="absolute w-10 h-10 bg-white/40 rounded-full animate-ping"></div>
                  <div className="relative w-4 h-4 bg-white rounded-full shadow-lg cursor-pointer border-2 border-[#195de6]"></div>
                </div>
                <div className="absolute left-6 top-1/2 -translate-y-1/2 bg-white text-black p-3 text-xs font-bold tracking-widest whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all shadow-xl">
                  SILK SLIP • SHOP
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-32 bg-[#f6f6f8] text-center border-t border-gray-100 ">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-4xl lg:text-6xl font-['Playfair_Display',serif] italic mb-10">
            End of Chapter 01
          </h2>
          <p className="text-lg text-gray-500 mb-12">
            Subscribe to be notified of Chapter 02: "The Awakening."
          </p>

          <form
            onSubmit={handleSubscribe}
            className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
          >
            <input
              className="flex-1 bg-transparent border-b border-black/20 dark:border-white/20 py-3 px-0 focus:outline-none focus:border-[#195de6] transition-colors text-sm font-bold tracking-widest uppercase"
              placeholder="YOUR EMAIL"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button
              className="text-sm font-bold tracking-[0.2em] uppercase hover:text-[#195de6] transition-colors"
              type="submit"
            >
              Join
            </button>
          </form>
        </div>
      </section>

      {/* Side Navigation Dots */}
      <div className="fixed right-8 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-6 z-40">
        <a
          className="w-2 h-2 rounded-full bg-[#195de6] ring-4 ring-[#195de6]/20"
          href="#"
        ></a>
        <a
          className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-600 hover:bg-[#195de6] transition-colors"
          href="#"
        ></a>
        <a
          className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-600 hover:bg-[#195de6] transition-colors"
          href="#"
        ></a>
        <a
          className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-600 hover:bg-[#195de6] transition-colors"
          href="#"
        ></a>
      </div>
    </>
  );
};

export default HomePageClient;
