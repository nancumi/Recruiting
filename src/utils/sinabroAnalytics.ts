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

// 2. 관리자 세션 판별 (관리자 본인은 통계 집계에서 제외)
const isAdminUser = (): boolean => {
  if (typeof window === 'undefined') return false;
  try {
    if (localStorage.getItem('sinabro_admin_session') === ADMIN_EMAIL) return true;
    const params = new URLSearchParams(window.location.search);
    if (params.get('admin') === 'true') return true;
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
 * job.ws.ai.kr 접속 및 체류 시간 자동 트래킹 Hook/초기화 함수
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

  // 2. 체류 시간(머문 시간) 주기적 누적 (15초 주기 + 페이지 벗어날 때)
  let lastFlushTime = Date.now();

  const flushDwellTime = async () => {
    const now = Date.now();
    const elapsed = Math.round((now - lastFlushTime) / 1000);
    lastFlushTime = now;

    if (elapsed <= 0) return;

    // 최대 4시간 초과 비정상 체류 방지
    const safeSeconds = Math.min(elapsed, 3600);

    try {
      const docRef = doc(db, ANALYTICS_COLLECTION, today);
      await setDoc(
        docRef,
        {
          contents: {
            [CONTENT_ID]: {
              totalDwellSeconds: increment(safeSeconds),
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

  // 15초마다 주기적으로 누적
  const intervalId = window.setInterval(flushDwellTime, 15000);

  // 탭 숨김 or 페이지 이탈 시 전송
  const handleVisibilityChange = () => {
    if (document.visibilityState === 'hidden') {
      flushDwellTime();
    } else {
      lastFlushTime = Date.now();
    }
  };

  const handleBeforeUnload = () => {
    flushDwellTime();
  };

  document.addEventListener('visibilitychange', handleVisibilityChange);
  window.addEventListener('beforeunload', handleBeforeUnload);

  // 정리(클린업) 함수
  return () => {
    window.clearInterval(intervalId);
    document.removeEventListener('visibilitychange', handleVisibilityChange);
    window.removeEventListener('beforeunload', handleBeforeUnload);
    flushDwellTime();
  };
};

