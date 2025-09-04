'use client'

import  { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

const CarouselComponent = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "Bộ Sưu Tập Mới",
      description: "Phong Cách - Đẳng Cấp - Sang Trọng",
      image:
        "https://images.pexels.com/photos/307847/pexels-photo-307847.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    {
      title: "Bộ Sưu tập Thu Đông 2024",
      description: "Bộ sưu tập thời trang thu đông 2024",
      image:
        "https://images.pexels.com/photos/242829/pexels-photo-242829.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    {
      title: "Bộ Sưu Tập Xuân Hè 2024",
      description: "Bộ sưu tập thời trang xuân hè 2024",
      image:
        "https://images.pexels.com/photos/794432/pexels-photo-794432.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full mx-auto h-96">
      {/* Main carousel container */}
      <div className="relative h-full overflow-hidden rounded-lg">
        {/* Slides */}
        <div
          className="flex h-full transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {slides.map((slide, index) => (
            <div
              key={index}
              className="relative flex flex-col items-center justify-center flex-shrink-0 w-full h-full"
            >
              <img
                src={slide.image}
                alt={slide.title}
                className="absolute inset-0 object-cover w-full h-full"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40" />
              <div className="relative z-10 p-8 text-center text-white">
                <h2 className="mb-4 text-3xl font-bold">{slide.title}</h2>
                <p className="mb-4 text-lg">{slide.description}</p>
                <Link href="/collection" >
                <button className="px-8 py-3 text-black transition duration-300 bg-white hover:bg-black hover:text-white">
                  KHÁM PHÁ NGAY
                </button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation buttons */}
        <button
          onClick={prevSlide}
          className="absolute p-2 transition-all -translate-y-1/2 bg-white rounded-full left-4 top-1/2 bg-opacity-30 hover:bg-opacity-50"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute p-2 transition-all -translate-y-1/2 bg-white rounded-full right-4 top-1/2 bg-opacity-30 hover:bg-opacity-50"
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>

        {/* Indicators */}
        <div className="absolute flex space-x-2 -translate-x-1/2 bottom-4 left-1/2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                currentSlide === index
                  ? "bg-white w-4"
                  : "bg-white bg-opacity-50"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CarouselComponent;
