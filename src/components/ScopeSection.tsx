import { useState, useRef, useEffect } from 'react';
import {
  TrendingUp,
  Eye,
  Flame,
  Check,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  ChevronDown,
  Building2,
  ExternalLink,
  Star,
} from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';
import type { ServiceTypeOption } from './ConsultationModal';

type ScopeType = 'sales' | 'competitor' | 'ad' | null;

interface ScopeSectionProps {
  onOpenConsult: (type: ServiceTypeOption) => void;
}

export function ScopeSection({ onOpenConsult }: ScopeSectionProps) {
  // 현재 펼쳐져 있는 섹션 상태 (초기 기본값: 판매관리 펼쳐진 상태)
  const [activeScope, setActiveScope] = useState<ScopeType>('sales');
  // 우측 슬롯(경쟁사/광고 공용 슬롯)이 닫히는 동안에도 차트가 증발하지 않도록 마지막 뷰 유지
  const [rightSlotView, setRightSlotView] = useState<'competitor' | 'ad'>('competitor');

  // 각 섹션별 1번 / 2번 탭 상태
  const [salesSubTab, setSalesSubTab] = useState<1 | 2>(1);
  const [competitorSubTab, setCompetitorSubTab] = useState<1 | 2>(1);
  const [adSubTab, setAdSubTab] = useState<1 | 2>(1);

  // 데이터 프리뷰 영역에 마우스 오버 시 롤링 일시정지 상태
  const [isPreviewHovered, setIsPreviewHovered] = useState(false);

  const transitionTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (transitionTimerRef.current) {
        window.clearTimeout(transitionTimerRef.current);
      }
    };
  }, []);

  // 열려 있는 섹션의 1번 / 2번 데이터 5초마다 자동 롤링 (데이터에 마우스 올리면 일시정지)
  useEffect(() => {
    if (!activeScope || isPreviewHovered) return;
    const timer = window.setInterval(() => {
      if (activeScope === 'sales') {
        setSalesSubTab((prev) => (prev === 1 ? 2 : 1));
      } else if (activeScope === 'competitor') {
        setCompetitorSubTab((prev) => (prev === 1 ? 2 : 1));
      } else if (activeScope === 'ad') {
        setAdSubTab((prev) => (prev === 1 ? 2 : 1));
      }
    }, 5000);
    return () => window.clearInterval(timer);
  }, [activeScope, isPreviewHovered, salesSubTab, competitorSubTab, adSubTab]);

  const handleToggleScope = (target: Exclude<ScopeType, null>) => {
    if (transitionTimerRef.current) {
      window.clearTimeout(transitionTimerRef.current);
      transitionTimerRef.current = null;
    }

    // 1. 이미 열려 있는 같은 카드의 '닫기' 버튼을 누른 경우 -> 반대로 오므라들며 닫힘
    if (activeScope === target) {
      setActiveScope(null);
      return;
    }

    // 2. 아무것도 안 열려 있는 상태에서 '자세히보기'를 누른 경우 -> 즉시 양옆으로 벌어지며 열림
    if (activeScope === null) {
      if (target === 'competitor' || target === 'ad') {
        setRightSlotView(target);
      }
      setActiveScope(target);
      return;
    }

    // 3. 이미 다른 섹션이 열려 있는 상태에서 다른 '자세히보기'를 누른 경우
    // -> 먼저 반대로 닫히는 애니메이션 후, 다시 양옆으로 벌어지며 새로운 데이터 표시
    setActiveScope(null);
    transitionTimerRef.current = window.setTimeout(() => {
      if (target === 'competitor' || target === 'ad') {
        setRightSlotView(target);
      }
      setActiveScope(target);
      transitionTimerRef.current = null;
    }, 380);
  };

  const isExpanded = activeScope !== null;

  // 상단 중앙 1, 2 전환 버튼 컴포넌트
  const renderSubTabButtons = (
    currentTab: 1 | 2,
    onSelect: (tab: 1 | 2) => void,
    theme: 'emerald' | 'blue' | 'purple'
  ) => {
    const activeStyles = {
      emerald: 'bg-emerald-100 text-emerald-900 border-emerald-300 shadow-xs',
      blue: 'bg-blue-100 text-blue-900 border-blue-300 shadow-xs',
      purple: 'bg-purple-100 text-purple-900 border-purple-300 shadow-xs',
    }[theme];

    return (
      <div className="flex items-center justify-center mb-3 shrink-0">
        <div className="inline-flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            type="button"
            onClick={() => onSelect(1)}
            className={`w-7 h-7 rounded-lg text-[12px] font-bold border transition-all cursor-pointer flex items-center justify-center ${
              currentTab === 1
                ? activeStyles
                : 'bg-white text-slate-500 border-transparent hover:text-slate-800'
            }`}
          >
            1
          </button>
          <button
            type="button"
            onClick={() => onSelect(2)}
            className={`w-7 h-7 rounded-lg text-[12px] font-bold border transition-all cursor-pointer flex items-center justify-center ${
              currentTab === 2
                ? activeStyles
                : 'bg-white text-slate-500 border-transparent hover:text-slate-800'
            }`}
          >
            2
          </button>
        </div>
      </div>
    );
  };

  // ============================================================================
  // 1. 판매관리 상세 프리뷰 (1번과 2번 높이를 380px로 완전 통일)
  // ============================================================================
  const renderSalesPreview = () => {
    const salesRows = [
      {
        rank: 1,
        name: '초고농축 실내건조 세탁세제 2.5L',
        id: '94689020754',
        totalSales: '174개',
        totalViews: '2,426 (7.2%)',
        totalAdCost: '98,500원',
        totalRevenue: '1,993,600원',
        days: [
          { qty: '10개', diff: '▲2', diffType: 'up', views: '192', ad: '5,900원', rev: '119,000원', bar: 68 },
          { qty: '10개', diff: '▲5', diffType: 'up', views: '167', ad: '6,100원', rev: '119,000원', bar: 68 },
          { qty: '10개', diff: '▼8', diffType: 'down', views: '181', ad: '5,800원', rev: '119,000원', bar: 68 },
          { qty: '12개', diff: '▼15', diffType: 'down', views: '197', ad: '7,200원', rev: '143,800원', bar: 82 },
          { qty: '12개', diff: '▼7', diffType: 'down', views: '174', ad: '7,100원', rev: '142,800원', bar: 82 },
        ],
      },
      {
        rank: 2,
        name: '호텔식 코마사 순면 수건 200g 10매',
        id: '94689203400',
        totalSales: '97개',
        totalViews: '677 (14.3%)',
        totalAdCost: '69,700원',
        totalRevenue: '1,393,900원',
        days: [
          { qty: '3개', diff: '▼5', diffType: 'down', views: '34', ad: '1,900원', rev: '38,100원', bar: 24 },
          { qty: '4개', diff: '▼6', diffType: 'down', views: '28', ad: '2,500원', rev: '50,800원', bar: 32 },
          { qty: '8개', diff: '▼5', diffType: 'down', views: '35', ad: '5,100원', rev: '101,600원', bar: 60 },
          { qty: '3개', diff: '▼6', diffType: 'down', views: '38', ad: '2,100원', rev: '42,100원', bar: 26 },
          { qty: '3개', diff: '▼2', diffType: 'down', views: '35', ad: '2,200원', rev: '44,100원', bar: 28 },
        ],
      },
      {
        rank: 3,
        name: '대용량 베이킹소다 주방세제 1.2L 3개',
        id: '93987466398',
        totalSales: '35개',
        totalViews: '738 (4.7%)',
        totalAdCost: '51,300원',
        totalRevenue: '1,026,500원',
        days: [
          { qty: '0개', diff: '', diffType: 'none', views: '16', ad: '900원', rev: '0원', bar: 0 },
          { qty: '3개', diff: '▲1', diffType: 'up', views: '33', ad: '4,800원', rev: '95,700원', bar: 55 },
          { qty: '4개', diff: '▼5', diffType: 'down', views: '24', ad: '6,400원', rev: '127,600원', bar: 74 },
          { qty: '2개', diff: '▲1', diffType: 'up', views: '13', ad: '3,200원', rev: '63,800원', bar: 38 },
          { qty: '3개', diff: '', diffType: 'none', views: '19', ad: '4,800원', rev: '95,700원', bar: 55 },
        ],
      },
    ];

    const salesChartData = [
      { date: '11/02(월)', revH: 100, salesY: 110, adY: 207 },
      { date: '11/03(화)', revH: 120, salesY: 110, adY: 205 },
      { date: '11/04(수)', revH: 108, salesY: 120, adY: 211 },
      { date: '11/05(목)', revH: 98, salesY: 130, adY: 179 },
      { date: '11/06(금)', revH: 175, salesY: 50, adY: 179 },
      { date: '11/07(토)', revH: 110, salesY: 110, adY: 182 },
      { date: '11/08(일)', revH: 88, salesY: 130, adY: 180 },
      { date: '11/09(월)', revH: 110, salesY: 110, adY: 186 },
      { date: '11/10(화)', revH: 188, salesY: 30, adY: 188 },
      { date: '11/11(수)', revH: 110, salesY: 110, adY: 202 },
      { date: '11/12(목)', revH: 45, salesY: 170, adY: 207 },
      { date: '11/13(금)', revH: 87, salesY: 140, adY: 217 },
      { date: '11/14(토)', revH: 45, salesY: 180, adY: 220 },
    ];
    const getSalesX = (idx: number) => 68 + idx * 52;

    const buildSmoothPath = (pts: { x: number; y: number }[]) => {
      let d = `M ${pts[0].x} ${pts[0].y}`;
      for (let i = 0; i < pts.length - 1; i++) {
        const curr = pts[i];
        const next = pts[i + 1];
        const midX = (curr.x + next.x) / 2;
        d += ` C ${midX} ${curr.y}, ${midX} ${next.y}, ${next.x} ${next.y}`;
      }
      return d;
    };

    const salesPts = salesChartData.map((d, i) => ({ x: getSalesX(i), y: d.salesY }));
    const adPts = salesChartData.map((d, i) => ({ x: getSalesX(i), y: d.adY }));

    return (
      <div
        onMouseEnter={() => setIsPreviewHovered(true)}
        onMouseLeave={() => setIsPreviewHovered(false)}
        className="bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden text-slate-800 p-4 sm:p-5"
      >
        {/* 상단 중앙 1, 2 버튼 */}
        {renderSubTabButtons(salesSubTab, setSalesSubTab, 'emerald')}

        {/* 1번과 2번 모두 동일한 높이(h-[372px]) 컨테이너를 사용하여 전환 시 높낮이 변동 0% */}
        <div className="h-[372px] flex flex-col">
          {salesSubTab === 1 ? (
            <div className="border border-slate-200 rounded-xl overflow-hidden h-full flex flex-col justify-between">
              {/* 상단 타이틀 바 */}
              <div className="px-4 py-2.5 bg-white border-b border-slate-200 flex items-baseline gap-2 overflow-hidden shrink-0">
                <h4 className="font-extrabold text-slate-900 text-sm sm:text-[15px] whitespace-nowrap shrink-0">
                  옵션별 일자별 판매 흐름표 (총 42개 옵션)
                </h4>
                <span className="text-[11px] text-slate-500 whitespace-nowrap truncate">
                  · 행 클릭 시 상단 추이 그래프 연동 · 표 좌우 드래그 이동 가능 · 증감 숫자는 1주 전 기준
                </span>
              </div>

              {/* 테이블 영역 */}
              <div className="overflow-hidden flex-1 flex flex-col">
                <table className="w-full h-full border-collapse text-left">
                  <thead>
                    <tr className="bg-[#f8fafc] border-b border-slate-200 text-[12px]">
                      <th className="py-2 px-3 font-bold text-slate-700 border-r border-slate-200 w-[165px]">
                        상품명 / 옵션 ID
                      </th>
                      <th className="py-2 px-3 font-bold text-slate-800 bg-[#f1f6fe] border-r-2 border-slate-300 text-right w-[125px]">
                        <div>기간 합계</div>
                        <div className="text-[11px] font-medium text-blue-600 mt-0.5 whitespace-nowrap">
                          판매 / 조회 / 광고비 / 매출
                        </div>
                      </th>
                      <th className="py-1.5 px-2.5 text-right border-r border-slate-200">
                        <div className="font-bold text-slate-900">11/14(토)</div>
                        <div className="text-[11px] font-normal text-slate-500">총 40개</div>
                        <div className="text-[11px] font-medium text-slate-600">506,400원</div>
                      </th>
                      <th className="py-1.5 px-2.5 text-right border-r border-slate-200">
                        <div className="font-bold text-slate-900">11/13(금)</div>
                        <div className="text-[11px] font-normal text-slate-500">총 45개</div>
                        <div className="text-[11px] font-medium text-slate-600">691,800원</div>
                      </th>
                      <th className="py-1.5 px-2.5 text-right border-r border-slate-200">
                        <div className="font-bold text-slate-900">11/12(목)</div>
                        <div className="text-[11px] font-normal text-slate-500">총 52개</div>
                        <div className="text-[11px] font-medium text-slate-600">813,600원</div>
                      </th>
                      <th className="py-1.5 px-2.5 text-right border-r border-slate-200">
                        <div className="font-bold text-slate-900">11/11(수)</div>
                        <div className="text-[11px] font-normal text-slate-500">총 51개</div>
                        <div className="text-[11px] font-medium text-slate-600">722,400원</div>
                      </th>
                      <th className="py-1.5 px-2.5 text-right">
                        <div className="font-bold text-slate-900">11/10(화)</div>
                        <div className="text-[11px] font-normal text-slate-500">총 42개</div>
                        <div className="text-[11px] font-medium text-slate-600">635,000원</div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-[12px]">
                    {salesRows.map((row) => (
                      <tr key={row.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-2 px-3 border-r border-slate-200 align-middle">
                          <div className="flex items-start gap-2">
                            <span
                              className="w-5 h-5 rounded-md flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5 bg-blue-50 text-blue-600 border border-blue-200"
                            >
                              {row.rank}
                            </span>
                            <div>
                              <div className="font-bold text-slate-900 leading-snug">{row.name}</div>
                              <div className="text-[11px] text-slate-400 mt-0.5">ID: {row.id}</div>
                            </div>
                          </div>
                        </td>

                        <td className="py-2 px-3 bg-[#f8fbff] border-r-2 border-slate-300 text-right align-middle space-y-0.5 whitespace-nowrap">
                          <div className="font-bold text-blue-600">판매 {row.totalSales}</div>
                          <div className="text-[11px] text-slate-500">조회 {row.totalViews}</div>
                          <div className="text-[11px] font-semibold text-slate-600">
                            광고비 {row.totalAdCost}
                          </div>
                          <div className="font-bold text-emerald-600">{row.totalRevenue}</div>
                        </td>

                        {row.days.map((d, i) => (
                          <td
                            key={i}
                            className="py-1.5 px-2.5 text-right border-r border-slate-100 last:border-r-0 align-bottom whitespace-nowrap"
                          >
                            <div className="space-y-0.5">
                              <div className="font-bold text-blue-600">
                                {d.qty === '0개' ? (
                                  <span className="text-slate-400 font-normal">0개</span>
                                ) : (
                                  <>
                                    <span>{d.qty}</span>{' '}
                                    {d.diff && (
                                      <span
                                        className={`text-[11px] font-bold ${
                                          d.diffType === 'up' ? 'text-rose-500' : 'text-blue-500'
                                        }`}
                                      >
                                        {d.diff}
                                      </span>
                                    )}
                                  </>
                                )}
                              </div>
                              <div className="text-[11px] text-slate-500">조회 {d.views}</div>
                              <div className="text-[11px] text-slate-500">광고 {d.ad}</div>
                              <div
                                className={`font-bold ${
                                  d.rev === '0원' ? 'text-slate-300 font-normal' : 'text-emerald-600'
                                }`}
                              >
                                {d.rev}
                              </div>
                            </div>
                            <div className="w-full h-1 bg-slate-100 rounded-full mt-1 overflow-hidden">
                              <div
                                className="h-full bg-blue-500 rounded-full"
                                style={{ width: `${d.bar}%` }}
                              />
                            </div>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            /* 판매관리 2번: 3번 이미지 데이터 (전체 옵션 일자별 추이 차트) */
            <div className="border border-slate-200 rounded-xl p-4 h-full flex flex-col justify-between">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 text-[11px] font-bold shrink-0">
                    채널 전체 합계 추이
                  </span>
                  <h4 className="font-extrabold text-slate-900 text-sm sm:text-base truncate">
                    데일리홈 생활용품 전체 옵션 일자별 추이
                  </h4>
                </div>
                <div className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-[12px] font-semibold text-slate-700 flex items-center gap-2 shrink-0">
                  <span>전체 옵션 합계 그래프 보기</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                </div>
              </div>

              <div className="overflow-hidden my-auto">
                <svg viewBox="0 0 810 245" className="w-full h-auto">
                  {[20, 70, 120, 170, 220].map((y, idx) => (
                    <line
                      key={idx}
                      x1="42"
                      y1={y}
                      x2="730"
                      y2={y}
                      stroke="#e2e8f0"
                      strokeDasharray="3 3"
                      strokeWidth="1"
                    />
                  ))}
                  {salesChartData.map((_, idx) => {
                    const x = getSalesX(idx);
                    return (
                      <line
                        key={idx}
                        x1={x}
                        y1="20"
                        x2={x}
                        y2="220"
                        stroke="#f1f5f9"
                        strokeDasharray="3 3"
                        strokeWidth="1"
                      />
                    );
                  })}

                  {[
                    { label: '20', y: 24 },
                    { label: '15', y: 74 },
                    { label: '10', y: 124 },
                    { label: '5', y: 174 },
                    { label: '0', y: 224 },
                  ].map((item, idx) => (
                    <text
                      key={idx}
                      x="35"
                      y={item.y}
                      textAnchor="end"
                      className="fill-slate-600 text-[11px]"
                    >
                      {item.label}
                    </text>
                  ))}

                  {[
                    { label: '1,800,000원', y: 24 },
                    { label: '1,350,000원', y: 74 },
                    { label: '900,000원', y: 124 },
                    { label: '450,000원', y: 174 },
                    { label: '0원', y: 224 },
                  ].map((item, idx) => (
                    <text
                      key={idx}
                      x="736"
                      y={item.y}
                      textAnchor="start"
                      className="fill-emerald-600 text-[11px] font-medium"
                    >
                      {item.label}
                    </text>
                  ))}

                  <line x1="42" y1="20" x2="42" y2="220" stroke="#94a3b8" strokeWidth="1" />
                  <line x1="730" y1="20" x2="730" y2="220" stroke="#86efac" strokeWidth="1" />
                  <line x1="42" y1="220" x2="730" y2="220" stroke="#94a3b8" strokeWidth="1" />

                  {salesChartData.map((d, idx) => {
                    const cx = getSalesX(idx);
                    return (
                      <g key={idx}>
                        <rect
                          x={cx - 11}
                          y={220 - d.revH}
                          width="22"
                          height={d.revH}
                          rx="2"
                          fill="#bbf7d0"
                          fillOpacity="0.65"
                          stroke="#22c55e"
                          strokeWidth="1"
                        />
                        <text
                          x={cx}
                          y="238"
                          textAnchor="middle"
                          className="fill-slate-500 text-[10px]"
                        >
                          {d.date}
                        </text>
                      </g>
                    );
                  })}

                  <path
                    d={buildSmoothPath(adPts)}
                    fill="none"
                    stroke="#8b5cf6"
                    strokeWidth="1.8"
                  />
                  {adPts.map((pt, idx) => (
                    <circle
                      key={idx}
                      cx={pt.x}
                      cy={pt.y}
                      r="3"
                      fill="#ffffff"
                      stroke="#8b5cf6"
                      strokeWidth="1.8"
                    />
                  ))}

                  <path
                    d={buildSmoothPath(salesPts)}
                    fill="none"
                    stroke="#2563eb"
                    strokeWidth="2.5"
                  />
                  {salesPts.map((pt, idx) => (
                    <circle
                      key={idx}
                      cx={pt.x}
                      cy={pt.y}
                      r="4"
                      fill="#ffffff"
                      stroke="#2563eb"
                      strokeWidth="2.2"
                    />
                  ))}
                </svg>
              </div>

              <div>
                <div className="flex flex-wrap items-center justify-center gap-2.5 text-[11px] font-bold">
                  <span className="px-2.5 py-1 rounded-md bg-purple-50 border border-purple-200 text-purple-700 inline-flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-xs bg-purple-600 text-white flex items-center justify-center text-[9px]">✓</span>
                    <span>―○― 광고비</span>
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-700 inline-flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-xs bg-emerald-600 text-white flex items-center justify-center text-[9px]">✓</span>
                    <span>■ 매출</span>
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-slate-50 border border-slate-300 text-slate-400 inline-flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-xs border border-slate-300 bg-white" />
                    <span>―○― 조회</span>
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-blue-50 border border-blue-200 text-blue-700 inline-flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-xs bg-blue-600 text-white flex items-center justify-center text-[9px]">✓</span>
                    <span>―○― 판매량</span>
                  </span>
                </div>

                <div className="text-right text-[11px] text-slate-400 mt-1.5">
                  💡 아래 표에서 원하는 상품(옵션) 행을 클릭하면 해당 옵션의 일자별 추이 그래프로 즉시 전환됩니다.
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // ============================================================================
  // 2. 경쟁사관리 상세 프리뷰 (1번과 2번 높이를 365px로 완전 통일)
  // ============================================================================
  const renderCompetitorPreview = () => {
    const compareRows = [
      {
        isSelf: true,
        group: '세탁세제',
        mall: '쿠팡',
        name: '데일리홈 실내건조 세탁세제 2.5L',
        price: '11,900원',
        priceDiff: '',
        priceDiffType: 'none',
        recentSales: '',
        rating: '4.5',
        reviews: '126',
        reviewDiff: '+2개',
      },
      {
        isSelf: false,
        group: '세탁세제',
        mall: '쿠팡',
        name: '클린마켓 실내건조 세탁세제 2.5L',
        price: '10,120원',
        priceDiff: '',
        priceDiffType: 'none',
        recentSales: '한 달간 200개',
        rating: '4.3',
        reviews: '1,436',
        reviewDiff: '+18개',
      },
      {
        isSelf: false,
        group: '세탁세제',
        mall: '쿠팡',
        name: '리빙홈즈 실내건조 세탁세제 2.5L',
        price: '15,800원',
        priceDiff: '+5,630원',
        priceDiffType: 'up',
        recentSales: '한 달간 300개',
        rating: '4.0',
        reviews: '1,224',
        reviewDiff: '+14개',
      },
      {
        isSelf: false,
        group: '세탁세제',
        mall: '쿠팡',
        name: '홈케어솔루션 실내건조 세탁세제 2.5L',
        price: '14,990원',
        priceDiff: '+3,030원',
        priceDiffType: 'up',
        recentSales: '한 달간 100개',
        rating: '4.3',
        reviews: '258',
        reviewDiff: '+5개',
      },
      {
        isSelf: true,
        group: '세탁세제',
        mall: '쿠팡',
        name: '퓨어하우스 실내건조 세탁세제 2.5L',
        price: '11,300원',
        priceDiff: '-600원',
        priceDiffType: 'down',
        recentSales: '한 달간 400개',
        rating: '4.5',
        reviews: '1,592',
        reviewDiff: '+22개',
      },
    ];

    const dates = [
      '2026-11-01',
      '2026-11-02',
      '2026-11-03',
      '2026-11-04',
      '2026-11-05',
      '2026-11-06',
      '2026-11-09',
      '2026-11-10',
      '2026-11-15',
    ];
    const pricesY = [191, 191, 191, 191, 191, 83, 83, 71, 83];
    const reviewTopY = [38, 38, 37, 37, 36, 35, 34, 33, 32];
    const xPositions = [65, 145, 225, 305, 385, 465, 545, 625, 705];

    return (
      <div
        onMouseEnter={() => setIsPreviewHovered(true)}
        onMouseLeave={() => setIsPreviewHovered(false)}
        className="bg-white rounded-2xl border border-slate-200 shadow-2xl p-4 sm:p-5 text-slate-800"
      >
        {/* 상단 중앙 1, 2 버튼 */}
        {renderSubTabButtons(competitorSubTab, setCompetitorSubTab, 'blue')}

        <div className="h-[365px] flex flex-col">
          {competitorSubTab === 1 ? (
            /* 경쟁사관리 1번: 1번 이미지 데이터 (등록 상품 전체 비교표) */
            <div className="h-full flex flex-col justify-between">
              <div className="flex items-baseline gap-2 mb-2.5 overflow-hidden shrink-0">
                <h4 className="font-extrabold text-slate-900 text-sm sm:text-[15px] whitespace-nowrap shrink-0">
                  등록 상품 전체 비교표 (총 10개 상품)
                </h4>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden flex-1 flex flex-col">
                <table className="w-full h-full border-collapse text-left text-[12px]">
                  <thead>
                    <tr className="bg-[#f8fafc] border-b border-slate-200 text-slate-600 font-bold whitespace-nowrap">
                      <th className="py-2 px-2.5">구분</th>
                      <th className="py-2 px-2.5">그룹</th>
                      <th className="py-2 px-2.5">쇼핑몰</th>
                      <th className="py-2 px-2.5">상품명</th>
                      <th className="py-2 px-2.5">판매가</th>
                      <th className="py-2 px-2.5">가격 변동</th>
                      <th className="py-2 px-2.5">최근 판매량</th>
                      <th className="py-2 px-2.5">평점 / 리뷰수</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {compareRows.map((row, idx) => (
                      <tr
                        key={idx}
                        className={row.isSelf ? 'bg-[#f3f7ff]' : 'bg-white hover:bg-slate-50/80'}
                      >
                        <td className="py-1.5 px-2.5 whitespace-nowrap">
                          {row.isSelf ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-bold text-[11px]">
                              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                              자사
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-bold text-[11px]">
                              <Building2 className="w-3 h-3 text-slate-400" />
                              경쟁사
                            </span>
                          )}
                        </td>
                        <td className="py-1.5 px-2.5 text-slate-700 font-medium whitespace-nowrap">
                          {row.group}
                        </td>
                        <td className="py-1.5 px-2.5 whitespace-nowrap">
                          <span className="px-2 py-0.5 rounded-md bg-rose-50 border border-rose-200 text-rose-600 text-[11px] font-bold">
                            {row.mall}
                          </span>
                        </td>
                        <td className="py-1.5 px-2.5">
                          <div className="flex items-center gap-1.5 whitespace-nowrap">
                            <span className="font-bold text-slate-900">{row.name}</span>
                            <ExternalLink className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                          </div>
                        </td>
                        <td className="py-1.5 px-2.5 font-extrabold text-emerald-600 whitespace-nowrap">
                          {row.price}
                        </td>
                        <td className="py-1.5 px-2.5 font-bold whitespace-nowrap">
                          {row.priceDiffType === 'up' && (
                            <span className="text-rose-500">📈 {row.priceDiff}</span>
                          )}
                          {row.priceDiffType === 'down' && (
                            <span className="text-blue-600">📉 {row.priceDiff}</span>
                          )}
                        </td>
                        <td className="py-1.5 px-2.5 text-slate-700 font-medium whitespace-nowrap">
                          {row.recentSales}
                        </td>
                        <td className="py-1.5 px-2.5 whitespace-nowrap">
                          <div className="flex items-center gap-1 leading-tight">
                            <span className="text-amber-500 font-bold">★ {row.rating}</span>
                            <span className="text-slate-500">({row.reviews})</span>
                          </div>
                          <div className="text-[11px] font-bold text-indigo-600 leading-tight">{row.reviewDiff}</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            /* 경쟁사관리 2번: 기존 차트 데이터 */
            <div className="h-full flex flex-col justify-between">
              <div className="flex items-center justify-between gap-2 mb-2.5 shrink-0">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 border border-slate-300 text-slate-700 text-[11px] font-bold shrink-0">
                    <Building2 className="w-3.5 h-3.5 text-slate-500" />
                    경쟁사
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-rose-50 border border-rose-200 text-rose-600 text-[11px] font-bold shrink-0">
                    쿠팡
                  </span>
                  <h4 className="font-extrabold text-slate-900 text-sm sm:text-base truncate">
                    리빙홈즈 실내건조 세탁세제 2.5L
                  </h4>
                </div>

                <div className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-[12px] font-semibold text-slate-700 flex items-center gap-2 shadow-xs shrink-0">
                  <span>[경쟁사] 리빙홈즈 실내건조 세탁세제 2.5L</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                </div>
              </div>

              <div className="bg-[#f8fafc] border border-slate-200/90 rounded-xl p-3 sm:p-4 flex-1 flex flex-col justify-between">
                <div className="overflow-hidden my-auto">
                  <svg viewBox="0 0 820 260" className="w-full h-auto">
                    {[20, 50, 80, 110, 140, 170, 200, 230].map((y, idx) => (
                      <line
                        key={idx}
                        x1="55"
                        y1={y}
                        x2="755"
                        y2={y}
                        stroke="#e2e8f0"
                        strokeDasharray="3 3"
                        strokeWidth="1"
                      />
                    ))}
                    {xPositions.map((x, idx) => (
                      <line
                        key={idx}
                        x1={x}
                        y1="20"
                        x2={x}
                        y2="230"
                        stroke="#e2e8f0"
                        strokeDasharray="3 3"
                        strokeWidth="1"
                      />
                    ))}

                    {[
                      { label: '15,000원', y: 24 },
                      { label: '14,000원', y: 54 },
                      { label: '13,000원', y: 84 },
                      { label: '12,000원', y: 114 },
                      { label: '11,000원', y: 144 },
                      { label: '10,000원', y: 174 },
                      { label: '9,000원', y: 204 },
                      { label: '8,000원', y: 234 },
                    ].map((item, idx) => (
                      <text
                        key={idx}
                        x="48"
                        y={item.y}
                        textAnchor="end"
                        className="fill-blue-600 text-[11px] font-medium"
                      >
                        {item.label}
                      </text>
                    ))}

                    {[
                      { label: '2,200개', y: 24 },
                      { label: '1,650개', y: 76 },
                      { label: '1,100개', y: 129 },
                      { label: '550개', y: 181 },
                      { label: '0개', y: 234 },
                    ].map((item, idx) => (
                      <text
                        key={idx}
                        x="765"
                        y={item.y}
                        textAnchor="start"
                        className="fill-slate-600 text-[11px] font-medium"
                      >
                        {item.label}
                      </text>
                    ))}

                    <line x1="55" y1="20" x2="55" y2="230" stroke="#94a3b8" strokeWidth="1.2" />
                    <line x1="755" y1="20" x2="755" y2="230" stroke="#94a3b8" strokeWidth="1.2" />
                    <line x1="55" y1="230" x2="755" y2="230" stroke="#64748b" strokeWidth="1.2" />

                    {xPositions.map((x, idx) => (
                      <rect
                        key={idx}
                        x={x - 13}
                        y={reviewTopY[idx]}
                        width="26"
                        height={230 - reviewTopY[idx]}
                        rx="3"
                        fill="#cbd5e1"
                        opacity="0.85"
                      />
                    ))}

                    <path
                      d="M 65 191 L 145 191 L 225 191 L 305 191 L 385 191 C 415 191, 435 83, 465 83 L 545 83 C 575 83, 595 71, 625 71 C 655 71, 675 83, 705 83"
                      fill="none"
                      stroke="#2563eb"
                      strokeWidth="2.5"
                    />

                    {xPositions.map((x, idx) => (
                      <circle
                        key={idx}
                        cx={x}
                        cy={pricesY[idx]}
                        r="5.5"
                        fill="#2563eb"
                      />
                    ))}

                    {dates.map((d, idx) => (
                      <text
                        key={idx}
                        x={xPositions[idx]}
                        y="248"
                        textAnchor="middle"
                        className="fill-slate-500 text-[11px]"
                      >
                        {d}
                      </text>
                    ))}
                  </svg>
                </div>

                <div className="flex items-center justify-center gap-5 text-[12px] font-semibold">
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <span className="w-3.5 h-3.5 rounded-xs bg-[#cbd5e1] inline-block" />
                    <span>리뷰수</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-blue-600">
                    <span className="w-4 h-0.5 bg-blue-600 relative inline-flex items-center justify-center">
                      <span className="w-2 h-2 rounded-full border-2 border-blue-600 bg-white" />
                    </span>
                    <span>판매가</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // ============================================================================
  // 3. 광고관리 상세 프리뷰 (1번 아래쪽 데이터 일부 삭제 & 2번 11/14, 11/15 삭제 후 높이 356px 통일)
  // ============================================================================
  const renderAdPreview = () => {
    // 1번 요약표: 아래쪽 데이터 일부를 지워 2번 차트 높이와 동일하게 맞춤 (합산 + 최근 7일)
    const adSummaryRows = [
      { date: '2026-11-13', cost: '23,709원', rev: '392,000원', roas: '1653%', profit: '+117,411원', isPositive: true },
      { date: '2026-11-12', cost: '114,117원', rev: '882,000원', roas: '773%', profit: '+203,403원', isPositive: true },
      { date: '2026-11-11', cost: '163,865원', rev: '392,000원', roas: '239%', profit: '-22,745원', isPositive: false },
      { date: '2026-11-10', cost: '277,910원', rev: '1,666,000원', roas: '599%', profit: '+321,850원', isPositive: true },
      { date: '2026-11-09', cost: '300,855원', rev: '784,000원', roas: '261%', profit: '-18,615원', isPositive: false },
      { date: '2026-11-08', cost: '360,027원', rev: '882,000원', roas: '245%', profit: '-42,507원', isPositive: false },
      { date: '2026-11-07', cost: '343,458원', rev: '980,000원', roas: '285%', profit: '+9,342원', isPositive: true },
    ];

    // 2번 차트: 마지막 11.14, 11.15 두 개 날짜 삭제 (11.02 ~ 11.13 총 12일)
    const adData = [
      { date: '11.02', adCostH: 14, revH: 92, roasY: 148 },
      { date: '11.03', adCostH: 18, revH: 105, roasY: 150 },
      { date: '11.04', adCostH: 11, revH: 105, roasY: 102 },
      { date: '11.05', adCostH: 48, revH: 128, roasY: 184 },
      { date: '11.06', adCostH: 48, revH: 205, roasY: 165 },
      { date: '11.07', adCostH: 44, revH: 128, roasY: 182 },
      { date: '11.08', adCostH: 48, revH: 116, roasY: 187 },
      { date: '11.09', adCostH: 39, revH: 105, roasY: 185 },
      { date: '11.10', adCostH: 35, revH: 205, roasY: 149 },
      { date: '11.11', adCostH: 21, revH: 52, roasY: 187 },
      { date: '11.12', adCostH: 16, revH: 116, roasY: 126 },
      { date: '11.13', adCostH: 4, revH: 52, roasY: 28 },
    ];

    const getX = (idx: number) => 75 + idx * 58;

    const roasPoints = adData.map((d, i) => ({ x: getX(i), y: d.roasY }));
    let pathD = `M ${roasPoints[0].x} ${roasPoints[0].y}`;
    for (let i = 0; i < roasPoints.length - 1; i++) {
      const curr = roasPoints[i];
      const next = roasPoints[i + 1];
      const midX = (curr.x + next.x) / 2;
      pathD += ` C ${midX} ${curr.y}, ${midX} ${next.y}, ${next.x} ${next.y}`;
    }

    return (
      <div
        onMouseEnter={() => setIsPreviewHovered(true)}
        onMouseLeave={() => setIsPreviewHovered(false)}
        className="bg-white rounded-2xl border border-slate-200 shadow-2xl p-4 sm:p-5 text-slate-800"
      >
        {/* 상단 중앙 1, 2 버튼 */}
        {renderSubTabButtons(adSubTab, setAdSubTab, 'purple')}

        <div className="h-[356px] flex flex-col">
          {adSubTab === 1 ? (
            /* 광고관리 1번: 2번 이미지 데이터 (전체 광고 효율 요약표) */
            <div className="h-full flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2.5 shrink-0">
                <h4 className="font-extrabold text-slate-900 text-sm sm:text-[15px]">
                  전체 광고 효율 요약표 (무선 진공 물걸레 청소기)
                </h4>
                <span className="text-[11px] text-slate-500">총 13일 기록</span>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden flex-1 flex flex-col">
                <table className="w-full h-full border-collapse text-[12px]">
                  <thead>
                    <tr className="bg-[#f8fafc] border-b border-slate-200 text-slate-600 font-bold">
                      <th className="py-2 px-4 text-left">분석 기간 / 일자</th>
                      <th className="py-2 px-4 text-right">총 광고비</th>
                      <th className="py-2 px-4 text-right">총 매출액</th>
                      <th className="py-2 px-4 text-right">평균 ROAS</th>
                      <th className="py-2 px-4 text-right">예상 순수익</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {/* 합산 행 */}
                    <tr className="bg-[#f1f5f9] font-extrabold border-b border-slate-200">
                      <td className="py-2 px-4 text-left text-blue-700">
                        합산 (2026-11-01 ~ 2026-11-13)
                      </td>
                      <td className="py-2 px-4 text-right text-slate-900">2,734,253원</td>
                      <td className="py-2 px-4 text-right text-emerald-600">11,074,000원</td>
                      <td className="py-2 px-4 text-right text-blue-600">405%</td>
                      <td className="py-2 px-4 text-right text-emerald-600">+1,252,387원</td>
                    </tr>
                    {/* 일자별 행 */}
                    {adSummaryRows.map((row) => (
                      <tr key={row.date} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-1.5 px-4 text-left font-bold text-slate-800">{row.date}</td>
                        <td className="py-1.5 px-4 text-right text-slate-600">{row.cost}</td>
                        <td className="py-1.5 px-4 text-right font-bold text-emerald-600">{row.rev}</td>
                        <td className="py-1.5 px-4 text-right font-bold text-blue-600">{row.roas}</td>
                        <td
                          className={`py-1.5 px-4 text-right font-bold ${
                            row.isPositive ? 'text-emerald-600' : 'text-rose-500'
                          }`}
                        >
                          {row.profit}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            /* 광고관리 2번: 차트 데이터 (11.14, 11.15 삭제됨) */
            <div className="h-full flex flex-col justify-between">
              <div className="shrink-0">
                <h4 className="font-extrabold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                  <span>📈 전체 광고 효율 차트 (무선 진공 물걸레 청소기)</span>
                </h4>
                <p className="text-[12px] text-slate-500 mt-0.5">
                  선택 캠페인의 조회 기간(2026-11-02 ~ 2026-11-13) 내 일자별 총 광고비, 총 매출액, 평균 ROAS 추이입니다.
                </p>
              </div>

              <div className="overflow-hidden my-auto">
                <svg viewBox="0 0 810 250" className="w-full h-auto">
                  {[20, 70, 120, 170, 220].map((y, idx) => (
                    <line
                      key={idx}
                      x1="45"
                      y1={y}
                      x2="750"
                      y2={y}
                      stroke="#e2e8f0"
                      strokeDasharray="3 3"
                      strokeWidth="1"
                    />
                  ))}

                  {[
                    { label: '180만', y: 24 },
                    { label: '135만', y: 74 },
                    { label: '90만', y: 124 },
                    { label: '45만', y: 174 },
                    { label: '0만', y: 224 },
                  ].map((item, idx) => (
                    <text
                      key={idx}
                      x="38"
                      y={item.y}
                      textAnchor="end"
                      className="fill-slate-500 text-[11px]"
                    >
                      {item.label}
                    </text>
                  ))}

                  {[
                    { label: '1800%', y: 24 },
                    { label: '1350%', y: 74 },
                    { label: '900%', y: 124 },
                    { label: '450%', y: 174 },
                    { label: '0%', y: 224 },
                  ].map((item, idx) => (
                    <text
                      key={idx}
                      x="758"
                      y={item.y}
                      textAnchor="start"
                      className="fill-slate-500 text-[11px]"
                    >
                      {item.label}
                    </text>
                  ))}

                  {adData.map((d, idx) => {
                    const cx = getX(idx);
                    return (
                      <g key={idx}>
                        {d.adCostH > 0 && (
                          <rect
                            x={cx - 18}
                            y={220 - d.adCostH}
                            width="16"
                            height={d.adCostH}
                            rx="2"
                            fill="#94a3b8"
                          />
                        )}
                        {d.revH > 0 && (
                          <rect
                            x={cx + 2}
                            y={220 - d.revH}
                            width="16"
                            height={d.revH}
                            rx="2"
                            fill="#7c9dd9"
                          />
                        )}
                        <text
                          x={cx}
                          y="240"
                          textAnchor="middle"
                          className="fill-slate-500 text-[11px]"
                        >
                          {d.date}
                        </text>
                      </g>
                    );
                  })}

                  <path
                    d={pathD}
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="2.5"
                  />

                  {roasPoints.map((pt, idx) => (
                    <circle
                      key={idx}
                      cx={pt.x}
                      cy={pt.y}
                      r="3.5"
                      fill="#f59e0b"
                      stroke="#ffffff"
                      strokeWidth="1.5"
                    />
                  ))}
                </svg>
              </div>

              <div className="flex items-center justify-center gap-5 text-[12px] font-semibold shrink-0">
                <div className="flex items-center gap-1.5 text-slate-500">
                  <span className="w-3.5 h-3.5 rounded-xs bg-[#94a3b8] inline-block" />
                  <span>총 광고비</span>
                </div>
                <div className="flex items-center gap-1.5 text-[#5b82c8]">
                  <span className="w-3.5 h-3.5 rounded-xs bg-[#7c9dd9] inline-block" />
                  <span>총 매출액</span>
                </div>
                <div className="flex items-center gap-1.5 text-amber-500">
                  <span className="w-4 h-0.5 bg-amber-500 relative inline-flex items-center justify-center">
                    <span className="w-2 h-2 rounded-full border-2 border-amber-500 bg-white" />
                  </span>
                  <span>평균 ROAS</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // 각 카드 렌더링 함수 (자세히보기 버튼 클릭으로만 열림)
  const renderSalesCard = (isCompact: boolean) => {
    const isOpen = activeScope === 'sales';
    return (
      <div
        className={`bg-slate-900/90 ${
          isCompact ? 'p-4 sm:p-5' : 'p-7 sm:p-8'
        } rounded-3xl border ${
          isOpen
            ? 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-2xl'
            : 'border-slate-800 hover:border-emerald-500/60 hover:shadow-2xl'
        } transition-all duration-500 flex flex-col justify-between h-full group`}
      >
        <div>
          <div className="flex items-center justify-between mb-4 gap-2">
            <div className="w-10 h-10 rounded-2xl bg-emerald-950 text-emerald-400 border border-emerald-800/60 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-md shrink-0">
              <TrendingUp className="w-5 h-5" />
            </div>
            <button
              onClick={() => handleToggleScope('sales')}
              className={`text-[12px] font-bold px-3.5 py-1.5 rounded-xl border transition-all cursor-pointer shrink-0 ${
                isOpen
                  ? 'bg-emerald-200 text-emerald-950 border-emerald-300 shadow-sm'
                  : 'bg-emerald-950/90 hover:bg-emerald-900 text-emerald-300 border-emerald-700/70'
              }`}
            >
              {isOpen ? '닫기' : '자세히보기'}
            </button>
          </div>

          <h3 className="text-lg sm:text-xl font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">
            판매 관리
          </h3>
          <p className="text-slate-400 text-[12px] leading-relaxed mb-4 pb-4 border-b border-slate-800">
            매일 발생하는 주문·판매 데이터를 분석하여 매출 누수를 막고 기회를 사수합니다.
          </p>

          <ul className="space-y-2.5 text-slate-300 text-[12px]">
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-white">일일·월별 판매 추이 정밀 분석</span>
                <p className="text-slate-400 text-[11px] mt-0.5 leading-snug">
                  상품별 주문 수량, 결제 금액, 마진율 흐름을 매일 점검하여 건강한 매출 성장세 유지
                </p>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-white">급상승·급하락 이상 징후 감지</span>
                <p className="text-slate-400 text-[11px] mt-0.5 leading-snug">
                  매출이 갑자기 꺾이거나 주문이 폭증할 때 노출 순위와 채널 요인을 즉각 파악 후 조치
                </p>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-white">조회수 대비 구매 전환율 & 효율 점검</span>
                <p className="text-slate-400 text-[11px] mt-0.5 leading-snug">
                  옵션별 조회수 대비 실제 구매 전환율과 투입 광고비를 대조하여 수익성 진단
                </p>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-white">채널별 프로모션 & 단가 최적화</span>
                <p className="text-slate-400 text-[11px] mt-0.5 leading-snug">
                  시즌 할인, 묶음 구성 등 각 플랫폼 알고리즘에 맞춘 행사 제안과 최적 마진율 방어
                </p>
              </div>
            </li>
          </ul>
        </div>

        <div className="pt-4 mt-4 border-t border-slate-800/80">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
            <span>매일 아침 판매 이상 유무 확인 및 즉각 조치</span>
          </div>
        </div>
      </div>
    );
  };

  const renderCompetitorCard = (isCompact: boolean) => {
    const isOpen = activeScope === 'competitor';
    return (
      <div
        className={`bg-slate-900/90 ${
          isCompact ? 'p-4 sm:p-5' : 'p-7 sm:p-8'
        } rounded-3xl border ${
          isOpen
            ? 'border-blue-500 ring-2 ring-blue-500/20 shadow-2xl'
            : 'border-slate-800 hover:border-blue-500/60 hover:shadow-2xl'
        } transition-all duration-500 flex flex-col justify-between h-full group`}
      >
        <div>
          <div className="flex items-center justify-between mb-4 gap-2">
            <div className="w-10 h-10 rounded-2xl bg-blue-950 text-blue-400 border border-blue-800/60 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all shadow-md shrink-0">
              <Eye className="w-5 h-5" />
            </div>
            <button
              onClick={() => handleToggleScope('competitor')}
              className={`text-[12px] font-bold px-3.5 py-1.5 rounded-xl border transition-all cursor-pointer shrink-0 ${
                isOpen
                  ? 'bg-blue-200 text-blue-950 border-blue-300 shadow-sm'
                  : 'bg-blue-950/90 hover:bg-blue-900 text-blue-300 border-blue-700/70'
              }`}
            >
              {isOpen ? '닫기' : '자세히보기'}
            </button>
          </div>

          <h3 className="text-lg sm:text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
            경쟁사 관리
          </h3>
          <p className="text-slate-400 text-[12px] leading-relaxed mb-4 pb-4 border-b border-slate-800">
            주요 경쟁 업체의 가격, 할인, 품절 변동을 상시 추적하여 시장 주도권을 놓치지 않습니다.
          </p>

          <ul className="space-y-2.5 text-slate-300 text-[12px]">
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-white">주요 경쟁사 가격 변동 밀착 추적</span>
                <p className="text-slate-400 text-[11px] mt-0.5 leading-snug">
                  타깃 경쟁 상품의 기습 가격 인하, 쿠폰 적용, 게릴라 프로모션을 지속 모니터링
                </p>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-white">경쟁사 품절·가격인상 빈틈 공략</span>
                <p className="text-slate-400 text-[11px] mt-0.5 leading-snug">
                  경쟁 제품이 품절되거나 단가가 오를 때 자사 상품의 노출과 판촉을 집중해 흡수
                </p>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-white">경쟁사 판매량 변화 추적</span>
                <p className="text-slate-400 text-[11px] mt-0.5 leading-snug">
                  주요 경쟁 상품의 일일·주간 판매량 증감 흐름을 파악하여 시장 수요 변화에 즉각 대응
                </p>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-white">신규 진입 상품 및 트렌드 파악</span>
                <p className="text-slate-400 text-[11px] mt-0.5 leading-snug">
                  빠르게 치고 올라오는 신규 경쟁 업체의 구성과 가격대를 분석해 방어책 선제 마련
                </p>
              </div>
            </li>
          </ul>
        </div>

        <div className="pt-4 mt-4 border-t border-slate-800/80">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-blue-400">
            <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
            <span>경쟁사 움직임에 따른 가격·프로모션 대응</span>
          </div>
        </div>
      </div>
    );
  };

  const renderAdCard = (isCompact: boolean) => {
    const isOpen = activeScope === 'ad';
    return (
      <div
        className={`bg-slate-900/90 ${
          isCompact ? 'p-4 sm:p-5' : 'p-7 sm:p-8'
        } rounded-3xl border ${
          isOpen
            ? 'border-purple-500 ring-2 ring-purple-500/20 shadow-2xl'
            : 'border-slate-800 hover:border-purple-500/60 hover:shadow-2xl'
        } transition-all duration-500 flex flex-col justify-between h-full group`}
      >
        <div>
          <div className="flex items-center justify-between mb-4 gap-2">
            <div className="w-10 h-10 rounded-2xl bg-purple-950 text-purple-400 border border-purple-800/60 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-all shadow-md shrink-0">
              <Flame className="w-5 h-5" />
            </div>
            <button
              onClick={() => handleToggleScope('ad')}
              className={`text-[12px] font-bold px-3.5 py-1.5 rounded-xl border transition-all cursor-pointer shrink-0 ${
                isOpen
                  ? 'bg-purple-200 text-purple-950 border-purple-300 shadow-sm'
                  : 'bg-purple-950/90 hover:bg-purple-900 text-purple-300 border-purple-700/70'
              }`}
            >
              {isOpen ? '닫기' : '자세히보기'}
            </button>
          </div>

          <h3 className="text-lg sm:text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">
            광고 관리
          </h3>
          <p className="text-slate-400 text-[12px] leading-relaxed mb-4 pb-4 border-b border-slate-800">
            일자별 광고비와 전환 매출을 정밀 추적하여 누수 비용을 막고 ROAS를 높입니다.
          </p>

          <ul className="space-y-2.5 text-slate-300 text-[12px]">
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-white">일자별 광고비·매출·ROAS 추이 분석</span>
                <p className="text-slate-400 text-[11px] mt-0.5 leading-snug">
                  캠페인별 일일 광고비와 전환 매출액, 평균 ROAS 흐름을 정밀 추적해 효율 진단
                </p>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-white">전환 없는 누수 광고비 즉각 차단</span>
                <p className="text-slate-400 text-[11px] mt-0.5 leading-snug">
                  클릭만 발생하고 구매로 이어지지 않는 저효율 키워드와 비효율 구좌를 실시간 제외
                </p>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-white">고효율 키워드 발굴 및 입찰 최적화</span>
                <p className="text-slate-400 text-[11px] mt-0.5 leading-snug">
                  구매 전환율이 높은 핵심 키워드에 예산을 집중하여 수익성과 매출 볼륨 확보
                </p>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-white">상품별 맞춤 목표 ROAS 밀착 핸들링</span>
                <p className="text-slate-400 text-[11px] mt-0.5 leading-snug">
                  마진율과 재고 상황에 맞춘 탄력적 광고 운영으로 지출을 줄이고 순이익 극대화
                </p>
              </div>
            </li>
          </ul>
        </div>

        <div className="pt-4 mt-4 border-t border-slate-800/80">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-purple-400">
            <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
            <span>광고비 누수 차단 및 목표 ROAS 밀착 관리</span>
          </div>
        </div>
      </div>
    );
  };

  const isSalesOpen = activeScope === 'sales';
  const isRightSlotOpen = activeScope === 'competitor' || activeScope === 'ad';

  return (
    <section
      id="scope"
      className={`py-24 mx-auto px-4 sm:px-6 border-t border-slate-800/80 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        isExpanded ? 'max-w-[1780px]' : 'max-w-6xl'
      }`}
    >
      <ScrollReveal>
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest bg-indigo-950/70 border border-indigo-800/60 px-3 py-1.5 rounded-full">
            Full-Care Scope
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-4 mb-3">
            서비스를 맡기시면 매일 이런 것들을 해드립니다
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            아래 예시 화면은 유니드에서 직접 관리해 드리고 대표님과 함께 보며 소통하는 실제 화면입니다.
            <br className="hidden sm:inline" />
            이렇게 제품 하나하나의 판매·경쟁사·광고 흐름을 세밀하게 파악하고 매일 밀착 관리할 수 있습니다.
          </p>
        </div>
      </ScrollReveal>

      {/* 단일 Flex 레이아웃 유지 -> 열릴 때와 닫힐 때 모두 정방향/역방향 연속 애니메이션 작동 */}
      <ScrollReveal delay={100}>
        <div className="flex flex-col xl:flex-row items-stretch justify-center mb-12 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]">
          {/* 1. 판매관리 카드 */}
          <div
            className={`transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] shrink-0 ${
              isExpanded
                ? 'w-full xl:w-[235px] 2xl:w-[260px]'
                : 'w-full xl:w-[calc((100%-3.5rem)/3)]'
            }`}
          >
            {renderSalesCard(isExpanded)}
          </div>

          {/* 슬롯 1: 판매관리와 경쟁사관리 사이 */}
          <div
            className={`overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] flex flex-col justify-center shrink-0 ${
              isSalesOpen
                ? 'w-full xl:w-[calc(100%-753px)] 2xl:w-[calc(100%-828px)] max-h-[900px] opacity-100 scale-x-100 my-4 xl:my-0 xl:mx-4'
                : 'w-full xl:w-0 2xl:w-0 max-h-0 xl:max-h-[900px] opacity-0 scale-x-95 my-0 xl:mx-0 pointer-events-none'
            }`}
          >
            <div className="w-full min-w-[640px]">{renderSalesPreview()}</div>
          </div>

          {/* 기본 간격 1 (슬롯 1이 닫혀 있을 때만 유지) */}
          <div
            className={`transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] shrink-0 ${
              isSalesOpen
                ? 'w-0 h-0'
                : isExpanded
                  ? 'h-4 xl:h-0 xl:w-4'
                  : 'h-7 xl:h-0 xl:w-7'
            }`}
          />

          {/* 2. 경쟁사관리 카드 */}
          <div
            className={`transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] shrink-0 ${
              isExpanded
                ? 'w-full xl:w-[235px] 2xl:w-[260px]'
                : 'w-full xl:w-[calc((100%-3.5rem)/3)]'
            }`}
          >
            {renderCompetitorCard(isExpanded)}
          </div>

          {/* 슬롯 2: 경쟁사관리와 광고관리 사이 */}
          <div
            className={`overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] flex flex-col justify-center shrink-0 ${
              isRightSlotOpen
                ? 'w-full xl:w-[calc(100%-753px)] 2xl:w-[calc(100%-828px)] max-h-[900px] opacity-100 scale-x-100 my-4 xl:my-0 xl:mx-4'
                : 'w-full xl:w-0 2xl:w-0 max-h-0 xl:max-h-[900px] opacity-0 scale-x-95 my-0 xl:mx-0 pointer-events-none'
            }`}
          >
            <div className="w-full min-w-[600px]">
              {rightSlotView === 'competitor' ? renderCompetitorPreview() : renderAdPreview()}
            </div>
          </div>

          {/* 기본 간격 2 (슬롯 2가 닫혀 있을 때만 유지) */}
          <div
            className={`transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] shrink-0 ${
              isRightSlotOpen
                ? 'w-0 h-0'
                : isExpanded
                  ? 'h-4 xl:h-0 xl:w-4'
                  : 'h-7 xl:h-0 xl:w-7'
            }`}
          />

          {/* 3. 광고관리 카드 */}
          <div
            className={`transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] shrink-0 ${
              isExpanded
                ? 'w-full xl:w-[235px] 2xl:w-[260px]'
                : 'w-full xl:w-[calc((100%-3.5rem)/3)]'
            }`}
          >
            {renderAdCard(isExpanded)}
          </div>
        </div>
      </ScrollReveal>

      {/* 하단 요약 및 상담 유도 카드 */}
      <ScrollReveal delay={200}>
        <div className="max-w-6xl mx-auto bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 p-6 sm:p-8 rounded-3xl border border-indigo-900/60 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2 text-indigo-400 font-bold text-sm mb-1.5">
              <Sparkles className="w-4 h-4" />
              <span>15년 차 총괄 MD가 대표님의 전담 실무자처럼 직접 챙깁니다</span>
            </div>
            <p className="text-slate-300 text-xs sm:text-sm">
              내부 직원을 뽑기 부담스럽거나, 전문 인력의 세밀한 관리가 필요하신가요? 지금 상담을 신청해 보세요.
            </p>
          </div>
          <button
            onClick={() => onOpenConsult('both')}
            className="px-6 py-3.5 rounded-2xl text-xs sm:text-sm font-bold bg-indigo-500 hover:bg-indigo-400 text-white transition-all shadow-lg shadow-indigo-500/30 whitespace-nowrap shrink-0 flex items-center gap-2"
          >
            <span>전담 관리 서비스 상담 신청하기</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </ScrollReveal>
    </section>
  );
}
