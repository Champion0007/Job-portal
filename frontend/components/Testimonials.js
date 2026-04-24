"use client";
import React, { useEffect, useRef, useState } from "react";

const TESTIMONIALS = [
  {
    id: 1,
    quote:
      'JobPortal helped me find a role that matched my skills and work style. The recommended jobs were spot on and the application process was seamless.',
    name: 'Jordan Lee',
    title: 'Frontend Engineer, Acme Co',
  },
  {
    id: 2,
    quote:
      'As a hiring manager, JobPortal made it easy to discover qualified candidates quickly — the applicant flow and employer tools saved our team hours.',
    name: 'Priya Shah',
    title: 'Head of Talent, Innovate Labs',
  },
  {
    id: 3,
    quote:
      'The platform is thoughtful and fast. I love the daily recommendations and the one-click apply feature — it got me interviews in a week.',
    name: 'Carlos Mendes',
    title: 'Product Designer, BrightStudio',
  },
];

function usePrefersReducedMotion() {
  if (typeof window === 'undefined') return false;
  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch (e) {
    return false;
  }
}

export default function Testimonials({ autoPlay = true, interval = 5000 }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const prefersReduced = usePrefersReducedMotion();
  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;
    return () => (mounted.current = false);
  }, []);

  useEffect(() => {
    if (!autoPlay || prefersReduced) return undefined;
    if (paused) return undefined;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % TESTIMONIALS.length);
    }, interval);
    return () => clearInterval(id);
  }, [autoPlay, interval, paused, prefersReduced]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowLeft') setIndex((i) => (i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
      if (e.key === 'ArrowRight') setIndex((i) => (i + 1) % TESTIMONIALS.length);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const goTo = (i) => setIndex(((i % TESTIMONIALS.length) + TESTIMONIALS.length) % TESTIMONIALS.length);
  const prev = () => setIndex((i) => (i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  const next = () => setIndex((i) => (i + 1) % TESTIMONIALS.length);

  return (
    <section
      aria-label="User testimonials"
      className="relative bg-white border rounded-lg p-6 shadow-sm"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-gray-800">What people say</h3>
        <div className="flex items-center gap-2">
          <button
            aria-label="Previous testimonial"
            onClick={prev}
            className="p-2 rounded hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-200"
          >
            ‹
          </button>
          <button
            aria-label="Next testimonial"
            onClick={next}
            className="p-2 rounded hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-200"
          >
            ›
          </button>
        </div>
      </div>

      <div className="overflow-hidden">
        {TESTIMONIALS.map((t, i) => (
          <div
            key={t.id}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${TESTIMONIALS.length}`}
            className={`transition-transform duration-500 ease-in-out ${
              i === index ? 'translate-x-0 block' : i < index ? '-translate-x-full hidden md:block' : 'translate-x-full hidden md:block'
            }`}
          >
            {i === index && (
              <div className="animate-fade-up">
                <blockquote className="text-lg text-gray-800 italic">“{t.quote}”</blockquote>
                <div className="mt-4 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-900 font-semibold">{t.name
                    .split(' ')
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join('')}</div>
                  <div>
                    <div className="font-semibold text-gray-800">{t.name}</div>
                    <div className="text-sm text-gray-500">{t.title}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-center gap-2" role="tablist" aria-label="Select testimonial">
        {TESTIMONIALS.map((_, i) => (
          <button
            key={i}
            aria-label={`Go to testimonial ${i + 1}`}
            aria-selected={i === index}
            role="tab"
            onClick={() => goTo(i)}
            className={`h-2 w-8 rounded-full ${i === index ? 'bg-indigo-700' : 'bg-gray-200'} focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-200`}
          />
        ))}
      </div>
    </section>
  );
}
