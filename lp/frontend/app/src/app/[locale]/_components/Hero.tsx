'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';

export default function Hero() {
  const t = useTranslations('Hero');

  return (
    <section id="top" className="hero-section wa-dynamic-hero">
      <div className="wa-bg-layer" aria-hidden="true">
        <div className="wa-shape-enso" />
        <div className="wa-shape-rect" />
        <div className="wa-particles" />
        <div className="wa-fog" />
      </div>

      <div className="wa-content-layer">
        <div className="wa-title-area">
          <h1 className="wa-main-title">
            <span className="wa-visually-hidden">XPAC</span>
            <span className="wa-main-logo-frame">
              <Image
                src="/xpac_logo.png"
                alt=""
                aria-hidden="true"
                width={2000}
                height={1000}
                priority
                className="wa-main-logo"
              />
            </span>
          </h1>
          <div className="wa-title-line" />
        </div>

        <div className="wa-sub-area">
          <p className="wa-sub-text">{t('message')}</p>
          <p className="wa-sub-text wa-sub-text-muted">{t('sub')}</p>
        </div>
      </div>

      <div className="hero-scroll-indicator wa-scroll-indicator" aria-hidden="true">
        <span className="hero-scroll-text scroll-text">SCROLL</span>
        <div className="hero-scroll-track scroll-track">
          <div className="hero-scroll-bar scroll-bar" />
        </div>
      </div>

      <div className="wa-flow-line" aria-hidden="true" />
    </section>
  );
}
