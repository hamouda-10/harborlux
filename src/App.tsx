import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { EnquirySection } from './components/EnquirySection';
import { FirmSection } from './components/FirmSection';
import { ResidencesSection } from './components/ResidencesSection';
import { RESIDENCES } from './data/residences';

type NavKey = 'Home' | 'The Firm' | 'Skyline Homes' | 'Talk To Us';
type LangCode = 'Eng' | 'Fra' | 'Deu' | 'Jpn';

const INTRO_DURATION_MS = 7400;
const RAIN_CUT_S = 3.6;
const RAIN_CROSSFADE_TRIGGER_S = RAIN_CUT_S - 0.75;
const HERO_WORD_LETTERS = ['H', 'A', 'M', 'O', 'U', 'D', 'A'];

const TILT_VIDEO_URL =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20261117_063355_a600befc-45d6-4a32-9db6-9d6565a89609.mp4';
const RAIN_VIDEO_URL =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20261117_063703_04e54df7-2236-4dff-b95b-a9a34c1f78ec.mp4';

function buildHiggsUrl(rawUrl: string, width: number): string {
  return `https://images.higgs.ai/?default=1&output=webp&url=${encodeURIComponent(rawUrl)}&w=${width}&q=85`;
}

function computeImageWidth(): number {
  if (typeof window === 'undefined') return 2000;
  const vw = window.innerWidth;
  const vh = Math.max(window.innerHeight, 520);
  const stageW = Math.max(vw, vh * (16 / 9));
  const dpr = window.devicePixelRatio || 1;
  if (dpr <= 1) {
    return Math.min(2000, Math.max(800, Math.ceil(stageW / 100) * 100));
  }
  return Math.min(2400, Math.max(1200, Math.min(2000, Math.ceil((stageW * Math.min(dpr, 1.25)) / 100) * 100)));
}

export default function App() {
  const imageWidth = useMemo(() => computeImageWidth(), []);

  const assets = useMemo(
    () => ({
      doors: buildHiggsUrl(
        'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20261117_063048_97fd9a70-adbe-46bd-bfce-ec1004f6c7d8.png',
        imageWidth
      ),
      aerial: buildHiggsUrl(
        'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20261117_063055_ee1debcd-d200-484f-b94f-fad6dcffd4eb.png',
        imageWidth
      ),
      back: buildHiggsUrl(
        'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20261117_063251_24fbd7cc-00df-49ec-8fbf-d8a0349b1e98.png',
        imageWidth
      ),
      mid: buildHiggsUrl(
        'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20261117_063252_b9f2fecf-9be0-485f-842f-3aa6bbc251f2.png',
        imageWidth
      ),
      front: buildHiggsUrl(
        'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20261117_063151_7804d758-a2eb-4499-9b56-8f493edbb206.png',
        imageWidth
      ),
    }),
    [imageWidth]
  );

  const [introActive, setIntroActive] = useState(true);
  const [introFinished, setIntroFinished] = useState(false);
  const [replayEpoch, setReplayEpoch] = useState(0);
  const [activeNav, setActiveNav] = useState<NavKey>('Home');
  const [navScrimVisible, setNavScrimVisible] = useState(false);
  const [heroScrolledPastCue, setHeroScrolledPastCue] = useState(false);
  const [lang, setLang] = useState<LangCode>('Eng');
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [enquireOpen, setEnquireOpen] = useState(false);
  const [selectedResidencePreset, setSelectedResidencePreset] = useState<string>(
    RESIDENCES[0].name
  );
  const [enquirySubmitted, setEnquirySubmitted] = useState(false);
  const [enquiryForm, setEnquiryForm] = useState({
    name: '',
    email: '',
    residence: RESIDENCES[0].name,
    notes: '',
  });

  const heroRunwayRef = useRef<HTMLElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const backLayerRef = useRef<HTMLDivElement>(null);
  const topShadeRef = useRef<HTMLDivElement>(null);
  const headlineBlockRef = useRef<HTMLDivElement>(null);
  const kickerRef = useRef<HTMLSpanElement>(null);
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const midLayerRef = useRef<HTMLDivElement>(null);
  const frontLayerRef = useRef<HTMLDivElement>(null);
  const openingRef = useRef<HTMLDivElement>(null);
  const doorsRef = useRef<HTMLDivElement>(null);
  const tiltVideoRef = useRef<HTMLVideoElement>(null);
  const doorLeftRef = useRef<HTMLDivElement>(null);
  const doorRightRef = useRef<HTMLDivElement>(null);

  const aerialImgRef = useRef<HTMLImageElement>(null);
  const backImgRef = useRef<HTMLImageElement>(null);
  const midImgRef = useRef<HTMLImageElement>(null);
  const frontImgRef = useRef<HTMLImageElement>(null);

  const rainARef = useRef<HTMLVideoElement>(null);
  const rainBRef = useRef<HTMLVideoElement>(null);
  const activeRainRef = useRef<0 | 1>(0);
  const rainSwapLockRef = useRef(false);
  const rainStartedRef = useRef(false);
  const rainPauseTimerRef = useRef<number | null>(null);

  const probeWordRef = useRef<HTMLDivElement>(null);
  const probeStrutRef = useRef<HTMLSpanElement>(null);

  // Track whether user scrolled deep enough down so scrolling back up to top replays intro
  const visitedBelowRef = useRef(false);
  const introRunningRef = useRef(false);
  const lastReplayTimeRef = useRef(0);

  const updateLayout = useCallback(() => {
    const hero = heroRef.current;
    const nav = navRef.current;
    if (!hero || !nav) return;

    const heroRect = hero.getBoundingClientRect();
    const heroW = heroRect.width;
    const heroH = heroRect.height;
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const stageW = Math.max(heroW, heroH * (16 / 9));
    const stageH = stageW * (9 / 16);
    const stageTop = (heroH - stageH) / 2;

    const isPortrait = heroH > 1.2 * heroW;
    const baselineRatio = isPortrait ? 0.362 : 0.43;
    const baselineYInStage = baselineRatio * stageH;
    const baselineYInHero = stageTop + baselineYInStage;

    let widthPerEm = 3.42;
    let baselinePerEm = 0.864;
    const probeWord = probeWordRef.current;
    const probeStrut = probeStrutRef.current;
    if (probeWord && probeStrut) {
      const wordRect = probeWord.getBoundingClientRect();
      const strutRect = probeStrut.getBoundingClientRect();
      if (wordRect.width > 0) {
        widthPerEm = wordRect.width / 100;
      }
      if (strutRect.top >= wordRect.top) {
        baselinePerEm = (strutRect.top - wordRect.top) / 100;
      }
    }

    const navBottomInHero = nav.offsetTop + nav.offsetHeight;

    const candA = (0.625 * stageW) / widthPerEm;
    const candB = (0.92 * vw) / widthPerEm;
    const gap = baselineYInHero - (navBottomInHero + 0.035 * vh);
    const candC = gap / 0.92;

    const wordSize = Math.max(24, Math.min(candA, candB, candC));
    const h1Top = baselineYInStage - baselinePerEm * wordSize;
    const kickerTop = baselineYInStage - (0.727 + 0.06 + 0.102) * wordSize;

    hero.style.setProperty('--stage-w', `${stageW}px`);
    hero.style.setProperty('--stage-h', `${stageH}px`);
    hero.style.setProperty('--hero-w', `${heroW}px`);
    hero.style.setProperty('--word-size', `${wordSize}px`);
    hero.style.setProperty('--h1-top', `${h1Top}px`);
    hero.style.setProperty('--kicker-top', `${kickerTop}px`);
  }, []);

  useLayoutEffect(() => {
    updateLayout();
    const ro = new ResizeObserver(() => {
      updateLayout();
    });
    if (heroRef.current) ro.observe(heroRef.current);
    if (navRef.current) ro.observe(navRef.current);
    window.addEventListener('resize', updateLayout);

    let cancelled = false;
    if (document.fonts) {
      document.fonts.load('700 100px Inter').then(() => {
        if (!cancelled) updateLayout();
      });
      document.fonts.ready.then(() => {
        if (!cancelled) updateLayout();
      });
    }

    return () => {
      cancelled = true;
      ro.disconnect();
      window.removeEventListener('resize', updateLayout);
    };
  }, [updateLayout]);

  const setRainOpacity = useCallback((idx: 0 | 1, on: boolean) => {
    const el = idx === 0 ? rainARef.current : rainBRef.current;
    if (!el) return;
    if (on) {
      el.classList.add('is-on');
    } else {
      el.classList.remove('is-on');
    }
  }, []);

  const startRain = useCallback(() => {
    if (rainStartedRef.current) return;
    rainStartedRef.current = true;
    const rainA = rainARef.current;
    const rainB = rainBRef.current;
    if (!rainA || !rainB) return;

    rainA.muted = true;
    rainB.muted = true;
    activeRainRef.current = 0;
    rainSwapLockRef.current = false;
    rainA.currentTime = 0;
    setRainOpacity(0, true);
    setRainOpacity(1, false);
    rainA.play().catch(() => {});
  }, [setRainOpacity]);

  const swapRain = useCallback(
    (fromIdx: 0 | 1) => {
      if (rainSwapLockRef.current || activeRainRef.current !== fromIdx) return;
      const rainA = rainARef.current;
      const rainB = rainBRef.current;
      if (!rainA || !rainB) return;

      rainSwapLockRef.current = true;
      const nextIdx: 0 | 1 = fromIdx === 0 ? 1 : 0;
      const fromVideo = fromIdx === 0 ? rainA : rainB;
      const nextVideo = nextIdx === 0 ? rainA : rainB;

      activeRainRef.current = nextIdx;
      nextVideo.muted = true;
      nextVideo.currentTime = 0;
      nextVideo.play().catch(() => {});
      setRainOpacity(nextIdx, true);
      setRainOpacity(fromIdx, false);

      if (rainPauseTimerRef.current !== null) {
        window.clearTimeout(rainPauseTimerRef.current);
      }
      rainPauseTimerRef.current = window.setTimeout(() => {
        fromVideo.pause();
        rainSwapLockRef.current = false;
      }, 800);
    },
    [setRainOpacity]
  );

  const handleRainTimeUpdate = useCallback(
    (idx: 0 | 1) => {
      if (!rainStartedRef.current) return;
      if (activeRainRef.current !== idx || rainSwapLockRef.current) return;
      const video = idx === 0 ? rainARef.current : rainBRef.current;
      if (!video) return;
      if (video.currentTime >= RAIN_CROSSFADE_TRIGGER_S) {
        swapRain(idx);
      }
    },
    [swapRain]
  );

  const triggerReplayIntro = useCallback((scrollTopFirst = true) => {
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      if (scrollTopFirst) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }

    const now = performance.now();
    if (now - lastReplayTimeRef.current < 1200) return;
    lastReplayTimeRef.current = now;
    visitedBelowRef.current = false;

    if (scrollTopFirst && window.scrollY > 10) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    if (tiltVideoRef.current) {
      tiltVideoRef.current.pause();
      tiltVideoRef.current.currentTime = 0;
    }
    if (openingRef.current) openingRef.current.classList.remove('is-hidden');
    if (doorsRef.current) doorsRef.current.classList.remove('is-hidden');
    if (heroRef.current) heroRef.current.classList.add('intro');
    if (navRef.current) navRef.current.classList.add('is-intro-hidden');

    setIntroFinished(false);
    setIntroActive(true);
    setReplayEpoch((prev) => prev + 1);
  }, []);

  // Intro WAAPI timeline (runs on initial load and whenever replayEpoch increments)
  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      if (openingRef.current) openingRef.current.classList.add('is-hidden');
      if (doorsRef.current) doorsRef.current.classList.add('is-hidden');
      if (heroRef.current) heroRef.current.classList.remove('intro');
      if (navRef.current) navRef.current.classList.remove('is-intro-hidden');
      setIntroActive(false);
      setIntroFinished(true);
      return;
    }

    const tiltVideo = tiltVideoRef.current;
    const rainA = rainARef.current;
    const rainB = rainBRef.current;
    if (tiltVideo) tiltVideo.muted = true;
    if (rainA) rainA.muted = true;
    if (rainB) rainB.muted = true;

    let started = false;
    let rafId: number | null = null;
    let delayTimer: number | null = null;
    let failsafeTimer: number | null = null;
    const animations: Animation[] = [];
    introRunningRef.current = true;

    const readyState = {
      doors: false,
      aerial: false,
      back: false,
      mid: false,
      front: false,
      tilt: false,
    };

    const runTimeline = () => {
      if (started) return;
      started = true;
      if (delayTimer !== null) window.clearTimeout(delayTimer);
      if (failsafeTimer !== null) window.clearTimeout(failsafeTimer);

      const mk = (
        el: Element | null,
        keyframes: Keyframe[],
        duration = INTRO_DURATION_MS
      ): Animation | null => {
        if (!el) return null;
        const anim = el.animate(keyframes, {
          duration,
          fill: 'both',
        });
        anim.pause();
        animations.push(anim);
        return anim;
      };

      mk(doorLeftRef.current, [
        { transform: 'translateX(0%)', offset: 0 },
        { transform: 'translateX(0%)', offset: 20 / 7400, easing: 'cubic-bezier(0.1, 0.2, 0.8, 1)' },
        { transform: 'translateX(-101%)', offset: 1130 / 7400 },
        { transform: 'translateX(-101%)', offset: 1 },
      ]);

      mk(doorRightRef.current, [
        { transform: 'translateX(0%)', offset: 0 },
        { transform: 'translateX(0%)', offset: 20 / 7400, easing: 'cubic-bezier(0.4, 0.6, 0.9, 1)' },
        { transform: 'translateX(101%)', offset: 1240 / 7400 },
        { transform: 'translateX(101%)', offset: 1 },
      ]);

      mk(tiltVideoRef.current, [
        { opacity: 0, offset: 0 },
        { opacity: 0, offset: 1190 / 7400, easing: 'ease-in-out' },
        { opacity: 1, offset: 1470 / 7400 },
        { opacity: 1, offset: 1 },
      ]);

      mk(openingRef.current, [
        { opacity: 1, offset: 0 },
        { opacity: 1, offset: 2450 / 7400, easing: 'cubic-bezier(0.45, 0, 0.55, 1)' },
        { opacity: 0, offset: 2950 / 7400 },
        { opacity: 0, offset: 1 },
      ]);

      mk(navRef.current, [
        { opacity: 0, transform: 'translateY(-6px)', offset: 0 },
        { opacity: 0, transform: 'translateY(-6px)', offset: 2450 / 7400, easing: 'ease-out' },
        { opacity: 1, transform: 'translateY(0px)', offset: 2750 / 7400 },
        { opacity: 1, transform: 'translateY(0px)', offset: 1 },
      ]);

      mk(kickerRef.current, [
        { opacity: 0, transform: 'translateY(0.5em)', offset: 0 },
        { opacity: 0, transform: 'translateY(0.5em)', offset: 2450 / 7400, easing: 'cubic-bezier(0.2, 0.65, 0.3, 1)' },
        { opacity: 1, transform: 'translateY(0)', offset: 3100 / 7400 },
        { opacity: 1, transform: 'translateY(0)', offset: 1 },
      ]);

      letterRefs.current.forEach((letterEl, i) => {
        const startMs = 2450 + i * 54;
        const endMs = startMs + 700;
        mk(letterEl, [
          { opacity: 0, transform: 'translateY(0.14em)', offset: 0 },
          {
            opacity: 0,
            transform: 'translateY(0.14em)',
            offset: startMs / 7400,
            easing: 'cubic-bezier(0.2, 0.65, 0.3, 1)',
          },
          { opacity: 1, transform: 'translateY(0)', offset: endMs / 7400 },
          { opacity: 1, transform: 'translateY(0)', offset: 1 },
        ]);
      });

      mk(topShadeRef.current, [
        { opacity: 0, offset: 0 },
        { opacity: 0, offset: 2900 / 7400, easing: 'ease-in-out' },
        { opacity: 1, offset: 3700 / 7400 },
        { opacity: 1, offset: 1 },
      ]);

      mk(backLayerRef.current, [
        { transform: 'translateY(0%)', offset: 0 },
        { transform: 'translateY(0%)', offset: 2900 / 7400, easing: 'cubic-bezier(0.45, 0, 0.35, 1)' },
        { transform: 'translateY(-1.5%)', offset: 4300 / 7400 },
        { transform: 'translateY(-1.5%)', offset: 1 },
      ]);

      mk(midLayerRef.current, [
        { transform: 'translateY(0%)', offset: 0 },
        { transform: 'translateY(0%)', offset: 2900 / 7400, easing: 'cubic-bezier(0.45, 0, 0.3, 1)' },
        { transform: 'translateY(-4%)', offset: 4300 / 7400 },
        { transform: 'translateY(-4%)', offset: 4600 / 7400, easing: 'cubic-bezier(0.45, 0, 0.55, 1)' },
        { transform: 'translateY(0%)', offset: 6900 / 7400 },
        { transform: 'translateY(0%)', offset: 1 },
      ]);

      mk(headlineBlockRef.current, [
        { transform: 'translateY(6%)', offset: 0 },
        { transform: 'translateY(6%)', offset: 3000 / 7400, easing: 'cubic-bezier(0.3, 0, 0.4, 1)' },
        { transform: 'translateY(0%)', offset: 4800 / 7400 },
        { transform: 'translateY(0%)', offset: 1 },
      ]);

      mk(frontLayerRef.current, [
        { transform: 'translateY(66%)', offset: 0 },
        { transform: 'translateY(66%)', offset: 3350 / 7400, easing: 'cubic-bezier(0.2, 0.5, 0.2, 1)' },
        { transform: 'translateY(-2.5%)', offset: 6000 / 7400, easing: 'cubic-bezier(0.45, 0, 0.55, 1)' },
        { transform: 'translateY(0%)', offset: 7300 / 7400 },
        { transform: 'translateY(0%)', offset: 1 },
      ]);

      const t0 = performance.now();
      let tiltPausedAtEnd = false;

      const tick = (now: number) => {
        const elapsed = Math.min(now - t0, INTRO_DURATION_MS);

        for (let i = 0; i < animations.length; i++) {
          animations[i].currentTime = elapsed;
        }

        if (elapsed >= 2400 && !rainStartedRef.current) {
          startRain();
        }

        const tv = tiltVideoRef.current;
        if (tv) {
          const clipLen = tv.duration && Number.isFinite(tv.duration) ? tv.duration : 5.04;
          if (elapsed >= 1250 && elapsed < 2850) {
            const baseRate = clipLen / 1.6;
            const targetTime = ((elapsed - 1250) / 1600) * clipLen;
            if (tv.paused) {
              tv.play().catch(() => {});
            }
            const err = targetTime - tv.currentTime;
            const nudged = Math.max(baseRate * 0.85, Math.min(baseRate * 1.2, baseRate + err * 2.5));
            if (Number.isFinite(nudged) && nudged > 0) {
              tv.playbackRate = nudged;
            }
          } else if (elapsed >= 2850 && !tiltPausedAtEnd) {
            tiltPausedAtEnd = true;
            tv.pause();
            if (Number.isFinite(clipLen) && clipLen > 0) {
              tv.currentTime = clipLen;
            }
          }
        }

        if (elapsed < INTRO_DURATION_MS) {
          rafId = window.requestAnimationFrame(tick);
        } else {
          introRunningRef.current = false;
          if (openingRef.current) openingRef.current.classList.add('is-hidden');
          if (doorsRef.current) doorsRef.current.classList.add('is-hidden');
          if (heroRef.current) heroRef.current.classList.remove('intro');
          if (navRef.current) navRef.current.classList.remove('is-intro-hidden');
          animations.forEach((a) => a.cancel());
          setIntroActive(false);
          setIntroFinished(true);
        }
      };

      rafId = window.requestAnimationFrame(tick);
    };

    const checkAllReady = () => {
      if (started || delayTimer !== null) return;
      if (
        readyState.doors &&
        readyState.aerial &&
        readyState.back &&
        readyState.mid &&
        readyState.front &&
        readyState.tilt
      ) {
        delayTimer = window.setTimeout(runTimeline, replayEpoch === 0 ? 120 : 20);
      }
    };

    const markReady = (key: keyof typeof readyState) => {
      if (readyState[key]) return;
      readyState[key] = true;
      checkAllReady();
    };

    const doorPreload = new Image();
    doorPreload.referrerPolicy = 'no-referrer';
    doorPreload.onload = () => markReady('doors');
    doorPreload.onerror = () => markReady('doors');
    doorPreload.src = assets.doors;
    if (doorPreload.complete) markReady('doors');

    const watchImg = (img: HTMLImageElement | null, key: 'aerial' | 'back' | 'mid' | 'front') => {
      if (!img) return () => {};
      if (img.complete && img.naturalWidth > 0) {
        markReady(key);
        return () => {};
      }
      const onDone = () => markReady(key);
      img.addEventListener('load', onDone, { once: true });
      img.addEventListener('error', onDone, { once: true });
      return () => {
        img.removeEventListener('load', onDone);
        img.removeEventListener('error', onDone);
      };
    };

    const cleanAerial = watchImg(aerialImgRef.current, 'aerial');
    const cleanBack = watchImg(backImgRef.current, 'back');
    const cleanMid = watchImg(midImgRef.current, 'mid');
    const cleanFront = watchImg(frontImgRef.current, 'front');

    const onTiltReady = () => markReady('tilt');
    if (tiltVideo) {
      if (tiltVideo.readyState >= 4) {
        markReady('tilt');
      } else {
        tiltVideo.addEventListener('canplaythrough', onTiltReady, { once: true });
        tiltVideo.addEventListener('error', onTiltReady, { once: true });
      }
    }

    failsafeTimer = window.setTimeout(runTimeline, replayEpoch === 0 ? 5000 : 1000);

    return () => {
      introRunningRef.current = false;
      cleanAerial();
      cleanBack();
      cleanMid();
      cleanFront();
      if (tiltVideo) {
        tiltVideo.removeEventListener('canplaythrough', onTiltReady);
        tiltVideo.removeEventListener('error', onTiltReady);
      }
      if (delayTimer !== null) window.clearTimeout(delayTimer);
      if (failsafeTimer !== null) window.clearTimeout(failsafeTimer);
      if (rafId !== null) window.cancelAnimationFrame(rafId);
      animations.forEach((a) => a.cancel());
    };
  }, [assets.doors, replayEpoch, startRain]);

  useEffect(() => {
    return () => {
      if (rainPauseTimerRef.current !== null) {
        window.clearTimeout(rainPauseTimerRef.current);
      }
    };
  }, []);

  // Bidirectional Scroll-Scrubbed Parallax + Section Reveal + ScrollSpy + Scroll-to-Top Replay
  useEffect(() => {
    let rafPending = false;
    let lastActiveSection: NavKey = 'Home';
    let lastScrim = false;
    let lastPastCue = false;

    const updateScrollEffects = () => {
      rafPending = false;
      const scrollY = window.scrollY;
      const vh = window.innerHeight || 900;
      const hero = heroRef.current;
      const runway = heroRunwayRef.current;

      if (hero && runway) {
        const travel = Math.max(1, runway.offsetHeight - hero.offsetHeight);
        const scrollP = Math.max(0, Math.min(1, scrollY / travel));
        hero.style.setProperty('--scroll-p', scrollP.toFixed(4));
      }

      const showScrim = scrollY > vh * 0.72;
      if (showScrim !== lastScrim) {
        lastScrim = showScrim;
        setNavScrimVisible(showScrim);
      }

      const pastCue = scrollY > 48;
      if (pastCue !== lastPastCue) {
        lastPastCue = pastCue;
        setHeroScrolledPastCue(pastCue);
      }

      // If user scrolls down past 70% of viewport height, arm replay when returning to top
      if (scrollY > vh * 0.7) {
        visitedBelowRef.current = true;
      } else if (scrollY <= 14 && visitedBelowRef.current && !introRunningRef.current) {
        triggerReplayIntro(false);
      }

      // Bidirectional scroll-linked progress (--p in [0, 1]) for all sections & cards
      const scrollItems = document.querySelectorAll<HTMLElement>('[data-scroll-item]');
      const startY = vh * 0.94;
      const span = Math.max(180, vh * 0.42);
      scrollItems.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const p = Math.max(0, Math.min(1, (startY - rect.top) / span));
        el.style.setProperty('--p', p.toFixed(4));
      });

      // ScrollSpy for fixed navigation pills
      const probeY = vh * 0.38;
      const talkEl = document.getElementById('talk-to-us');
      const homesEl = document.getElementById('skyline-homes');
      const firmEl = document.getElementById('the-firm');

      let nextNav: NavKey = 'Home';
      if (talkEl && talkEl.getBoundingClientRect().top <= probeY) {
        nextNav = 'Talk To Us';
      } else if (homesEl && homesEl.getBoundingClientRect().top <= probeY) {
        nextNav = 'Skyline Homes';
      } else if (firmEl && firmEl.getBoundingClientRect().top <= probeY) {
        nextNav = 'The Firm';
      }

      if (nextNav !== lastActiveSection) {
        lastActiveSection = nextNav;
        setActiveNav(nextNav);
      }
    };

    const onScroll = () => {
      if (!rafPending) {
        rafPending = true;
        window.requestAnimationFrame(updateScrollEffects);
      }
    };

    updateScrollEffects();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [triggerReplayIntro]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setLangMenuOpen(false);
        setEnquireOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const scrollToSection = useCallback((sectionId: string) => {
    if (sectionId === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const target = document.getElementById(sectionId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  const handleNavClick = (item: NavKey, e: React.MouseEvent) => {
    e.preventDefault();
    setActiveNav(item);
    setLangMenuOpen(false);
    if (item === 'Home') {
      if (window.scrollY < 40 && introFinished) {
        triggerReplayIntro(false);
      } else {
        scrollToSection('home');
      }
    } else if (item === 'The Firm') {
      scrollToSection('the-firm');
    } else if (item === 'Skyline Homes') {
      scrollToSection('skyline-homes');
    } else if (item === 'Talk To Us') {
      scrollToSection('talk-to-us');
    }
  };

  const handleEnquireFromSection = useCallback(
    (residenceLabel?: string) => {
      if (residenceLabel) {
        setSelectedResidencePreset(residenceLabel);
        setEnquiryForm((f) => ({ ...f, residence: residenceLabel }));
      }
      scrollToSection('talk-to-us');
    },
    [scrollToSection]
  );

  const handleEnquireSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEnquirySubmitted(true);
  };

  return (
    <>
      {/* Hidden off-screen font measurement probe for exact 100px Summit width & baseline */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          left: -9999,
          top: -9999,
          visibility: 'hidden',
          pointerEvents: 'none',
        }}
      >
        <div
          ref={probeWordRef}
          style={{
            display: 'inline-block',
            fontFamily: "'Inter', sans-serif",
            fontSize: '100px',
            fontWeight: 700,
            letterSpacing: '-0.045em',
            lineHeight: 1,
            whiteSpace: 'nowrap',
          }}
        >
          {HERO_WORD_LETTERS.map((ch, idx) => (
            <span key={idx} style={{ display: 'inline-block' }}>
              {ch}
            </span>
          ))}
          <span
            ref={probeStrutRef}
            style={{ display: 'inline-block', width: 0, height: 0, verticalAlign: 'baseline' }}
          />
        </div>
      </div>

      {/* Subtle top scrim when scrolled below the hero */}
      <div className={`nav-scrim${navScrimVisible ? ' is-visible' : ''}`} aria-hidden="true" />

      {/* Fixed Viewport Navigation */}
      <header
        ref={navRef}
        className={`nav${introActive ? ' is-intro-hidden' : ''}`}
      >
        <a
          href="#home"
          className="nav-wordmark"
          onClick={(e) => handleNavClick('Home', e)}
        >
          HARBORLUX
        </a>

        <nav className="nav-pills" aria-label="Primary navigation">
          {(['Home', 'The Firm', 'Skyline Homes', 'Talk To Us'] as NavKey[]).map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
              className={`nav-link${activeNav === item ? ' is-active' : ''}`}
              aria-current={activeNav === item ? 'page' : undefined}
              onClick={(e) => handleNavClick(item, e)}
            >
              {item}
            </a>
          ))}
        </nav>

        <div className="nav-right">
          <div className="nav-lang-wrap">
            <button
              type="button"
              className="nav-lang"
              aria-haspopup="listbox"
              aria-expanded={langMenuOpen}
              onClick={() => setLangMenuOpen((prev) => !prev)}
            >
              <svg
                className="nav-globe"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="9.5" />
                <line x1="2.5" y1="12" x2="21.5" y2="12" />
                <ellipse cx="12" cy="12" rx="4.2" ry="9.5" />
              </svg>
              <span>{lang}</span>
            </button>

            {langMenuOpen && (
              <div
                role="listbox"
                aria-label="Select language"
                className="absolute right-0 mt-2 w-24 rounded-2xl p-1 text-xs text-white shadow-2xl"
                style={{
                  backgroundColor: 'rgba(24, 15, 60, 0.88)',
                  backdropFilter: 'blur(14px)',
                  WebkitBackdropFilter: 'blur(14px)',
                  boxShadow: 'inset 0 0 0 1px rgba(255, 255, 255, 0.14)',
                }}
              >
                {(['Eng', 'Fra', 'Deu', 'Jpn'] as LangCode[]).map((code) => (
                  <button
                    key={code}
                    type="button"
                    role="option"
                    aria-selected={lang === code}
                    onClick={() => {
                      setLang(code);
                      setLangMenuOpen(false);
                    }}
                    className={`block w-full rounded-xl px-3 py-1.5 text-left transition-colors ${
                      lang === code
                        ? 'bg-white text-[#180F3C] font-semibold'
                        : 'text-white/88 hover:bg-white/14'
                    }`}
                  >
                    {code}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            className="nav-enquire"
            onClick={() => {
              setLangMenuOpen(false);
              setEnquirySubmitted(false);
              setEnquireOpen(true);
            }}
          >
            Enquire
          </button>
        </div>
      </header>

      {/* Scroll-Scrubbed Sticky Hero Runway */}
      <section id="home" ref={heroRunwayRef} className="hero-runway">
        <div ref={heroRef} className={`hero${introActive ? ' intro' : ''}`}>
          {/* 16:9 Scene Stage */}
          <div className="stage">
            {/* 1. Back layer */}
            <div ref={backLayerRef} className="layer layer-back">
              <div className="parallax-wrap parallax-back">
                <img
                  ref={backImgRef}
                  className="layer-media"
                  src={assets.back}
                  alt=""
                  referrerPolicy="no-referrer"
                />
                <video
                  ref={rainARef}
                  className="rain-video"
                  src={RAIN_VIDEO_URL}
                  muted
                  playsInline
                  preload="auto"
                  onTimeUpdate={() => handleRainTimeUpdate(0)}
                  onEnded={() => swapRain(0)}
                />
                <video
                  ref={rainBRef}
                  className="rain-video"
                  src={RAIN_VIDEO_URL}
                  muted
                  playsInline
                  preload="auto"
                  onTimeUpdate={() => handleRainTimeUpdate(1)}
                  onEnded={() => swapRain(1)}
                />
                <div ref={topShadeRef} className="top-shade" />
              </div>
            </div>

            {/* 2. Headline block (between back and mid layers) */}
            <div ref={headlineBlockRef} className="headline-block">
              <div className="parallax-wrap parallax-headline">
                <div className="kicker-wrap">
                  <span ref={kickerRef} className="kicker">
                    DEVELOPED BY HAMOUDA
                  </span>
                </div>
                <h1 className="summit-h1" aria-label="DEVELOPED BY HAMOUDA — HAMOUDA">
                  {HERO_WORD_LETTERS.map((letter, idx) => (
                    <span
                      key={idx}
                      ref={(el) => {
                        letterRefs.current[idx] = el;
                      }}
                      className="summit-letter"
                      aria-hidden="true"
                    >
                      {letter}
                    </span>
                  ))}
                </h1>
              </div>
            </div>

            {/* 3. Mid layer */}
            <div ref={midLayerRef} className="layer layer-mid">
              <div className="parallax-wrap parallax-mid">
                <img
                  ref={midImgRef}
                  className="layer-media"
                  src={assets.mid}
                  alt=""
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

            {/* 4. Front layer */}
            <div ref={frontLayerRef} className="layer layer-front">
              <div className="parallax-wrap parallax-front">
                <div className="glass-tint" aria-hidden="true" />
                <img
                  ref={frontImgRef}
                  className="layer-media"
                  src={assets.front}
                  alt="Penthouse terrace overlooking a rainy neon harbour skyline"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </div>

          {/* Opening aerial + tilt video (above stage, z-index 6) */}
          <div
            ref={openingRef}
            className={`opening${introFinished ? ' is-hidden' : ''}`}
            aria-hidden="true"
          >
            <img
              ref={aerialImgRef}
              className="opening-media"
              src={assets.aerial}
              alt=""
              referrerPolicy="no-referrer"
            />
            <video
              ref={tiltVideoRef}
              className="opening-media opening-video"
              src={TILT_VIDEO_URL}
              muted
              playsInline
              preload="auto"
            />
          </div>

          {/* Lacquer doors (above opening, z-index 7) */}
          <div
            ref={doorsRef}
            className={`doors${introFinished ? ' is-hidden' : ''}`}
            aria-hidden="true"
          >
            <div
              ref={doorLeftRef}
              className="door-panel door-left"
              style={{ backgroundImage: `url("${assets.doors}")` }}
            />
            <div
              ref={doorRightRef}
              className="door-panel door-right"
              style={{ backgroundImage: `url("${assets.doors}")` }}
            />
          </div>

          {/* Subtle scroll prompt after intro settles */}
          {introFinished && !heroScrolledPastCue && (
            <button
              type="button"
              onClick={() => scrollToSection('the-firm')}
              className="hero-scroll-cue"
            >
              <span>Scroll to Explore Residences</span>
              <span aria-hidden="true">↓</span>
            </button>
          )}
        </div>
      </section>

      {/* Main Real Estate Portfolio Sections */}
      <FirmSection
        onReplayIntro={() => triggerReplayIntro(true)}
        onEnquire={handleEnquireFromSection}
      />

      <ResidencesSection onEnquire={handleEnquireFromSection} />

      <EnquirySection
        selectedResidencePreset={selectedResidencePreset}
        onNavigate={scrollToSection}
        onReplayIntro={() => triggerReplayIntro(true)}
      />

      {/* Quick Private Enquiry Modal triggered by Nav "Enquire" button */}
      {enquireOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Private Viewing Enquiry"
          className="fixed inset-0 z-40 flex items-end justify-center bg-black/50 p-4 sm:items-center"
          onClick={() => setEnquireOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-3xl p-7 text-white shadow-2xl"
            style={{
              backgroundColor: 'rgba(13, 10, 34, 0.92)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              boxShadow: 'inset 0 0 0 1px rgba(255, 255, 255, 0.16)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-light tracking-widest uppercase text-white/65">
                  Private Client Desk
                </p>
                <h2 className="mt-1 text-xl font-semibold tracking-tight text-white">
                  Enquire for Private Viewing
                </h2>
              </div>
              <button
                type="button"
                aria-label="Close enquiry modal"
                onClick={() => setEnquireOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/12 text-white/80 transition hover:bg-white/20 hover:text-white cursor-pointer"
              >
                ×
              </button>
            </div>

            {enquirySubmitted ? (
              <div className="mt-6 space-y-4">
                <p className="text-sm leading-relaxed text-white/85">
                  Thank you, {enquiryForm.name || 'valued guest'}. A Harborlux senior advisor has
                  registered your private viewing request for{' '}
                  <span className="font-medium text-white">{enquiryForm.residence}</span>.
                </p>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setEnquireOpen(false)}
                    className="rounded-full bg-[#F2B8C0] px-6 py-2.5 text-xs font-semibold text-[#180F3C] transition hover:bg-[#F7C9D0] cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleEnquireSubmit} className="mt-5 space-y-4">
                <div>
                  <label className="mb-1.5 block text-xs text-white/70" htmlFor="hl-name">
                    Full Name
                  </label>
                  <input
                    id="hl-name"
                    type="text"
                    required
                    value={enquiryForm.name}
                    onChange={(e) => setEnquiryForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="Alex Mercer"
                    className="w-full rounded-xl border border-white/15 bg-white/8 px-3.5 py-2.5 text-sm text-white placeholder-white/40 focus:border-white/40 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs text-white/70" htmlFor="hl-email">
                    Email Address
                  </label>
                  <input
                    id="hl-email"
                    type="email"
                    required
                    value={enquiryForm.email}
                    onChange={(e) => setEnquiryForm((f) => ({ ...f, email: e.target.value }))}
                    placeholder="alex@domain.com"
                    className="w-full rounded-xl border border-white/15 bg-white/8 px-3.5 py-2.5 text-sm text-white placeholder-white/40 focus:border-white/40 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs text-white/70" htmlFor="hl-res">
                    Residence of Interest
                  </label>
                  <select
                    id="hl-res"
                    value={enquiryForm.residence}
                    onChange={(e) =>
                      setEnquiryForm((f) => ({ ...f, residence: e.target.value }))
                    }
                    className="w-full rounded-xl border border-white/15 bg-[#180F3C] px-3.5 py-2.5 text-sm text-white focus:border-white/40 focus:outline-none"
                  >
                    {RESIDENCES.map((res) => (
                      <option key={res.id} value={res.name}>
                        {res.name} ({res.priceUsd})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs text-white/70" htmlFor="hl-notes">
                    Preferred Timing
                  </label>
                  <textarea
                    id="hl-notes"
                    rows={2}
                    value={enquiryForm.notes}
                    onChange={(e) => setEnquiryForm((f) => ({ ...f, notes: e.target.value }))}
                    placeholder="Evening helicopter transfer or private appointment"
                    className="w-full rounded-xl border border-white/15 bg-white/8 px-3.5 py-2 text-sm text-white placeholder-white/40 focus:border-white/40 focus:outline-none"
                  />
                </div>
                <div className="flex items-center justify-end gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => setEnquireOpen(false)}
                    className="rounded-full px-4 py-2 text-xs font-medium text-white/75 transition hover:bg-white/10 hover:text-white cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-full bg-[#F2B8C0] px-6 py-2.5 text-xs font-semibold text-[#180F3C] transition hover:bg-[#F7C9D0] cursor-pointer"
                  >
                    Submit Request
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
