'use client';

import { useEffect } from 'react';

export default function InteractiveScripts() {
  useEffect(() => {
    const prefersReducedMotion =
      window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hasFinePointer =
      window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    // 1. About / Birendra narrative scroll reveal
    const aboutSec = document.getElementById('birendra');
    if (aboutSec && 'IntersectionObserver' in window && !prefersReducedMotion) {
      aboutSec.classList.add('has-reveal');
      if (['#birendra', '#about', '#meet-birendra'].includes(window.location.hash)) {
        aboutSec.classList.add('is-revealed');
      } else {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                aboutSec.classList.add('is-revealed');
                observer.unobserve(entry.target);
              }
            });
          },
          { threshold: 0.15, rootMargin: '0px 0px -30px 0px' }
        );
        observer.observe(aboutSec);
      }
    }

    // 2. Purpose, Mission & Values and Aspiration scroll reveals
    if ('IntersectionObserver' in window && !prefersReducedMotion) {
      const pmvSec = document.getElementById('purpose-mission-values');
      if (pmvSec) {
        pmvSec.classList.add('pmv-has-reveal');
        if (window.location.hash === '#purpose-mission-values') {
          pmvSec.classList.add('pmv-revealed');
        } else {
          const pmvObs = new IntersectionObserver(
            (entries) => {
              entries.forEach((entry) => {
                if (entry.isIntersecting) {
                  pmvSec.classList.add('pmv-revealed');
                  pmvObs.unobserve(entry.target);
                }
              });
            },
            { threshold: 0.02, rootMargin: '120px 0px 40px 0px' }
          );
          pmvObs.observe(pmvSec);
        }
      }

      const aspSec = document.getElementById('aspiration');
      if (aspSec) {
        aspSec.classList.add('aspiration-has-reveal');
        if (window.location.hash === '#aspiration') {
          aspSec.classList.add('aspiration-revealed');
        } else {
          const aspObs = new IntersectionObserver(
            (entries) => {
              entries.forEach((entry) => {
                if (entry.isIntersecting) {
                  aspSec.classList.add('aspiration-revealed');
                  aspObs.unobserve(entry.target);
                }
              });
            },
            { threshold: 0.02, rootMargin: '120px 0px 40px 0px' }
          );
          aspObs.observe(aspSec);
        }
      }
    }

    // 3. Capabilities section: scroll reveal + pointer micro-tilt & spotlight
    const capSec = document.getElementById('capabilities');
    if (capSec && 'IntersectionObserver' in window && !prefersReducedMotion) {
      capSec.classList.add('exp-has-reveal');
      if (['#capabilities', '#expertise'].includes(window.location.hash)) {
        capSec.classList.add('exp-revealed');
      } else {
        const expObserver = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                capSec.classList.add('exp-revealed');
                expObserver.unobserve(entry.target);
              }
            });
          },
          { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
        );
        expObserver.observe(capSec);
      }
    }

    // Micro-tilt on capability cards
    if (capSec && hasFinePointer && !prefersReducedMotion) {
      const MAX_TILT = 0.9;
      const cards = capSec.querySelectorAll<HTMLElement>('.capability-pillar-card, .exp-card');

      cards.forEach((card) => {
        let rafId: number | null = null;
        let currentX = 0;
        let currentY = 0;
        let targetX = 0;
        let targetY = 0;
        let active = false;

        const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

        const onFrame = () => {
          if (!active) {
            rafId = null;
            return;
          }
          currentX = lerp(currentX, targetX, 0.12);
          currentY = lerp(currentY, targetY, 0.12);
          const rotX = -currentY * MAX_TILT;
          const rotY = currentX * MAX_TILT;
          card.style.transform = `translateY(-5px) perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
          rafId = requestAnimationFrame(onFrame);
        };

        const onPointerMove = (e: PointerEvent) => {
          const rect = card.getBoundingClientRect();
          targetX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
          targetY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;

          const px = (((e.clientX - rect.left) / rect.width) * 100).toFixed(1) + '%';
          const py = (((e.clientY - rect.top) / rect.height) * 100).toFixed(1) + '%';
          card.style.setProperty('--exp-mx', px);
          card.style.setProperty('--exp-my', py);
          card.style.setProperty('--exp-spotlight', '1');

          if (!rafId) {
            active = true;
            rafId = requestAnimationFrame(onFrame);
          }
        };

        const onPointerEnter = () => {
          active = true;
        };

        const onPointerLeave = () => {
          active = false;
          if (rafId) {
            cancelAnimationFrame(rafId);
            rafId = null;
          }
          card.style.transform = '';
          card.style.setProperty('--exp-spotlight', '0');
          currentX = 0;
          currentY = 0;
          targetX = 0;
          targetY = 0;
        };

        card.addEventListener('pointerenter', onPointerEnter);
        card.addEventListener('pointermove', onPointerMove);
        card.addEventListener('pointerleave', onPointerLeave);
      });
    }

    // 4. Unified scroll reveals for Insights, FAQ, Contact, Footer
    if ('IntersectionObserver' in window && !prefersReducedMotion) {
      const sections = [
        { id: 'insights', hasClass: 'insights-has-reveal', revClass: 'insights-revealed' },
        { id: 'faq', hasClass: 'faq-has-reveal', revClass: 'faq-revealed' },
        { id: 'contact', hasClass: 'contact-has-reveal', revClass: 'contact-revealed' },
      ];

      sections.forEach((secCfg) => {
        const el = document.getElementById(secCfg.id);
        if (!el) return;

        el.classList.add(secCfg.hasClass);
        if (window.location.hash === '#' + secCfg.id) {
          el.classList.add(secCfg.revClass);
        } else {
          const obs = new IntersectionObserver(
            (entries) => {
              entries.forEach((entry) => {
                if (entry.isIntersecting) {
                  el.classList.add(secCfg.revClass);
                  obs.unobserve(entry.target);
                }
              });
            },
            { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
          );
          obs.observe(el);
        }
      });

      const footer = document.querySelector('.site-footer');
      if (footer) {
        footer.classList.add('footer-has-reveal');
        const footObs = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                footer.classList.add('footer-revealed');
                footObs.unobserve(entry.target);
              }
            });
          },
          { threshold: 0.08 }
        );
        footObs.observe(footer);
      }
    }
  }, []);

  return null;
}

