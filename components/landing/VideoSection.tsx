"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";

export function VideoSection() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <section id="video" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-navy-500 sm:text-4xl">
            See Sequence in Action
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Watch how Sequence transforms your claims data into actionable insights
            in just 60 seconds.
          </p>
        </div>

        <div className="mx-auto max-w-4xl">
          <div className="relative aspect-video overflow-hidden rounded-xl bg-navy-500 shadow-xl">
            {!isPlaying ? (
              /* Video placeholder/thumbnail */
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-navy-500 to-primary-600">
                {/* Animated background pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-1/4 left-1/4 h-32 w-32 animate-pulse rounded-full bg-white" />
                  <div className="absolute top-1/2 right-1/4 h-24 w-24 animate-pulse rounded-full bg-teal-400" style={{ animationDelay: "0.5s" }} />
                  <div className="absolute bottom-1/4 left-1/3 h-20 w-20 animate-pulse rounded-full bg-primary-400" style={{ animationDelay: "1s" }} />
                </div>

                {/* Logo text */}
                <div className="absolute top-8 left-8">
                  <span className="text-2xl font-bold text-white">Sequence</span>
                </div>

                {/* Play button */}
                <Button
                  size="xl"
                  onClick={() => setIsPlaying(true)}
                  className="relative z-10 bg-white text-navy-500 hover:bg-gray-100 rounded-full h-20 w-20 p-0"
                >
                  <Play className="h-10 w-10 ml-1" fill="currentColor" />
                </Button>

                {/* Duration badge */}
                <div className="absolute bottom-8 right-8 rounded-full bg-white/20 px-3 py-1 text-sm text-white backdrop-blur">
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

          {/* Video features */}
          <div className="mt-8 grid grid-cols-3 gap-4 text-center text-sm text-gray-600">
            <div>
              <p className="font-semibold text-navy-500">Upload</p>
              <p>Drag & drop your Excel file</p>
            </div>
            <div>
              <p className="font-semibold text-navy-500">Analyze</p>
              <p>AI processes in seconds</p>
            </div>
            <div>
              <p className="font-semibold text-navy-500">Act</p>
              <p>Get specific recommendations</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
