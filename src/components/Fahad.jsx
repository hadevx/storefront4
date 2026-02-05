import React, { useEffect, useMemo, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const WORK_ITEMS = [
  {
    id: "product-hero",
    image:
      "https://moussamamadou.github.io/scroll-trigger-gsap-section/images/pexels-cottonbro-9430460_11zon.jpg",
    titleLines: ["NEW ARRIVAL", "AURA JACKET"],
    titleAccentIndex: 1,
    accentClass: "color-1",
    subLines: [
      "Water-resistant • Lightweight",
      "Minimal everyday outerwear",
      "Designed for city & travel",
      "Unisex fit • XS–XXL",
      "Free returns • 30 days",
    ],

    // ✅ videos removed
  },
];

function WorkItem({ item }) {
  return (
    <div className="work_item" data-work="item">
      <div className="work_image-wrapper">
        <img
          src={item.image}
          alt={item.id}
          className="work_image"
          data-work="image"
          loading="lazy"
        />
      </div>

      <div className="work_item-wrapper">
        {/* ✅ videos removed */}

        <div className="work_text">
          <div className="work_text-title">
            {item.titleLines.map((line, i) => {
              const isAccent = i === item.titleAccentIndex;
              return (
                <div className="line-wrapper" key={i}>
                  <div className="line" data-line>
                    {isAccent ? (
                      <>
                        <span className={item.accentClass}>{line.split(" ")[0]} </span>
                        {line.split(" ").slice(1).join(" ")}
                      </>
                    ) : (
                      line
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="work-text-subtitle">
            {item.subLines.map((t, i) => (
              <div className="line-wrapper" key={i}>
                <div className="line" data-line>
                  {t}
                </div>
              </div>
            ))}
          </div>

          <div className="work_ecom">
            <div className="work_price" data-line>
              {item.meta?.price}
            </div>

            <div className="work_actions">
              <button className="work_cta primary" type="button" data-line>
                {item.meta?.cta}
              </button>
              <button className="work_cta secondary" type="button" data-line>
                {item.meta?.secondary}
              </button>
            </div>

            <div className="work_trust">
              {item.meta?.trust?.map((x, i) => (
                <div className="work_trust-item" key={i} data-line>
                  {x}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="work_item-overlay" data-work="item-overlay"></div>
    </div>
  );
}

export default function ScrollTriggerGsapSectionReact_SingleEcom() {
  const sectionRef = useRef(null);
  const ghostCount = useMemo(() => WORK_ITEMS.length, []);

  useEffect(() => {
    const sectionEl = sectionRef.current;
    if (!sectionEl) return;

    const items = Array.from(sectionEl.querySelectorAll('[data-work="item"]'));
    const ghosts = Array.from(sectionEl.querySelectorAll('[data-ghost="item"]'));

    if (!items.length || ghosts.length !== items.length) return;

    gsap.set(items, {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      clipPath: "inset(100% 0 0% 0)",
    });

    const triggers = [];

    items.forEach((el, index) => {
      const ghost = ghosts[index];

      const lines = el.querySelectorAll("[data-line]");
      const workImage = el.querySelector('[data-work="image"]');
      const overlay = el.querySelector('[data-work="item-overlay"]');

      gsap.set(workImage, { scale: 1.4, yPercent: 10 });

      const stStarting = {
        trigger: ghost,
        scrub: true,
        start: "top bottom",
        end: "+=75vh top",
      };

      triggers.push(
        gsap.to(el, { clipPath: "inset(0% 0 0 0)", scrollTrigger: stStarting }).scrollTrigger,
      );

      triggers.push(
        gsap.to(workImage, { yPercent: 10, scale: 1.2, scrollTrigger: stStarting }).scrollTrigger,
      );

      triggers.push(
        gsap.from(lines, {
          yPercent: 125,
          rotate: 2.5,
          ease: "power2.inOut",
          duration: 1.25,
          scrollTrigger: {
            trigger: ghost,
            start: "top 75%",
            toggleActions: "play reverse restart reverse",
          },
        }).scrollTrigger,
      );

      triggers.push(
        gsap.to(workImage, {
          filter: "blur(10px)",
          opacity: 0.3,
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: ghost,
            scrub: true,
            start: "0 top",
            end: "35% top",
          },
        }).scrollTrigger,
      );

      const stFinal = {
        trigger: ghost,
        scrub: true,
        start: "105% bottom",
        toggleActions: "play reverse play reverse",
      };

      triggers.push(
        gsap.fromTo(overlay, { opacity: 0 }, { opacity: 1, scrollTrigger: stFinal }).scrollTrigger,
      );

      triggers.push(gsap.to(el, { filter: "blur(1px)", scrollTrigger: stFinal }).scrollTrigger);
    });

    ScrollTrigger.refresh();

    return () => {
      triggers.forEach((t) => t?.kill?.());
      ScrollTrigger.getAll().forEach((t) => t.kill());
      gsap.globalTimeline.clear();
    };
  }, []);

  return (
    <>
      {/* HERO */}
      <section className="hero_section sticky">
        <div className="hero_container">
          <div className="footer_image-wrapper">
            <img
              src="https://moussamamadou.github.io/scroll-trigger-gsap-section/images/pexels-cottonbro-8718352-1_11zon_11zon_11zon.jpg"
              alt="hero"
              className="hero_image"
              loading="lazy"
            />
          </div>

          <div className="hero_text text-4xl sm:text-7xl">
            <div>
              Discover.
              <br />
              <span className="color-0">WEBSCHEMA </span>
              shop.
            </div>
          </div>
        </div>
      </section>

      {/* WORK */}
      <section className="work_section" data-work="section" ref={sectionRef}>
        <div className="ghost_work-container" aria-hidden="true">
          {Array.from({ length: ghostCount }).map((_, i) => (
            <div
              key={i}
              data-ghost="item"
              className="ghost_work-item"
              style={{ width: "100%", height: "100vh" }}
            />
          ))}
        </div>

        <div className="work_container">
          {WORK_ITEMS.map((item) => (
            <WorkItem item={item} key={item.id} />
          ))}
        </div>
      </section>
    </>
  );
}
