import { useState, useEffect } from 'react';
import { Play, X, Video } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';

export interface VideoItem {
  id: string;
  title: string;
  category?: string;
  description?: string;
}

const VIDEOS: VideoItem[] = [
  {
    id: 'S0ZvWBm3gNI',
    title: '자체 개발 솔루션 & 실무 관리 프로세스 시연',
    category: '실무 시연 영상',
    description: '판매 데이터 분석 및 광고 관리 툴을 활용한 실제 운영 관리 프로세스를 확인해 보세요.',
  },
];

export function VideoSection() {
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);

  // 모달 열릴 때 배경 스크롤 방지
  useEffect(() => {
    if (activeVideo) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [activeVideo]);

  const isSingle = VIDEOS.length === 1;

  return (
    <>
      <section id="preview-video" className="py-20 max-w-6xl mx-auto px-6 sm:px-8 border-b border-slate-800/80">
        <ScrollReveal>
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest bg-indigo-950/70 border border-indigo-800/60 px-3 py-1.5 rounded-full inline-flex items-center gap-1.5">
              <Video className="w-3.5 h-3.5" />
              PROCESS PREVIEW
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mt-4 mb-3 leading-snug">
              실무에 사용하는 시스템을
              <br />
              영상으로 직접 확인하세요
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              자체 개발 프로그램과 15년 차 총괄 MD의 실무 관리 프로세스를 투명하게 공개합니다.
            </p>
          </div>
        </ScrollReveal>

        {/* 영상 컨테이너: 1개일 땐 540px(1080px의 50%), 복수일 땐 3*3 그리드 구조 */}
        <ScrollReveal delay={150}>
          <div
            className={
              isSingle
                ? 'max-w-[540px] w-full mx-auto'
                : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto'
            }
          >
            {VIDEOS.map((video) => (
              <div
                key={video.id}
                onClick={() => setActiveVideo(video)}
                className="group relative cursor-pointer bg-slate-900/80 border border-slate-800 hover:border-indigo-500/60 rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 hover:-translate-y-1"
              >
                {/* 썸네일 영역 */}
                <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
                  <img
                    src={`https://img.youtube.com/vi/${video.id}/maxresdefault.jpg`}
                    onError={(e) => {
                      // maxresdefault 없을 경우 hqdefault로 fallback
                      (e.currentTarget as HTMLImageElement).src = `https://img.youtube.com/vi/${video.id}/hqdefault.jpg`;
                    }}
                    alt={video.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* 호버 오버레이 */}
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all flex items-center justify-center">
                    {/* 재생 버튼 */}
                    <div className="w-16 h-16 rounded-full bg-red-600/90 group-hover:bg-red-600 text-white flex items-center justify-center shadow-xl shadow-red-950/50 transition-all duration-300 group-hover:scale-110">
                      <Play className="w-7 h-7 fill-white translate-x-0.5" />
                    </div>
                  </div>

                  {/* 좌측 상단 카테고리 뱃지 */}
                  {video.category && (
                    <div className="absolute top-3.5 left-3.5 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-[11px] font-medium text-slate-200">
                      {video.category}
                    </div>
                  )}

                  {/* 우측 하단 1080px 안내 뱃지 */}
                  <div className="absolute bottom-3.5 right-3.5 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-[11px] font-semibold text-indigo-300">
                    HD 1080p
                  </div>
                </div>

                {/* 하단 텍스트 정보 */}
                <div className="p-5">
                  <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-1 mb-1.5">
                    {video.title}
                  </h3>
                  <p className="text-[12px] text-slate-400 line-clamp-2 leading-relaxed mb-3">
                    {video.description}
                  </p>
                  <div className="text-[11px] text-indigo-400/90 font-medium flex items-center gap-1">
                    클릭하면 1080px 고화질 영상으로 재생됩니다 &rarr;
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* 1080px 확대 재생 모달창 */}
      {activeVideo && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 cursor-default"
          onClick={() => setActiveVideo(null)}
        >
          <div
            className="w-full max-w-[1080px] bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 모달 상단 헤더 */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
              <div className="flex items-center gap-2.5 min-w-0 pr-4">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse flex-shrink-0" />
                <h3 className="text-sm sm:text-base font-bold text-white truncate">
                  {activeVideo.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveVideo(null)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors text-xs flex-shrink-0"
                aria-label="닫기"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 유튜브 iframe 플레이어 (1080px 최대 기준 16:9 비율) */}
            <div className="relative aspect-video w-full bg-black">
              <iframe
                src={`https://www.youtube.com/embed/${activeVideo.id}?autoplay=1&rel=0`}
                title={activeVideo.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>

            {/* 모달 하단 푸터 (규칙: 파스텔톤 버튼, 버튼 글자 크기 12px, 기본 12px, 최소 11px) */}
            <div className="px-6 py-3.5 border-t border-slate-800 bg-slate-900/95 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                * 가로 1080px 고화질 모드로 재생 중입니다.
              </span>
              <button
                type="button"
                onClick={() => setActiveVideo(null)}
                className="px-4 py-2 rounded-xl text-[12px] font-medium bg-slate-700/60 hover:bg-slate-700 text-slate-200 border border-slate-600/50 transition-colors"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
