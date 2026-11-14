import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, doc, setDoc, increment } from 'firebase/firestore';

// 시나브로(ws.ai.kr) Firebase 설정 (Firestore 전송 전용)
const SINABRO_FIREBASE_CONFIG = {
  apiKey: "AIzaSyAuFj5vVnzZvR2xsaGZImokOCMbVFM4rHg",
  authDomain: "sinabro-ee19e.firebaseapp.com",
  projectId: "sinabro-ee19e",
  storageBucket: "sinabro-ee19e.firebasestorage.app",
  messagingSenderId: "591066042181",
  appId: "1:591066042181:web:52e1ce37a29cf3c6fef82c"
};

const ANALYTICS_COLLECTION = 'analytics_daily';
const CONTENT_ID = 'job_portal';
const CONTENT_TITLE = '구인구직 (job.ws.ai.kr)';
const ADMIN_EMAIL = 'jiyulain@gmail.com';

// 1. 시나브로 전용 Firebase 독립 인스턴스 (Recruiting 기존 앱과 이름 충돌 완벽 분리)
const getSinabroDb = () => {
  const existingApp = getApps().find((a) => a.name === 'sinabroAnalytics');
  const app = existingApp || initializeApp(SINABRO_FIREBASE_CONFIG, 'sinabroAnalytics');
  return getFirestore(app);
};

// 2. 관리자 세션 판별 (도메인 간 공유 쿠키 .ws.ai.kr + 로컬 스토리지 + URL 파라미터)
const isAdminUser = (): boolean => {
  if (typeof window === 'undefined') return false;
  try {
    const params = new URLSearchParams(window.location.search);
    if (params.get('admin') === 'true') {
      localStorage.setItem('sinabro_admin_session', ADMIN_EMAIL);
      document.cookie = 'sinabro_admin=1; domain=.ws.ai.kr; path=/; max-age=31536000; SameSite=Lax';
      document.cookie = 'sinabro_admin=1; path=/; max-age=31536000; SameSite=Lax';
      return true;
    }
    if (localStorage.getItem('sinabro_admin_session') === ADMIN_EMAIL) return true;
    if (typeof document !== 'undefined' && document.cookie.includes('sinabro_admin=1')) return true;
  } catch {
    // ignore
  }
  return false;
};

// 3. 오늘 날짜 YYYY-MM-DD
const getTodayString = (): string => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// 4. 접속 디바이스 감지 (모바일, 데스크탑, 태블릿)
const detectDevice = (): 'mobile' | 'desktop' | 'tablet' => {
  if (typeof window === 'undefined') return 'desktop';
  const ua = navigator.userAgent;
  const isTablet = /iPad|Tablet/i.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  if (isTablet) return 'tablet';
  const isMobile = /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
  return isMobile ? 'mobile' : 'desktop';
};

/**
 * job.ws.ai.kr 접속 및 실제 활성 체류 시간 자동 트래킹 함수
 * - 백그라운드 탭(hidden) 상태 및 60초 이상 무동작(유휴) 상태일 때는 시간 카운트 즉시 중단
 * - 세션당 최대 10분(600초) 상한 적용으로 탭 방치로 인한 시간 부풀림 원천 차단
 */
export const initSinabroAnalytics = (): (() => void) => {
  if (typeof window === 'undefined' || isAdminUser()) {
    return () => {};
  }

  const db = getSinabroDb();
  const today = getTodayString();
  const hour = String(new Date().getHours());
  const device = detectDevice();

  // 일별 순수 방문자(UV) 여부
  const lastUvKey = 'job_last_uv_date';
  const lastUvDate = localStorage.getItem(lastUvKey);
  const isNewUv = lastUvDate !== today;
  if (isNewUv) {
    localStorage.setItem(lastUvKey, today);
  }

  // 1. 사이트 접속 및 콘텐츠 뷰 기록 (PV, UV, 시간대, 기기 분포)
  const recordVisit = async () => {
    try {
      const docRef = doc(db, ANALYTICS_COLLECTION, today);
      await setDoc(
        docRef,
        {
          date: today,
          totalPv: increment(1),
          ...(isNewUv ? { totalUv: increment(1) } : {}),
          deviceStats: {
            [device]: increment(1),
          },
          hourlyPv: {
            [hour]: increment(1),
          },
          contents: {
            [CONTENT_ID]: {
              id: CONTENT_ID,
              title: CONTENT_TITLE,
              pv: increment(1),
              ...(isNewUv ? { uv: increment(1) } : {}),
              totalDwellSeconds: increment(0),
            },
          },
          updatedAt: Date.now(),
        },
        { merge: true }
      );
    } catch (err) {
      console.warn('Sinabro analytics track failed:', err);
    }
  };

  recordVisit();

  // 2. 실제 활성 체류 시간(Active Dwell Time) 정밀 측정
  let unflushedSeconds = 0;
  let totalSessionSeconds = 0;
  let lastInteractionTime = Date.now();
  const MAX_SESSION_SECONDS = 600; // 단일 방문 세션 최대 10분 상한
  const IDLE_TIMEOUT_MS = 60000;   // 60초간 마우스/스크롤/터치 없으면 자리 비움(유휴) 처리

  const updateInteraction = () => {
    lastInteractionTime = Date.now();
  };

  // 1초마다 탭 활성화 + 최근 60초 이내 사용자 액션 여부 확인 후 1초씩만 누적
  const tickIntervalId = window.setInterval(() => {
    if (isAdminUser()) return;
    const isVisible = document.visibilityState === 'visible';
    const isRecentlyActive = Date.now() - lastInteractionTime < IDLE_TIMEOUT_MS;
    if (isVisible && isRecentlyActive && totalSessionSeconds < MAX_SESSION_SECONDS) {
      unflushedSeconds += 1;
      totalSessionSeconds += 1;
    }
  }, 1000);

  const flushDwellTime = async () => {
    if (isAdminUser() || unflushedSeconds <= 0) return;

    const secondsToSend = unflushedSeconds;
    unflushedSeconds = 0; // 중복 전송 방지를 위해 즉시 0으로 초기화

    try {
      const docRef = doc(db, ANALYTICS_COLLECTION, today);
      await setDoc(
        docRef,
        {
          contents: {
            [CONTENT_ID]: {
              totalDwellSeconds: increment(secondsToSend),
            },
          },
          updatedAt: Date.now(),
        },
        { merge: true }
      );
    } catch {
      // ignore
    }
  };

  // 15초마다 누적된 활성 시간 전송
  const flushIntervalId = window.setInterval(flushDwellTime, 15000);

  // 탭 숨김 or 페이지 이탈 시 남은 활성 시간 전송
  const handleVisibilityChange = () => {
    if (document.visibilityState === 'hidden') {
      flushDwellTime();
    } else {
      lastInteractionTime = Date.now();
    }
  };

  const handleBeforeUnload = () => {
    flushDwellTime();
  };

  window.addEventListener('pointerdown', updateInteraction, { passive: true });
  window.addEventListener('pointermove', updateInteraction, { passive: true });
  window.addEventListener('keydown', updateInteraction, { passive: true });
  window.addEventListener('scroll', updateInteraction, { passive: true });
  document.addEventListener('visibilitychange', handleVisibilityChange);
  window.addEventListener('beforeunload', handleBeforeUnload);

  // 정리(클린업) 함수
  return () => {
    window.clearInterval(tickIntervalId);
    window.clearInterval(flushIntervalId);
    window.removeEventListener('pointerdown', updateInteraction);
    window.removeEventListener('pointermove', updateInteraction);
    window.removeEventListener('keydown', updateInteraction);
    window.removeEventListener('scroll', updateInteraction);
    document.removeEventListener('visibilitychange', handleVisibilityChange);
    window.removeEventListener('beforeunload', handleBeforeUnload);
    flushDwellTime();
  };
};
