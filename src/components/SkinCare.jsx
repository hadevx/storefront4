import DROP from "/video.mp4";
import React from "react";

const Third = () => {
  return (
    <section className="relative w-full h-screen overflow-hidden">
      {/* Background Video */}
      <video
        src={DROP}
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-black/50" />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
        <h1 className="text-white font-light tracking-wide text-4xl md:text-6xl lg:text-7xl mb-4">
          Pure Skin. Real Glow.
        </h1>

        <p className="text-white/90 max-w-xl text-base md:text-lg mb-8">
          Luxury skincare crafted with clean ingredients and real results
        </p>

        <button className="bg-white text-black px-8 py-3 rounded-full text-sm tracking-widest hover:bg-white/90 transition">
          SHOP NOW
        </button>
      </div>
    </section>
  );
};

export default Third;
