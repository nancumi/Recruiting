import { useState, useEffect } from 'react';
import {
  Sparkles,
  Zap,
  Cpu,
  Package,
  Layers,
  BarChart3,
  Flame,
  ArrowRight,
  Check,
  Tv,
  CalendarCheck,
  Building2,
  ChevronRight,
  Menu,
  X,
} from 'lucide-react';
import { ConsultationModal } from './components/ConsultationModal';
import { ToolDetailModal, type ToolItem } from './components/ToolDetailModal';
import { CORE_TOOLS } from './data/tools';
import { SearchInput } from './components/SearchInput';
import { Pagination } from './components/Pagination';
import { ScrollReveal } from './components/ScrollReveal';

export function App() {
  const [isConsultOpen, setIsConsultOpen] = useState(false);
  const [selectedTool, setSelectedTool] = useState<ToolItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [toolPage, setToolPage] = useState(1);
  const [showFloatingNav, setShowFloatingNav] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // 스크롤 시 플로팅 네비게이션 노출 및 활성 섹션 감지
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      if (scrollY > 300) {
        setShowFloatingNav(true);
      } else {
        setShowFloatingNav(false);
      }

      const sections = ['philosophy', 'competencies', 'tools', 'pricing', 'meeting'];
      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 200 && rect.bottom >= 200) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 검색 필터링된 도구 목록
  const filteredTools = CORE_TOOLS.filter((t) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      t.name.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q) ||
      t.shortDesc.toLowerCase().includes(q) ||
      t.fullDesc.toLowerCase().includes(q)
    );
  });

  const toolsPerPage = 3;
  const totalToolPages = Math.ceil(filteredTools.length / toolsPerPage) || 1;
  const currentTools = filteredTools.slice(
    (toolPage - 1) * toolsPerPage,
    toolPage * toolsPerPage
  );

  const handleToolSearch = (q: string) => {
    setSearchQuery(q);
    setToolPage(1);
  };

  const navItems = [
    { id: 'philosophy', label: '운영 철학' },
    { id: 'competencies', label: '수행 역량' },
    { id: 'tools', label: '자체 개발 툴' },
    { id: 'pricing', label: '서비스 요금' },
    { id: 'meeting', label: '대면 미팅' },
  ];

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">
      {/* 스크롤 시 나타나는 플로팅 메뉴바 (상단 고정 메뉴 제거 요청 반영) */}
      <div
        className={`fixed top-4 left-1/2 -translate-x-1/2 z-40 transition-all duration-500 w-[92%] max-w-4xl ${
          showFloatingNav
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 -translate-y-6 pointer-events-none'
        }`}
      >
        <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-700/80 rounded-2xl px-5 py-3 shadow-2xl flex items-center justify-between">
          <a href="#" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white flex items-center justify-center font-bold text-sm shadow-md">
              MD
            </div>
            <span className="font-bold text-white tracking-tight text-sm hidden sm:inline-block">
              15년 차 시니어 MD & AI 스페셜리스트
            </span>
          </a>

          {/* 데스크톱 메뉴 */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-950/60 p-1 rounded-xl border border-slate-800">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeSection === item.id
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsConsultOpen(true)}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-500 hover:bg-indigo-400 text-white transition-all shadow-md shadow-indigo-500/20 flex items-center gap-1.5"
            >
              <span>상담 신청</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {/* 모바일 햄버거 토글 */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
            >
              {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* 모바일 드롭다운 메뉴 */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-2 p-3 bg-slate-900 border border-slate-700/80 rounded-2xl shadow-xl flex flex-col gap-1">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`px-4 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  activeSection === item.id
                    ? 'bg-indigo-600 text-white font-bold'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                {item.label}
              </a>
            ))}
          </div>
        )}
      </div>

      {/* Hero 섹션 : 초대형 스케일 및 몰입감 극대화 */}
      <section className="relative min-h-[92vh] flex items-center justify-center pt-20 pb-24 overflow-hidden border-b border-slate-800/80">
        {/* 은은한 배경 글로우 */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[900px] h-[500px] bg-indigo-600/10 rounded-full blur-[130px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[110px] pointer-events-none" />

        <div className="max-w-6xl mx-auto px-6 sm:px-8 text-center relative z-10">
          <ScrollReveal delay={100}>
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-indigo-950/70 border border-indigo-800/70 text-indigo-300 font-semibold text-xs mb-8 shadow-inner">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>제조 회사 PM 및 MD팀장 11년 포함, 15년 차 커머스 총괄</span>
            </div>
          </ScrollReveal>

          {/* 메인 헤드라인 (밑줄 효과 삭제, 굵고 시원한 타이포) */}
          <ScrollReveal delay={200}>
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tight leading-[1.2] mb-8">
              판매 관리와 광고비 지출,
              <br />
              <span className="text-indigo-400">
                절대 '감'으로 판단하지 않습니다
              </span>
            </h1>
          </ScrollReveal>

          {/* 서브 카피 */}
          <ScrollReveal delay={300}>
            <p className="text-slate-300 max-w-4xl mx-auto text-base sm:text-xl font-normal leading-relaxed mb-12">
              업무의 90% 이상에 AI를 도입하고 전용 관리 프로그램을 직접 개발하여 활용합니다.
              <br />
              <span className="inline-block whitespace-nowrap">
                15년 실무 안목과 자체 자동화 기술로 남들보다{' '}
                <strong className="text-white font-bold">
                  2~3배 빠르고 정교하게
                </strong>{' '}
                효율적인 작업을 합니다.
              </span>
            </p>
          </ScrollReveal>

          {/* 핵심 지표 & 차별화 카드 4종 */}
          <ScrollReveal delay={400}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-5xl mx-auto mb-14 text-left">
              <div className="bg-slate-900/80 backdrop-blur-sm p-6 sm:p-7 rounded-3xl border border-slate-800 hover:border-indigo-500/50 transition-all shadow-xl hover:-translate-y-1">
                <div className="text-xs sm:text-sm font-semibold text-slate-400 mb-1">검증된 현장 경험</div>
                <div className="text-3xl sm:text-4xl font-black text-white mb-2">15년 차</div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  제조사 PM 및 MD팀장 11년 포함, 소싱부터 유통 채널 확장까지 풍부한 총괄 실무
                </p>
              </div>

              <div className="bg-slate-900/80 backdrop-blur-sm p-6 sm:p-7 rounded-3xl border border-slate-800 hover:border-indigo-500/50 transition-all shadow-xl hover:-translate-y-1">
                <div className="text-xs sm:text-sm font-semibold text-slate-400 mb-1">실무 AI 자동화 개발</div>
                <div className="text-3xl sm:text-4xl font-black text-indigo-400 mb-2">90%+</div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  단순 반복 수작업을 없애고 전용 프로그램을 직접 개발해 판매·광고를 정밀 분석
                </p>
              </div>

              <div className="bg-slate-900/80 backdrop-blur-sm p-6 sm:p-7 rounded-3xl border border-slate-800 hover:border-indigo-500/50 transition-all shadow-xl hover:-translate-y-1">
                <div className="text-xs sm:text-sm font-semibold text-slate-400 mb-1">초고속 상품 최적화</div>
                <div className="text-3xl sm:text-4xl font-black text-emerald-400 mb-2">4~5일</div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  상품 100개 기준 최적화를 4~5일 만에 완료하여 일반 작업자 대비 2~3배 빠른 시장 선점
                </p>
              </div>

              <div className="bg-slate-900/80 backdrop-blur-sm p-6 sm:p-7 rounded-3xl border border-slate-800 hover:border-indigo-500/50 transition-all shadow-xl hover:-translate-y-1">
                <div className="text-xs sm:text-sm font-semibold text-slate-400 mb-1">대규모 캠페인 밀착 핸들링</div>
                <div className="text-3xl sm:text-4xl font-black text-white mb-2">120개</div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  주력 채널 동시 운영, 실시간 누수 차단과 ROAS 극대화로 광고 효율 최적화
                </p>
              </div>
            </div>
          </ScrollReveal>

          {/* 최상단 서비스 신청 CTA 버튼 */}
          <ScrollReveal delay={500}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => setIsConsultOpen(true)}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-sm sm:text-base bg-indigo-500 hover:bg-indigo-400 text-white transition-all shadow-xl shadow-indigo-500/30 flex items-center justify-center gap-2 group hover:scale-[1.02]"
              >
                <span>대면 미팅 및 상담 신청하기</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <a
                href="#tools"
                className="w-full sm:w-auto px-7 py-4 rounded-2xl font-semibold text-sm sm:text-base bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all text-center hover:scale-[1.02]"
              >
                자체 개발 프로그램 둘러보기
              </a>
            </div>

            <p className="text-xs text-slate-400 mt-6 font-normal">
              * 수도권 지역은 대면 미팅을 통해 어떤 프로그램으로 어떻게 관리해 드리는지 직접 상세히 보여드립니다.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* 3. 왜 감이 아닌 시스템인가? (운영 철학 섹션) */}
      <section id="philosophy" className="py-24 max-w-6xl mx-auto px-6 sm:px-8">
        <ScrollReveal>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest bg-indigo-950/70 border border-indigo-800/60 px-3 py-1.5 rounded-full">
              Core Philosophy
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-4 mb-4 leading-snug">
              이커머스 성공의 본질은
              <br />
              '실시간 정량 데이터 대응'입니다
            </h2>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              광고비가 줄줄 새고 있는데 며칠 뒤 정산서를 보고 아셨습니까?
              <br />
              실제 판매 흐름과 광고비 관리는 체계적인 관리와 즉각적인 차단 및 집중이 필수적입니다.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 gap-8">
          {/* 전통적 방식의 문제점 */}
          <ScrollReveal delay={150}>
            <div className="bg-slate-900/60 p-8 rounded-3xl border border-rose-900/40 shadow-xl relative overflow-hidden h-full">
              <div className="w-1.5 h-full bg-rose-500 absolute left-0 top-0" />
              <div className="flex items-center gap-2 mb-4">
                <span className="px-3 py-1 rounded-lg bg-rose-950/70 border border-rose-800/50 text-rose-400 text-xs font-bold">
                  기존 일반 MD / 대행사 방식
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white mb-4">
                감이 앞서고, 엑셀 수작업 정리에 시간을 다 씁니다
              </h3>
              <ul className="space-y-3.5 text-slate-300 text-sm">
                <li className="flex items-start gap-3">
                  <span className="text-rose-400 font-black text-base shrink-0">✕</span>
                  <span>채널별 엑셀 다운로드 및 데이터 취합에만 매일 2~3시간씩 허비</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-rose-400 font-black text-base shrink-0">✕</span>
                  <span>비효율 광고 캠페인을 제때 차단하지 못해 누수 광고비 지속 발생</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-rose-400 font-black text-base shrink-0">✕</span>
                  <span>경쟁사의 가격 인하 및 품절 상황을 뒤늦게 파악하여 기회 상실</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-rose-400 font-black text-base shrink-0">✕</span>
                  <span>상품 100개 최적화에 2~3주 이상 소요되어 런칭 골든타임을 실기</span>
                </li>
              </ul>
            </div>
          </ScrollReveal>

          {/* AI 올라운더 MD 방식 */}
          <ScrollReveal delay={300}>
            <div className="bg-gradient-to-br from-indigo-950/40 to-slate-900/90 p-8 rounded-3xl border border-indigo-700/60 shadow-2xl relative overflow-hidden h-full">
              <div className="w-1.5 h-full bg-indigo-500 absolute left-0 top-0" />
              <div className="flex items-center gap-2 mb-4">
                <span className="px-3 py-1 rounded-lg bg-indigo-950/90 border border-indigo-600/70 text-indigo-300 text-xs font-bold">
                  15년 차 시니어 MD + 자체 AI 솔루션
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white mb-4">
                루틴은 자동화하고, '매출 성장 전략'에만 집중합니다
              </h3>
              <ul className="space-y-3.5 text-slate-200 text-sm">
                <li className="flex items-start gap-3">
                  <span className="text-emerald-400 font-black text-base shrink-0">✓</span>
                  <span>자체 개발 툴로 일일 판매 흐름을 자동 수집하여 3초 만에 시각화</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-emerald-400 font-black text-base shrink-0">✓</span>
                  <span>ROAS 미달 캠페인을 실시간 식별 및 광고비 누수 즉각 차단</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-emerald-400 font-black text-base shrink-0">✓</span>
                  <span>경쟁사 가격·리뷰 변동 모니터링으로 최적의 프로모션 제안</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-emerald-400 font-black text-base shrink-0">✓</span>
                  <span>상품 최적화 100개 기준 단 4~5일 만에 완료</span>
                </li>
              </ul>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 4. 작업 가능한 8대 핵심 섹션 (수행 역량 전체 조망) */}
      <section id="competencies" className="py-24 bg-slate-950/70 border-y border-slate-800/80">
        <div className="max-w-6xl mx-auto px-6 sm:px-8">
          <ScrollReveal>
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest bg-indigo-950/70 border border-indigo-800/60 px-3 py-1.5 rounded-full">
                Full-Stack MD Competencies
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-4 mb-4">
                이커머스 전 과정을 원스톱으로 직접 수행합니다
              </h2>
              <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                소싱부터 상세페이지 제작, 판매/재고 관리, 대규모 광고, 자연 유입 마케팅까지
                <br />
                한 영역에 치우치지 않고 비즈니스 전체를 유기적으로 연결해 드립니다.
              </p>
            </div>
          </ScrollReveal>

          {/* 8대 역량 그리드 카드 */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* 1. AI 업무 자동화 */}
            <ScrollReveal delay={100}>
              <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 hover:border-indigo-500/60 hover:shadow-xl transition-all flex flex-col justify-between h-full group">
                <div>
                  <div className="w-11 h-11 rounded-2xl bg-indigo-950 text-indigo-400 border border-indigo-800/60 flex items-center justify-center mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-base text-white mb-2">
                    01. AI & 자동화 툴 개발
                  </h3>
                  <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-4">
                    실무의 90% 이상에 AI 도입. 판매 트래킹, 광고 누수 분석, 경쟁사 가격 모니터링 등 전용 프로그램을 직접 개발해 운용합니다.
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-800 text-xs text-indigo-400 font-semibold">
                  일반 작업자 대비 2~3배 빠른 처리
                </div>
              </div>
            </ScrollReveal>

            {/* 2. 상품 소싱 & 채널 확장 */}
            <ScrollReveal delay={150}>
              <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 hover:border-emerald-500/60 hover:shadow-xl transition-all flex flex-col justify-between h-full group">
                <div>
                  <div className="w-11 h-11 rounded-2xl bg-emerald-950 text-emerald-400 border border-emerald-800/60 flex items-center justify-center mb-4 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                    <Package className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-base text-white mb-2">
                    02. 상품 소싱 & 기획
                  </h3>
                  <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-4">
                    15년 현장 경력으로 검증된 소싱 안목. 제품별 최적 유통 채널 매칭으로 초기 노출을 극대화하고 빠른 매출 볼륨을 확보합니다.
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-800 text-xs text-emerald-400 font-semibold">
                  검증된 시장성 및 채널 확장
                </div>
              </div>
            </ScrollReveal>

            {/* 3. 일일 판매관리 & 전략 */}
            <ScrollReveal delay={200}>
              <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 hover:border-blue-500/60 hover:shadow-xl transition-all flex flex-col justify-between h-full group">
                <div>
                  <div className="w-11 h-11 rounded-2xl bg-blue-950 text-blue-400 border border-blue-800/60 flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <BarChart3 className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-base text-white mb-2">
                    03. 판매관리 & 전략 수립
                  </h3>
                  <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-4">
                    자체 개발 프로그램을 통한 일일 판매 데이터 분석. 감이 아닌 정량 지표를 바탕으로 기민한 판매 전략과 상품 컨디션을 관리합니다.
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-800 text-xs text-blue-400 font-semibold">
                  일일 판매 흐름 & 이상 징후 추적
                </div>
              </div>
            </ScrollReveal>

            {/* 4. 초고속 상품 최적화 */}
            <ScrollReveal delay={250}>
              <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 hover:border-amber-500/60 hover:shadow-xl transition-all flex flex-col justify-between h-full group">
                <div>
                  <div className="w-11 h-11 rounded-2xl bg-amber-950 text-amber-400 border border-amber-800/60 flex items-center justify-center mb-4 group-hover:bg-amber-600 group-hover:text-white transition-all">
                    <Zap className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-base text-white mb-2">
                    04. 초고속 상품 최적화
                  </h3>
                  <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-4">
                    매출 성장의 필수 선행 작업인 기초 상품 등록 및 알고리즘 최적화를 100개 기준 단 4~5일 만에 완료하여 시장 기회를 선점합니다.
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-800 text-xs text-amber-400 font-semibold">
                  100개 기준 4~5일 완료 노하우
                </div>
              </div>
            </ScrollReveal>

            {/* 5. 상세페이지 기획/제작 */}
            <ScrollReveal delay={300}>
              <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 hover:border-purple-500/60 hover:shadow-xl transition-all flex flex-col justify-between h-full group">
                <div>
                  <div className="w-11 h-11 rounded-2xl bg-purple-950 text-purple-400 border border-purple-800/60 flex items-center justify-center mb-4 group-hover:bg-purple-600 group-hover:text-white transition-all">
                    <Layers className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-base text-white mb-2">
                    05. 상세페이지 원스톱 제작
                  </h3>
                  <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-4">
                    고객 리뷰 분석 기반 고전환 기획. 실물 제품과 스마트폰만으로 스튜디오 퀄리티의 상세페이지를 2~3일 내 단독 기획·제작합니다.
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-800 text-xs text-purple-400 font-semibold">
                  구매전환율 극대화 중심 기획
                </div>
              </div>
            </ScrollReveal>

            {/* 6. 광고 세팅 & 일일 핸들링 */}
            <ScrollReveal delay={350}>
              <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 hover:border-rose-500/60 hover:shadow-xl transition-all flex flex-col justify-between h-full group">
                <div>
                  <div className="w-11 h-11 rounded-2xl bg-rose-950 text-rose-400 border border-rose-800/60 flex items-center justify-center mb-4 group-hover:bg-rose-600 group-hover:text-white transition-all">
                    <Flame className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-base text-white mb-2">
                    06. 광고 운영 & ROAS 극대화
                  </h3>
                  <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-4">
                    주력 채널, 120개 캠페인 단독 운영 실전 경험. 전용 분석 툴로 누수 광고비를 즉각 차단하고 목표 ROAS를 달성합니다.
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-800 text-xs text-rose-400 font-semibold">
                  120개 캠페인 밀착 핸들링
                </div>
              </div>
            </ScrollReveal>

            {/* 7. 행사 제안 & 프로모션 */}
            <ScrollReveal delay={400}>
              <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 hover:border-teal-500/60 hover:shadow-xl transition-all flex flex-col justify-between h-full group">
                <div>
                  <div className="w-11 h-11 rounded-2xl bg-teal-950 text-teal-400 border border-teal-800/60 flex items-center justify-center mb-4 group-hover:bg-teal-600 group-hover:text-white transition-all">
                    <CalendarCheck className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-base text-white mb-2">
                    07. 행사 제안 & 일정 조율
                  </h3>
                  <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-4">
                    플랫폼 알고리즘 맞춤 행사 기획. 담당자 직접 협업 감소 트렌드에 맞춰 채널별 자체 행사 로직을 파악하고 노출을 극대화합니다.
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-800 text-xs text-teal-400 font-semibold">
                  주요 쇼핑몰 프로모션 총괄
                </div>
              </div>
            </ScrollReveal>

            {/* 8. 무비용 자연 유입 */}
            <ScrollReveal delay={450}>
              <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 hover:border-orange-500/60 hover:shadow-xl transition-all flex flex-col justify-between h-full group">
                <div>
                  <div className="w-11 h-11 rounded-2xl bg-orange-950 text-orange-400 border border-orange-800/60 flex items-center justify-center mb-4 group-hover:bg-orange-600 group-hover:text-white transition-all">
                    <Tv className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-base text-white mb-2">
                    08. 광고 없는 외부 유입
                  </h3>
                  <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-4">
                    유튜브 2개 채널을 직접 기획·운영하여 각각 구독자 2천 명까지 성장시킨 실전 노하우. 유료 광고비 없이 자사몰 오가닉 유입을 유도합니다.
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-800 text-xs text-orange-400 font-semibold">
                  SNS 알고리즘 & 자연 유입
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* 5. 자체 개발 프로그램 쇼케이스 (검색창, 모달창, 페이지네이션 탑재) */}
      <section id="tools" className="py-24 max-w-6xl mx-auto px-6 sm:px-8">
        <ScrollReveal>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest bg-indigo-950/70 border border-indigo-800/60 px-3 py-1.5 rounded-full">
                Proprietary Tools
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-4 mb-2">
                실무에 직접 사용하는 자체 개발 프로그램
              </h2>
              <p className="text-slate-400 text-sm sm:text-base">
                "저희는 이런 프로그램을 사용하여 판매흐름 분석과 광고관리를 하고 있습니다."
              </p>
            </div>

            {/* 검색창 컴포넌트 (규격 준수) */}
            <div className="w-full md:w-80">
              <SearchInput
                placeholder="프로그램명 또는 기능 검색..."
                onSearch={handleToolSearch}
              />
            </div>
          </div>
        </ScrollReveal>

        {/* 프로그램 목록 카드 */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {currentTools.length > 0 ? (
            currentTools.map((tool, idx) => (
              <ScrollReveal key={tool.id} delay={idx * 100}>
                <div
                  onClick={() => setSelectedTool(tool)}
                  className="bg-slate-900 p-7 rounded-3xl border border-slate-800 hover:border-indigo-500/70 hover:shadow-2xl transition-all cursor-pointer flex flex-col justify-between h-full group hover:-translate-y-1"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-semibold text-indigo-400 bg-indigo-950 border border-indigo-800/60 px-2.5 py-1 rounded-lg">
                        {tool.category}
                      </span>
                      <span className="text-xs text-slate-500 group-hover:text-indigo-400 flex items-center gap-0.5 transition-colors">
                        상세보기
                        <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                    <h3 className="font-bold text-base sm:text-lg text-white mb-3 group-hover:text-indigo-400 transition-colors">
                      {tool.name}
                    </h3>
                    <p className="text-slate-400 text-xs sm:text-sm leading-relaxed line-clamp-3 mb-6">
                      {tool.shortDesc}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-800/80 flex flex-wrap gap-1.5">
                    {tool.techStack.slice(0, 3).map((t, index) => (
                      <span
                        key={index}
                        className="px-2.5 py-1 rounded-md bg-slate-800 border border-slate-700/60 text-slate-300 text-xs font-medium"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            ))
          ) : (
            <div className="col-span-3 py-16 text-center text-slate-500 bg-slate-900/40 rounded-3xl border border-slate-800">
              검색된 프로그램이 없습니다.
            </div>
          )}
        </div>

        {/* 페이지네이션 (<< < 1 2 3 4 5 > >> 5개 블록 규격 준수) */}
        <Pagination
          currentPage={toolPage}
          totalPages={totalToolPages}
          onPageChange={(page) => setToolPage(page)}
        />
      </section>

      {/* 6. 서비스 요금 안내 (Pricing - 채널 1개 기준) */}
      <section id="pricing" className="py-24 bg-slate-950/70 border-t border-slate-800/80">
        <div className="max-w-6xl mx-auto px-6 sm:px-8">
          <ScrollReveal>
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest bg-indigo-950/70 border border-indigo-800/60 px-3 py-1.5 rounded-full">
                Transparent Pricing
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-4 mb-3">
                합리적이고 투명한 서비스 요금
              </h2>
              <div className="inline-block bg-slate-800 border border-slate-700 px-4 py-1.5 rounded-full text-xs font-semibold text-slate-300">
                ※ 채널 1개 기준 요금입니다
              </div>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-8">
            {/* 플랜 1: 판매관리 */}
            <ScrollReveal delay={100}>
              <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 shadow-xl flex flex-col justify-between h-full">
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase mb-1">Plan A</div>
                  <h3 className="text-xl font-bold text-white mb-3">판매관리</h3>
                  <div className="flex items-baseline gap-1.5 mb-5">
                    <span className="text-3xl sm:text-4xl font-black text-white">200,000</span>
                    <span className="text-sm text-slate-400">원 / 월</span>
                  </div>
                  <p className="text-slate-400 text-xs sm:text-sm mb-6 pb-6 border-b border-slate-800 leading-relaxed">
                    일일 판매 데이터 추적과 프로모션 최적화로 상품 컨디션을 완벽히 관리합니다.
                  </p>
                  <ul className="space-y-3.5 text-slate-300 text-xs sm:text-sm">
                    <li className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>상품등록 최적화 (검색 알고리즘 매칭)</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>일일 판매흐름 분석 및 판매 전략 수립</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>채널별 프로모션 기획 & 행사 진행/관리</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-8">
                  <button
                    onClick={() => setIsConsultOpen(true)}
                    className="w-full py-3.5 rounded-2xl text-xs sm:text-sm font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
                  >
                    판매관리 신청하기
                  </button>
                </div>
              </div>
            </ScrollReveal>

            {/* 플랜 2: 광고관리 */}
            <ScrollReveal delay={200}>
              <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 shadow-xl flex flex-col justify-between h-full">
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase mb-1">Plan B</div>
                  <h3 className="text-xl font-bold text-white mb-3">광고관리</h3>
                  <div className="flex items-baseline gap-1.5 mb-5">
                    <span className="text-3xl sm:text-4xl font-black text-white">200,000</span>
                    <span className="text-sm text-slate-400">원 / 월</span>
                  </div>
                  <p className="text-slate-400 text-xs sm:text-sm mb-6 pb-6 border-b border-slate-800 leading-relaxed">
                    자체 분석 툴로 누수 광고비를 즉각 차단하고 목표 ROAS를 달성합니다.
                  </p>
                  <ul className="space-y-3.5 text-slate-300 text-xs sm:text-sm">
                    <li className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                      <span>캠페인별 세밀한 키워드 광고 세팅</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                      <span>목표 ROAS에 따른 지속적 광고 운영</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                      <span>광고비 누수 없는 밀착 실시간 핸들링</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-8">
                  <button
                    onClick={() => setIsConsultOpen(true)}
                    className="w-full py-3.5 rounded-2xl text-xs sm:text-sm font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
                  >
                    광고관리 신청하기
                  </button>
                </div>
              </div>
            </ScrollReveal>

            {/* 플랜 3: 판매관리 + 광고 (인기 결합 상품) */}
            <ScrollReveal delay={300}>
              <div className="bg-gradient-to-b from-indigo-950/60 to-slate-900 p-8 rounded-3xl border-2 border-indigo-500 shadow-2xl flex flex-col justify-between h-full relative">
                <div className="absolute -top-3.5 right-8 bg-indigo-500 text-white text-xs font-extrabold px-3.5 py-1 rounded-full shadow-md">
                  가장 추천 (BEST)
                </div>
                <div>
                  <div className="text-xs font-bold text-indigo-400 uppercase mb-1">
                    Plan C (All-in-One)
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">판매관리 + 광고</h3>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-3xl sm:text-4xl font-black text-indigo-400">300,000</span>
                    <span className="text-sm text-slate-400">원 / 월</span>
                    <span className="ml-2 text-xs text-rose-400 line-through">400,000원</span>
                  </div>
                  <p className="text-slate-300 text-xs sm:text-sm mb-6 pb-6 border-b border-indigo-900/60 leading-relaxed">
                    판매 관리와 광고 집행을 하나로 결합하여 시너지를 극대화하는 올인원 플랜입니다.
                  </p>
                  <ul className="space-y-3.5 text-slate-200 text-xs sm:text-sm">
                    <li className="flex items-start gap-2.5 font-medium">
                      <Check className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                      <span>판매관리 전 항목 포함 (상품등록, 분석, 행사)</span>
                    </li>
                    <li className="flex items-start gap-2.5 font-medium">
                      <Check className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                      <span>광고관리 전 항목 포함 (세팅, ROAS, 누수차단)</span>
                    </li>
                    <li className="flex items-start gap-2.5 text-indigo-300 font-bold">
                      <Check className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                      <span>월 100,000원 결합 할인 혜택 제공</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-8">
                  <button
                    onClick={() => setIsConsultOpen(true)}
                    className="w-full py-3.5 rounded-2xl text-xs sm:text-sm font-bold bg-indigo-500 hover:bg-indigo-400 text-white transition-all shadow-lg shadow-indigo-500/30"
                  >
                    올인원 플랜 신청하기
                  </button>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* 7. 대면 미팅 약속 섹션 */}
      <section id="meeting" className="py-24 max-w-5xl mx-auto px-6 sm:px-8">
        <ScrollReveal>
          <div className="bg-gradient-to-br from-indigo-950/60 via-slate-900 to-slate-950 p-10 sm:p-14 rounded-3xl border border-indigo-800/60 text-center space-y-6 shadow-2xl relative overflow-hidden">
            <div className="w-16 h-16 bg-indigo-950 text-indigo-400 border border-indigo-700/60 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
              <Building2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              수도권 지역은 직접 찾아뵙고 시연해 드립니다
            </h3>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
              "어떤 프로그램으로 어떻게 관리해 드린다는 건지 눈으로 직접 확인해 보세요."
              <br />
              현재 운영 중이신 쇼핑몰의 현주소를 진단해 드리고, 맞춤형 개선안을 직접 대면으로 설명해 드립니다.
            </p>
            <div className="pt-4">
              <button
                onClick={() => setIsConsultOpen(true)}
                className="px-8 py-4 rounded-2xl text-sm font-bold bg-indigo-500 hover:bg-indigo-400 text-white transition-all shadow-xl shadow-indigo-500/30 inline-flex items-center gap-2 hover:scale-[1.02]"
              >
                <span>대면 미팅 일정 문의하기</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* 8. 최하단 CTA 및 푸터 */}
      <footer className="bg-slate-950 text-slate-400 py-16 border-t border-slate-800/80">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">
                MD
              </div>
              <span className="text-white font-bold text-lg">
                15년 차 시니어 MD & AI 자동화 파트너
              </span>
            </div>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              제조 회사 PM 및 MD팀장 11년 포함, 15년 차 커머스 전문 디렉터
              <br />
              데이터 기반 실시간 실행력으로 귀사의 매출 성장을 견인합니다.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
            <button
              onClick={() => setIsConsultOpen(true)}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-sm bg-indigo-500 hover:bg-indigo-400 text-white transition-all shadow-xl shadow-indigo-500/20"
            >
              화면 최하단 상담 신청하기
            </button>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-6 sm:px-8 mt-12 pt-8 border-t border-slate-900 text-center text-xs text-slate-500">
          © 2026 유니드 & AI Automation. All rights reserved.
        </div>
      </footer>

      {/* 모달창 컴포넌트들 (규격 준수: 바깥 클릭 시 종료, 마우스 모양 유지, 버튼 12px 파스텔톤) */}
      <ConsultationModal
        isOpen={isConsultOpen}
        onClose={() => setIsConsultOpen(false)}
      />

      <ToolDetailModal
        tool={selectedTool}
        onClose={() => setSelectedTool(null)}
        onRequestConsult={() => setIsConsultOpen(true)}
      />
    </div>
  );
}

export default App;
