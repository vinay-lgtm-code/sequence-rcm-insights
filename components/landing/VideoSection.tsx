"use client";

import { useState } from "react";
import { Play } from "lucide-react";

export function VideoSection() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <section id="video" className="py-24 bg-gray-50">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-12">
          <h2 className="text-3xl font-semibold tracking-tight text-navy-500">
            See It in Action
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            Watch how Sequence transforms your claims data into actionable insights.
          </p>
        </div>

        <div className="mx-auto max-w-3xl">
          <div className="relative aspect-video overflow-hidden rounded-2xl bg-navy-500 shadow-xl">
            {!isPlaying ? (
              /* Video placeholder */
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-navy-500 to-navy-600">
                {/* Logo */}
                <div className="absolute top-6 left-6">
                  <span className="text-xl font-semibold text-white/90">Sequence</span>
                </div>

                {/* Play button */}
                <button
                  onClick={() => setIsPlaying(true)}
                  className="flex h-20 w-20 items-center justify-center rounded-full bg-white text-navy-500 shadow-lg transition-transform hover:scale-105"
                >
                  <Play className="h-8 w-8 ml-1" fill="currentColor" />
                </button>

                {/* Duration */}
                <div className="absolute bottom-6 right-6 rounded-full bg-white/10 px-3 py-1 text-sm text-white/80 backdrop-blur-sm">
                  1:00
                </div>
              </div>
            ) : (
              /* Video player */
              <video
                className="h-full w-full"
                controls
                autoPlay
                src="/videos/sequence-intro.mp4"
              >
                Your browser does not support the video tag.
              </video>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
