import React from 'react';
import { X, Check } from 'lucide-react';

export interface ToolItem {
  id: string;
  name: string;
  category: string;
  shortDesc: string;
  fullDesc: string;
  benefits: string[];
  techStack: string[];
}

interface ToolDetailModalProps {
  tool: ToolItem | null;
  onClose: () => void;
  onRequestConsult: () => void;
}

export const ToolDetailModal: React.FC<ToolDetailModalProps> = ({
  tool,
  onClose,
  onRequestConsult,
}) => {
  if (!tool) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm cursor-default"
      style={{ cursor: 'default' }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-slate-900 rounded-2xl shadow-2xl border border-slate-700/80 overflow-hidden text-slate-200"
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-800/60">
          <div>
            <span className="text-[11px] font-semibold text-indigo-400 bg-indigo-950/80 border border-indigo-800/60 px-2 py-0.5 rounded-md">
              {tool.category}
            </span>
            <h3 className="text-base font-bold text-white mt-1.5">{tool.name}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 본문 */}
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          <div>
            <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              개요 및 개발 목적
            </h4>
            <p className="text-[12px] text-slate-300 leading-relaxed bg-slate-800/80 p-3.5 rounded-xl border border-slate-700/60">
              {tool.fullDesc}
            </p>
          </div>

          <div>
            <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              실무 적용 효과 & 특장점
            </h4>
            <ul className="space-y-2">
              {tool.benefits.map((benefit, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-[12px] text-slate-300">
                  <span className="p-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/60 mt-0.5">
                    <Check className="w-3 h-3" />
                  </span>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              활용 기술 및 방식
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {tool.techStack.map((tech, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-md bg-slate-800 border border-slate-700 text-slate-300 text-[11px] font-medium"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* 푸터 */}
        <div className="flex items-center justify-end gap-2 px-6 py-3 border-t border-slate-800 bg-slate-800/40">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl font-medium text-[12px] bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors"
          >
            닫기
          </button>
          <button
            type="button"
            onClick={() => {
              onClose();
              onRequestConsult();
            }}
            className="px-4 py-2 rounded-xl font-medium text-[12px] bg-indigo-300 text-indigo-950 hover:bg-indigo-200 transition-colors"
          >
            프로그램 시연 미팅 신청
          </button>
        </div>
      </div>
    </div>
  );
};
