import React, { useState, useEffect } from 'react';
import {
  X,
  Check,
  ChevronDown,
  Building2,
  ExternalLink,
  Star,
  FolderOpen,
  Image as ImageIcon,
} from 'lucide-react';

export interface ToolItem {
  id: string;
  name: string;
  subName: string;
  category: string;
  shortDesc: string;
  fullDesc: string;
  benefits: string[];
  techStack: string[];
}

interface ToolDetailModalProps {
  tool: ToolItem | null;
  onClose: () => void;
  onRequestConsult?: () => void;
}

export const ToolDetailModal: React.FC<ToolDetailModalProps> = ({
  tool,
  onClose,
}) => {
  const [subTab, setSubTab] = useState<1 | 2>(1);
  const [isHovered, setIsHovered] = useState(false);

  // 모달이 열릴 때마다 1번 탭으로 초기화
  useEffect(() => {
    if (tool) {
      setSubTab(1);
      setIsHovered(false);
    }
  }, [tool]);

  // 5초마다 1번과 2번 자동 롤링 (예시 화면에 마우스 오버 시 일시정지)
  useEffect(() => {
    if (!tool || isHovered) return;
    const timer = window.setInterval(() => {
      setSubTab((prev) => (prev === 1 ? 2 : 1));
    }, 5000);
    return () => window.clearInterval(timer);
  }, [tool, isHovered, subTab]);

  if (!tool) return null;

  // 상단 중앙 1, 2 버튼 (12px 파스텔톤)
  const renderSubTabButtons = () => (
    <div className="flex items-center justify-center mb-3 shrink-0">
      <div className="inline-flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
        <button
          type="button"
          onClick={() => setSubTab(1)}
          className={`w-7 h-7 rounded-lg text-[12px] font-bold border transition-all cursor-pointer flex items-center justify-center ${
            subTab === 1
              ? 'bg-indigo-100 text-indigo-900 border-indigo-300 shadow-xs'
              : 'bg-white text-slate-500 border-transparent hover:text-slate-800'
          }`}
        >
          1
        </button>
        <button
          type="button"
          onClick={() => setSubTab(2)}
          className={`w-7 h-7 rounded-lg text-[12px] font-bold border transition-all cursor-pointer flex items-center justify-center ${
            subTab === 2
              ? 'bg-indigo-100 text-indigo-900 border-indigo-300 shadow-xs'
              : 'bg-white text-slate-500 border-transparent hover:text-slate-800'
          }`}
        >
          2
        </button>
      </div>
    </div>
  );

  // 1. tool-1: 판매관리 예시 화면
  const renderTool1Preview = () => {
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
      { date: '11/02', revH: 100, salesY: 110, adY: 207 },
      { date: '11/03', revH: 120, salesY: 110, adY: 205 },
      { date: '11/04', revH: 108, salesY: 120, adY: 211 },
      { date: '11/05', revH: 98, salesY: 130, adY: 179 },
      { date: '11/06', revH: 175, salesY: 50, adY: 179 },
      { date: '11/07', revH: 110, salesY: 110, adY: 182 },
      { date: '11/08', revH: 88, salesY: 130, adY: 180 },
      { date: '11/09', revH: 110, salesY: 110, adY: 186 },
      { date: '11/10', revH: 188, salesY: 30, adY: 188 },
      { date: '11/11', revH: 110, salesY: 110, adY: 202 },
      { date: '11/12', revH: 45, salesY: 170, adY: 207 },
      { date: '11/13', revH: 87, salesY: 140, adY: 217 },
      { date: '11/14', revH: 45, salesY: 180, adY: 220 },
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
      <div className="h-[355px] flex flex-col">
        {subTab === 1 ? (
          <div className="border border-slate-200 rounded-xl overflow-hidden h-full flex flex-col justify-between">
            <div className="px-4 py-2 bg-white border-b border-slate-200 flex items-baseline gap-2 overflow-hidden shrink-0">
              <h4 className="font-extrabold text-slate-900 text-[13px] whitespace-nowrap shrink-0">
                옵션별 일자별 판매 흐름표 (총 42개 옵션)
              </h4>
              <span className="text-[11px] text-slate-500 whitespace-nowrap truncate">
                · 행 클릭 시 상단 추이 그래프 연동 · 증감 숫자는 1주 전 기준
              </span>
            </div>

            <div className="overflow-hidden flex-1 flex flex-col">
              <table className="w-full h-full border-collapse text-left">
                <thead>
                  <tr className="bg-[#f8fafc] border-b border-slate-200 text-[12px]">
                    <th className="py-1.5 px-3 font-bold text-slate-700 border-r border-slate-200 w-[160px]">
                      상품명 / 옵션 ID
                    </th>
                    <th className="py-1.5 px-3 font-bold text-slate-800 bg-[#f1f6fe] border-r-2 border-slate-300 text-right w-[120px]">
                      <div>기간 합계</div>
                      <div className="text-[11px] font-medium text-blue-600 whitespace-nowrap">
                        판매 / 조회 / 광고비 / 매출
                      </div>
                    </th>
                    <th className="py-1.5 px-2 text-right border-r border-slate-200">
                      <div className="font-bold text-slate-900">11/14(토)</div>
                      <div className="text-[11px] font-normal text-slate-500">총 40개</div>
                      <div className="text-[11px] font-medium text-slate-600">506,400원</div>
                    </th>
                    <th className="py-1.5 px-2 text-right border-r border-slate-200">
                      <div className="font-bold text-slate-900">11/13(금)</div>
                      <div className="text-[11px] font-normal text-slate-500">총 45개</div>
                      <div className="text-[11px] font-medium text-slate-600">691,800원</div>
                    </th>
                    <th className="py-1.5 px-2 text-right border-r border-slate-200">
                      <div className="font-bold text-slate-900">11/12(목)</div>
                      <div className="text-[11px] font-normal text-slate-500">총 52개</div>
                      <div className="text-[11px] font-medium text-slate-600">813,600원</div>
                    </th>
                    <th className="py-1.5 px-2 text-right border-r border-slate-200">
                      <div className="font-bold text-slate-900">11/11(수)</div>
                      <div className="text-[11px] font-normal text-slate-500">총 51개</div>
                      <div className="text-[11px] font-medium text-slate-600">722,400원</div>
                    </th>
                    <th className="py-1.5 px-2 text-right">
                      <div className="font-bold text-slate-900">11/10(화)</div>
                      <div className="text-[11px] font-normal text-slate-500">총 42개</div>
                      <div className="text-[11px] font-medium text-slate-600">635,000원</div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-[12px]">
                  {salesRows.map((row) => (
                    <tr key={row.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-1.5 px-3 border-r border-slate-200 align-middle">
                        <div className="flex items-start gap-2">
                          <span className="w-5 h-5 rounded-md flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5 bg-blue-50 text-blue-600 border border-blue-200">
                            {row.rank}
                          </span>
                          <div>
                            <div className="font-bold text-slate-900 leading-snug">{row.name}</div>
                            <div className="text-[11px] text-slate-400">ID: {row.id}</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-1.5 px-3 bg-[#f8fbff] border-r-2 border-slate-300 text-right align-middle whitespace-nowrap">
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
                          className="py-1.5 px-2 text-right border-r border-slate-100 last:border-r-0 align-bottom whitespace-nowrap"
                        >
                          <div>
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
          <div className="border border-slate-200 rounded-xl p-4 h-full flex flex-col justify-between">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 text-[11px] font-bold shrink-0">
                  채널 전체 합계 추이
                </span>
                <h4 className="font-extrabold text-slate-900 text-[13px] truncate">
                  데일리홈 생활용품 전체 옵션 일자별 추이
                </h4>
              </div>
              <div className="px-3 py-1 rounded-lg border border-slate-300 bg-white text-[12px] font-semibold text-slate-700 flex items-center gap-2 shrink-0">
                <span>전체 옵션 합계 그래프 보기</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </div>
            </div>

            <div className="overflow-hidden my-auto">
              <svg viewBox="0 0 810 240" className="w-full h-auto">
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
                {[
                  { label: '20', y: 24 },
                  { label: '15', y: 74 },
                  { label: '10', y: 124 },
                  { label: '5', y: 174 },
                  { label: '0', y: 224 },
                ].map((item, idx) => (
                  <text key={idx} x="35" y={item.y} textAnchor="end" className="fill-slate-600 text-[11px]">
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
                  <text key={idx} x="736" y={item.y} textAnchor="start" className="fill-emerald-600 text-[11px] font-medium">
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
                      <text x={cx} y="236" textAnchor="middle" className="fill-slate-500 text-[11px]">
                        {d.date}
                      </text>
                    </g>
                  );
                })}

                <path d={buildSmoothPath(adPts)} fill="none" stroke="#8b5cf6" strokeWidth="1.8" />
                {adPts.map((pt, idx) => (
                  <circle key={idx} cx={pt.x} cy={pt.y} r="3" fill="#ffffff" stroke="#8b5cf6" strokeWidth="1.8" />
                ))}

                <path d={buildSmoothPath(salesPts)} fill="none" stroke="#2563eb" strokeWidth="2.5" />
                {salesPts.map((pt, idx) => (
                  <circle key={idx} cx={pt.x} cy={pt.y} r="4" fill="#ffffff" stroke="#2563eb" strokeWidth="2.2" />
                ))}
              </svg>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2.5 text-[11px] font-bold">
              <span className="px-2.5 py-0.5 rounded-md bg-purple-50 border border-purple-200 text-purple-700">
                ✓ ―○― 광고비
              </span>
              <span className="px-2.5 py-0.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-700">
                ✓ ■ 매출
              </span>
              <span className="px-2.5 py-0.5 rounded-md bg-blue-50 border border-blue-200 text-blue-700">
                ✓ ―○― 판매량
              </span>
            </div>
          </div>
        )}
      </div>
    );
  };

  // 2. tool-2: 광고관리 예시 화면
  const renderTool2Preview = () => {
    const adSummaryRows = [
      { date: '2026-11-13', cost: '23,709원', rev: '392,000원', roas: '1653%', profit: '+117,411원', isPositive: true },
      { date: '2026-11-12', cost: '114,117원', rev: '882,000원', roas: '773%', profit: '+203,403원', isPositive: true },
      { date: '2026-11-11', cost: '163,865원', rev: '392,000원', roas: '239%', profit: '-22,745원', isPositive: false },
      { date: '2026-11-10', cost: '277,910원', rev: '1,666,000원', roas: '599%', profit: '+321,850원', isPositive: true },
      { date: '2026-11-09', cost: '300,855원', rev: '784,000원', roas: '261%', profit: '-18,615원', isPositive: false },
      { date: '2026-11-08', cost: '360,027원', rev: '882,000원', roas: '245%', profit: '-42,507원', isPositive: false },
      { date: '2026-11-07', cost: '343,458원', rev: '980,000원', roas: '285%', profit: '+9,342원', isPositive: true },
    ];

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
      <div className="h-[355px] flex flex-col">
        {subTab === 1 ? (
          <div className="h-full flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2 shrink-0">
              <h4 className="font-extrabold text-slate-900 text-[13px]">
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
                  <tr className="bg-[#f1f5f9] font-extrabold border-b border-slate-200">
                    <td className="py-2 px-4 text-left text-blue-700">합산 (2026-11-01 ~ 2026-11-13)</td>
                    <td className="py-2 px-4 text-right text-slate-900">2,734,253원</td>
                    <td className="py-2 px-4 text-right text-emerald-600">11,074,000원</td>
                    <td className="py-2 px-4 text-right text-blue-600">405%</td>
                    <td className="py-2 px-4 text-right text-emerald-600">+1,252,387원</td>
                  </tr>
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
          <div className="h-full flex flex-col justify-between border border-slate-200 rounded-xl p-4">
            <div className="shrink-0">
              <h4 className="font-extrabold text-slate-900 text-[13px]">
                📈 전체 광고 효율 차트 (무선 진공 물걸레 청소기)
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                선택 캠페인의 조회 기간(2026-11-02 ~ 2026-11-13) 내 일자별 총 광고비, 총 매출액, 평균 ROAS 추이입니다.
              </p>
            </div>

            <div className="overflow-hidden my-auto">
              <svg viewBox="0 0 810 245" className="w-full h-auto">
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
                  <text key={idx} x="38" y={item.y} textAnchor="end" className="fill-slate-500 text-[11px]">
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
                  <text key={idx} x="758" y={item.y} textAnchor="start" className="fill-slate-500 text-[11px]">
                    {item.label}
                  </text>
                ))}
                {adData.map((d, idx) => {
                  const cx = getX(idx);
                  return (
                    <g key={idx}>
                      {d.adCostH > 0 && (
                        <rect x={cx - 18} y={220 - d.adCostH} width="16" height={d.adCostH} rx="2" fill="#94a3b8" />
                      )}
                      {d.revH > 0 && (
                        <rect x={cx + 2} y={220 - d.revH} width="16" height={d.revH} rx="2" fill="#7c9dd9" />
                      )}
                      <text x={cx} y="238" textAnchor="middle" className="fill-slate-500 text-[11px]">
                        {d.date}
                      </text>
                    </g>
                  );
                })}
                <path d={pathD} fill="none" stroke="#f59e0b" strokeWidth="2.5" />
                {roasPoints.map((pt, idx) => (
                  <circle key={idx} cx={pt.x} cy={pt.y} r="3.5" fill="#f59e0b" stroke="#ffffff" strokeWidth="1.5" />
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
                <span>―○― 평균 ROAS</span>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // 3. tool-3: 경쟁사관리 예시 화면
  const renderTool3Preview = () => {
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
      <div className="h-[355px] flex flex-col">
        {subTab === 1 ? (
          <div className="h-full flex flex-col justify-between">
            <div className="flex items-baseline gap-2 mb-2 shrink-0">
              <h4 className="font-extrabold text-slate-900 text-[13px]">
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
          <div className="h-full flex flex-col justify-between">
            <div className="flex items-center justify-between gap-2 mb-2 shrink-0">
              <div className="flex items-center gap-2 min-w-0">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 border border-slate-300 text-slate-700 text-[11px] font-bold shrink-0">
                  <Building2 className="w-3.5 h-3.5 text-slate-500" />
                  경쟁사
                </span>
                <span className="px-2.5 py-1 rounded-md bg-rose-50 border border-rose-200 text-rose-600 text-[11px] font-bold shrink-0">
                  쿠팡
                </span>
                <h4 className="font-extrabold text-slate-900 text-[13px] truncate">
                  리빙홈즈 실내건조 세탁세제 2.5L
                </h4>
              </div>
              <div className="px-3 py-1 rounded-lg border border-slate-300 bg-white text-[12px] font-semibold text-slate-700 flex items-center gap-2 shrink-0">
                <span>[경쟁사] 리빙홈즈 실내건조 세탁세제 2.5L</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </div>
            </div>

            <div className="bg-[#f8fafc] border border-slate-200/90 rounded-xl p-3 flex-1 flex flex-col justify-between">
              <div className="overflow-hidden my-auto">
                <svg viewBox="0 0 820 250" className="w-full h-auto">
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
                  {[
                    { label: '15,000원', y: 24 },
                    { label: '13,000원', y: 84 },
                    { label: '11,000원', y: 144 },
                    { label: '9,000원', y: 204 },
                    { label: '8,000원', y: 234 },
                  ].map((item, idx) => (
                    <text key={idx} x="48" y={item.y} textAnchor="end" className="fill-blue-600 text-[11px] font-medium">
                      {item.label}
                    </text>
                  ))}
                  {[
                    { label: '2,200개', y: 24 },
                    { label: '1,100개', y: 129 },
                    { label: '0개', y: 234 },
                  ].map((item, idx) => (
                    <text key={idx} x="765" y={item.y} textAnchor="start" className="fill-slate-600 text-[11px] font-medium">
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
                    <circle key={idx} cx={x} cy={pricesY[idx]} r="5" fill="#2563eb" />
                  ))}
                  {dates.map((d, idx) => (
                    <text key={idx} x={xPositions[idx]} y="246" textAnchor="middle" className="fill-slate-500 text-[11px]">
                      {d}
                    </text>
                  ))}
                </svg>
              </div>
              <div className="flex items-center justify-center gap-5 text-[12px] font-semibold">
                <span className="text-slate-400">■ 리뷰수</span>
                <span className="text-blue-600">―●― 판매가</span>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // 4. tool-4: 리뷰관리 예시 화면 (SalesHelper의 SellperDashboard 실제 UI)
  const renderTool4Preview = () => {
    const optionRatios = [
      { name: '실내건조 세탁세제 2.5L x 2개 (본품 주력 세트)', ratio: '58%', count: 244 },
      { name: '실내건조 세탁세제 2.5L x 4개 (대용량 패밀리팩)', ratio: '29%', count: 122 },
      { name: '실내건조 세탁세제 2.5L x 1개 (단품 체험용)', ratio: '13%', count: 54 },
    ];
    const monthlyReviews = [
      { date: '2026-11 (이번 달)', count: 185, ratio: '88%' },
      { date: '2026-10', count: 142, ratio: '68%' },
      { date: '2026-09', count: 93, ratio: '45%' },
    ];

    return (
      <div className="h-[355px] flex flex-col">
        {subTab === 1 ? (
          <div className="h-full flex flex-col justify-between border border-slate-200 rounded-xl p-4 bg-white">
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-200 shrink-0">
              <h4 className="font-extrabold text-slate-900 text-[13px]">
                📊 데일리홈 초고농축 실내건조 세탁세제 2.5L 리뷰 정량 분석
              </h4>
              <span className="px-2.5 py-0.5 rounded-md bg-orange-100 text-orange-700 font-bold text-[11px]">
                수집 리뷰 420건 분석 완료
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-auto py-1">
              <div className="space-y-2.5">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
                  <div className="text-[12px] text-slate-500 font-semibold">평균 평점</div>
                  <div className="text-2xl font-black text-violet-500 my-0.5">★ 4.8</div>
                  <div className="text-[11px] text-slate-400">실구매 리뷰 420개 기준</div>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <div className="text-[12px] font-bold text-slate-700 mb-1.5">월별 리뷰 증가 추이</div>
                  <div className="space-y-1.5">
                    {monthlyReviews.map((m, idx) => (
                      <div key={idx}>
                        <div className="flex justify-between text-[11px] mb-0.5">
                          <span className="text-slate-600">{m.date}</span>
                          <span className="font-bold text-slate-800">{m.count}건</span>
                        </div>
                        <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                          <div className="h-full bg-violet-400 rounded-full" style={{ width: m.ratio }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="md:col-span-2 bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h5 className="text-[13px] font-bold text-slate-800">구매 옵션별 실제 판매 비율</h5>
                    <span className="text-[11px] text-blue-600 font-semibold">주력 옵션 파악 및 재고 배분 기준</span>
                  </div>
                  <div className="space-y-3">
                    {optionRatios.map((opt, idx) => (
                      <div key={idx}>
                        <div className="flex justify-between text-[12px] mb-1">
                          <span className="font-medium text-slate-700">{opt.name}</span>
                          <span className="font-bold text-slate-900">
                            {opt.ratio} ({opt.count}건)
                          </span>
                        </div>
                        <div className="h-2.5 bg-slate-200 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-400 rounded-full" style={{ width: opt.ratio }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2.5 border-t border-slate-200/80 text-[11px] text-slate-600">
                  💡 <strong>2개 세트 구성(58%)</strong>의 구매 전환이 가장 높으므로 대표 썸네일 및 기본 옵션으로 전면 배치
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col justify-between border border-slate-200 rounded-xl p-4 bg-white">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 shrink-0">
              <h4 className="font-extrabold text-slate-900 text-[13px]">
                📊 고객 리뷰 AI 심층 요약 & 상세페이지 개선 반영안
              </h4>
              <span className="text-[11px] text-slate-500">긍정 91% · 부정 9%</span>
            </div>

            <div className="space-y-2.5 my-auto">
              <div className="bg-emerald-50/90 p-3 rounded-xl border border-emerald-200 border-l-4 border-l-emerald-500">
                <h5 className="text-[12px] font-extrabold text-emerald-900 mb-1">
                  😊 긍정 피드백 요약 (고객이 구매를 결정한 핵심 이유)
                </h5>
                <ul className="list-disc pl-4 space-y-0.5 text-[12px] text-emerald-800">
                  <li>장마철·겨울철 실내 건조 시에도 꿉꿉한 냄새가 전혀 나지 않는다는 호평 (42%)</li>
                  <li>적은 양으로도 거품과 세정력이 뛰어나고 잔여 세제가 남지 않는다는 만족감 (31%)</li>
                </ul>
              </div>

              <div className="bg-rose-50/90 p-3 rounded-xl border border-rose-200 border-l-4 border-l-rose-500">
                <h5 className="text-[12px] font-extrabold text-rose-900 mb-1">
                  😞 부정 피드백 요약 (이탈 및 불만 요인)
                </h5>
                <ul className="list-disc pl-4 space-y-0.5 text-[12px] text-rose-800">
                  <li>2.5L 대용량 용기가 무거워 한 손으로 따르기 다소 부담스럽다는 의견 (6%)</li>
                  <li>투명 계량컵의 눈금이 흐릿해 정확한 사용량 확인이 어렵다는 지적 (3%)</li>
                </ul>
              </div>

              <div className="bg-blue-50/90 p-3 rounded-xl border border-blue-200 border-l-4 border-l-blue-500">
                <h5 className="text-[12px] font-extrabold text-blue-900 mb-1">
                  💡 유니드 상세페이지 & 운영 즉시 반영 사항
                </h5>
                <ul className="list-disc pl-4 space-y-0.5 text-[12px] text-blue-800">
                  <li>상세페이지 최상단에 &apos;실내건조 꿉꿉한 냄새 제로&apos; 베스트 리뷰 카피 전면 배치</li>
                  <li>빨래 무게별 권장 사용량(눈금 가이드) 이미지를 상세페이지에 즉시 추가하여 오해 해소</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // 5. tool-5: 상세페이지 & 썸네일 초고속 정리 예시 화면
  const renderTool5Preview = () => {
    const savedFiles = [
      { no: '01', name: '01_데일리홈_세탁세제_대표썸네일.png', size: '1000 x 1000 px', weight: '412 KB', type: '대표 썸네일' },
      { no: '02', name: '02_데일리홈_세탁세제_상세_상단소구점.jpg', size: '860 x 4200 px', weight: '1,180 KB', type: '상세 상단' },
      { no: '03', name: '03_데일리홈_세탁세제_상세_세정력비교.jpg', size: '860 x 3800 px', weight: '985 KB', type: '상세 중단' },
      { no: '04', name: '04_데일리홈_세탁세제_성분표및인증서.jpg', size: '860 x 2900 px', weight: '740 KB', type: '상세 하단' },
      { no: '05', name: '05_코마사_순면수건_컬러별썸네일_10종.zip', size: '1000 x 1000 px', weight: '3,850 KB', type: '옵션 일괄' },
    ];

    return (
      <div className="h-[355px] flex flex-col">
        {subTab === 1 ? (
          <div className="h-full flex flex-col justify-between border border-slate-200 rounded-xl p-4 bg-white">
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-200 shrink-0">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
                  <ImageIcon className="w-3.5 h-3.5" />
                </span>
                <h4 className="font-extrabold text-slate-900 text-[13px]">
                  ImageSaver Pro — 상세페이지 & 썸네일 원본 추출
                </h4>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-bold text-[11px]">
                ● 원클릭 수집 활성
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-auto py-1">
              <div className="space-y-2">
                <div className="text-[12px] font-bold text-slate-700 mb-1">캡처 및 리소스 수집 모드</div>
                <div className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center gap-3">
                  <span className="text-base">🖼️</span>
                  <div>
                    <div className="text-[12px] font-bold text-slate-800">단일 고화질 이미지 자동 저장</div>
                    <div className="text-[11px] text-slate-500">클릭한 대표 썸네일·옵션 이미지를 원본 화질로 즉시 저장</div>
                  </div>
                </div>
                <div className="p-2.5 rounded-xl border-2 border-indigo-500 bg-indigo-50/60 flex items-center gap-3">
                  <span className="text-base">📜</span>
                  <div>
                    <div className="text-[12px] font-bold text-indigo-950">상세페이지 전체 일괄 저장 (선택됨)</div>
                    <div className="text-[11px] text-indigo-700">첫 번째 이미지부터 하단 끝까지 전체 상세페이지를 한 번에 저장</div>
                  </div>
                </div>
                <div className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center gap-3">
                  <span className="text-base">✂️</span>
                  <div>
                    <div className="text-[12px] font-bold text-slate-800">드래그 영역 맞춤 저장</div>
                    <div className="text-[11px] text-slate-500">핵심 소구점이나 필요한 구간만 마우스로 드래그하여 즉시 저장</div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col justify-between">
                <div>
                  <div className="text-[12px] font-bold text-slate-700 mb-3">실시간 추출 리소스 규격 정보</div>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div className="bg-white p-3 rounded-xl border border-slate-200 text-center">
                      <div className="text-[11px] text-slate-500">실제 저장 용량</div>
                      <div className="text-base font-extrabold text-indigo-600 mt-1">1,420 KB</div>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-slate-200 text-center">
                      <div className="text-[11px] text-slate-500">원본 해상도 (크기)</div>
                      <div className="text-base font-extrabold text-slate-800 mt-1">860 × 14,800 px</div>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-slate-200 text-[11px] text-slate-600 space-y-1">
                    <div className="font-bold text-slate-800">📌 채널 확장 & 상품 최적화 활용</div>
                    <div>공급사 원본 확보 및 경쟁사 벤치마킹 시 화질 저하 없이 즉시 리소스를 정리하여 100개 상품 최적화를 4~5일 만에 끝냅니다.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col justify-between border border-slate-200 rounded-xl p-4 bg-white">
            <div className="flex items-center justify-between mb-2 shrink-0">
              <h4 className="font-extrabold text-slate-900 text-[13px]">
                최근 저장 히스토리 (상품별 상세·썸네일 자동 넘버링 정렬)
              </h4>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-[11px] font-bold">
                <FolderOpen className="w-3.5 h-3.5 text-amber-500" />
                폴더 자동 분류
              </span>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden flex-1 flex flex-col">
              <table className="w-full h-full border-collapse text-left text-[12px]">
                <thead>
                  <tr className="bg-[#f8fafc] border-b border-slate-200 text-slate-600 font-bold">
                    <th className="py-2 px-3">순번</th>
                    <th className="py-2 px-3">자동 정렬 파일명</th>
                    <th className="py-2 px-3">구분</th>
                    <th className="py-2 px-3">해상도 규격</th>
                    <th className="py-2 px-3 text-right">용량</th>
                    <th className="py-2 px-3 text-right">상태</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {savedFiles.map((f) => (
                    <tr key={f.no} className="hover:bg-slate-50/80">
                      <td className="py-2 px-3 font-bold text-indigo-600">{f.no}</td>
                      <td className="py-2 px-3 font-bold text-slate-800">{f.name}</td>
                      <td className="py-2 px-3">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-semibold">
                          {f.type}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-slate-600">{f.size}</td>
                      <td className="py-2 px-3 text-right text-slate-600">{f.weight}</td>
                      <td className="py-2 px-3 text-right">
                        <span className="text-emerald-600 font-bold">✓ 원본 완료</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderPreviewByToolId = () => {
    switch (tool.id) {
      case 'tool-1':
        return renderTool1Preview();
      case 'tool-2':
        return renderTool2Preview();
      case 'tool-3':
        return renderTool3Preview();
      case 'tool-4':
        return renderTool4Preview();
      case 'tool-5':
      default:
        return renderTool5Preview();
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm cursor-default"
      style={{ cursor: 'default' }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[1160px] bg-slate-900 rounded-3xl shadow-2xl border border-slate-700/80 overflow-hidden text-slate-200 flex flex-col"
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-800/60 shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-semibold text-indigo-300 bg-indigo-950 border border-indigo-800/60 px-2.5 py-1 rounded-lg">
              {tool.category}
            </span>
            <h3 className="text-base sm:text-lg font-extrabold text-white">
              {tool.name} <span className="text-slate-300 font-bold text-sm sm:text-base">{tool.subName}</span>
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-xl text-[12px] font-bold bg-indigo-200 text-indigo-950 hover:bg-indigo-300 transition-colors cursor-pointer flex items-center gap-1"
          >
            <span>닫기</span>
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 본문: 좌우 구성 (좌측 설명 및 실무 효과 / 우측 실제 구동 예시 화면) - 스크롤바 없음 */}
        <div className="p-5 sm:p-6 flex flex-col lg:flex-row items-stretch gap-5">
          {/* 좌측: 어떤 일들을 해주는지 설명 + 대표님이 얻게 되는 실무 효과 */}
          <div className="w-full lg:w-[310px] shrink-0 flex flex-col justify-between gap-4">
            <div className="bg-slate-800/70 p-4 rounded-2xl border border-slate-700/60 flex-1 flex flex-col justify-center">
              <h4 className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider mb-2">
                이 프로그램으로 해드리는 실무 관리
              </h4>
              <p className="text-[12px] text-slate-200 leading-relaxed">{tool.fullDesc}</p>
            </div>

            <div className="bg-slate-800/70 p-4 rounded-2xl border border-slate-700/60 flex-1 flex flex-col justify-center">
              <h4 className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider mb-2.5">
                대표님이 얻게 되는 실무 효과
              </h4>
              <ul className="space-y-2.5">
                {tool.benefits.map((benefit, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-[12px] text-slate-200">
                    <span className="p-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/60 mt-0.5 shrink-0">
                      <Check className="w-3 h-3" />
                    </span>
                    <span className="leading-snug">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 우측: 실제 구동 예시 화면 (1, 2 버튼 & 5초 자동 롤링) */}
          <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="flex-1 min-w-0 bg-white rounded-2xl p-4 text-slate-800 border border-slate-200 shadow-xl flex flex-col justify-between"
          >
            {renderSubTabButtons()}
            {renderPreviewByToolId()}
          </div>
        </div>
      </div>
    </div>
  );
};
