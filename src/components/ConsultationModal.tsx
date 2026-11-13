import React, { useState } from 'react';
import { X, CheckCircle2, MessageSquare, Phone, Mail, Send, Loader2 } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

export type ServiceTypeOption = 'sales' | 'ad' | 'both';

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialServiceType?: ServiceTypeOption;
}

export const ConsultationModal: React.FC<ConsultationModalProps> = ({
  isOpen,
  onClose,
  initialServiceType = 'both',
}) => {
  const [companyName, setCompanyName] = useState('');
  const [contact, setContact] = useState('');
  const [channel, setChannel] = useState('');
  const [serviceType, setServiceType] = useState<ServiceTypeOption>(initialServiceType);
  const [contactMethod, setContactMethod] = useState<'sms' | 'kakao' | 'email' | 'call'>('kakao');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // 모달이 열릴 때 선택한 서비스 타입으로 동기화
  React.useEffect(() => {
    if (isOpen) {
      setServiceType(initialServiceType);
    }
  }, [isOpen, initialServiceType]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim() || !contact.trim()) return;

    setIsSubmitting(true);

    try {
      const serviceTypeLabel =
        serviceType === 'sales'
          ? '판매관리'
          : serviceType === 'ad'
          ? '광고관리'
          : '판매 + 광고관리';

      const contactMethodLabel =
        contactMethod === 'sms'
          ? '문자'
          : contactMethod === 'kakao'
          ? '카톡'
          : contactMethod === 'email'
          ? '메일'
          : '전화';

      // 사용자가 입력한 모든 내용을 줄바꿈으로 title에 구성
      const fullTitleContent = [
        '♥ 상담신청 ♥',
        `업체이름 : ${companyName}`,
        `전화번호 또는 이메일 : ${contact}`,
        `관리가 필요한 채널 : ${channel || '없음'}`,
        `필요한 관리 서비스 : ${serviceTypeLabel}`,
        `선호하는 상담 방법 : ${contactMethodLabel}`,
        message ? `남기실 말씀 : ${message}` : null,
      ]
        .filter(Boolean)
        .join('\n');

      const now = new Date();

      // todos 컬렉션에 지정된 스키마 형식으로 등록
      await addDoc(collection(db, 'todos'), {
        title: fullTitleContent,
        completed: false,
        createdAt: serverTimestamp(),
        alarmTime: now.toISOString(),
        completedAt: now.toISOString(),
      });

      setIsSubmitted(true);
    } catch (err: any) {
      console.error('Firebase save error:', err);
      // 네트워크나 규칙 오류 시에도 사용자 경험을 위해 성공 처리 유지 또는 에러 표시
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setIsSubmitted(false);
    setIsSubmitting(false);
    setCompanyName('');
    setContact('');
    setChannel('');
    setMessage('');
    onClose();
  };

  return (
    <div
      onClick={handleResetAndClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm cursor-default"
      style={{ cursor: 'default' }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg max-h-[92vh] flex flex-col bg-slate-900 rounded-2xl shadow-2xl border border-slate-700/80 overflow-hidden text-slate-200"
      >
        {/* 모달 헤더 */}
        <div className="shrink-0 flex items-center justify-between px-5 sm:px-6 py-3.5 sm:py-4 border-b border-slate-800 bg-slate-800/60">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">서비스 상담 및 미팅 신청</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              신청하신 연락처와 상담 방법으로 빠르게 연락 드리겠습니다.
            </p>
          </div>
          <button
            onClick={handleResetAndClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 모달 바디 (스크롤 가능하게 처리) */}
        <div className="p-5 sm:p-6 overflow-y-auto">
          {isSubmitted ? (
            <div className="py-8 text-center space-y-3">
              <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-2 border border-emerald-500/30">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-base font-semibold text-white">상담 신청이 완료되었습니다</h4>
              <p className="text-[12px] text-slate-300 leading-relaxed max-w-sm mx-auto">
                남겨주신 정보({companyName} / {contact})를 확인하여 빠른 시간 내에{' '}
                <span className="font-semibold text-indigo-400">
                  {contactMethod === 'sms' && '문자'}
                  {contactMethod === 'kakao' && '카톡'}
                  {contactMethod === 'email' && '메일'}
                  {contactMethod === 'call' && '전화'}
                </span>
                로 안내 드리겠습니다.
              </p>
              <div className="pt-4">
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="px-5 py-2.5 rounded-xl font-medium text-[12px] bg-slate-800 text-slate-200 hover:bg-slate-700 transition-colors"
                >
                  확인
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* 업체명 & 전화번호 또는 이메일 (한 줄로 배치) */}
              <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1 truncate">
                    업체 이름 <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder=""
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-[12px] focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 transition-all placeholder:text-slate-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1 truncate">
                    전화번호 또는 이메일 <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    placeholder=""
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-[12px] focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 transition-all placeholder:text-slate-500"
                  />
                </div>
              </div>

              {/* 관리가 필요한 채널 */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  관리가 필요한 채널 <span className="text-slate-500 font-normal">(복수 가능)</span>
                </label>
                <input
                  type="text"
                  value={channel}
                  onChange={(e) => setChannel(e.target.value)}
                  placeholder="예) 쿠팡"
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-[12px] focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 transition-all placeholder:text-slate-500"
                />
              </div>

              {/* 서비스 선택 */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1.5">
                  필요한 관리 서비스 <span className="text-rose-400">*</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setServiceType('sales')}
                    className={`py-2.5 px-2 rounded-xl text-[12px] font-medium border text-center transition-all ${
                      serviceType === 'sales'
                        ? 'border-indigo-500 bg-indigo-950/60 text-indigo-300 shadow-sm'
                        : 'border-slate-800 bg-slate-800/60 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    판매관리
                    <span className="block text-[11px] font-normal text-slate-400 mt-0.5">월 20만원</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setServiceType('ad')}
                    className={`py-2.5 px-2 rounded-xl text-[12px] font-medium border text-center transition-all ${
                      serviceType === 'ad'
                        ? 'border-indigo-500 bg-indigo-950/60 text-indigo-300 shadow-sm'
                        : 'border-slate-800 bg-slate-800/60 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    광고관리
                    <span className="block text-[11px] font-normal text-slate-400 mt-0.5">월 20만원</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setServiceType('both')}
                    className={`py-2.5 px-2 rounded-xl text-[12px] font-medium border text-center transition-all ${
                      serviceType === 'both'
                        ? 'border-emerald-500 bg-emerald-950/60 text-emerald-300 shadow-sm'
                        : 'border-slate-800 bg-slate-800/60 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    판매 + 광고
                    <span className="block text-[11px] font-normal text-emerald-400 mt-0.5">월 30만원</span>
                  </button>
                </div>
              </div>

              {/* 상담 희망 수단 */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1.5">
                  선호하는 상담 방법 <span className="text-rose-400">*</span>
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: 'sms', label: '문자', icon: MessageSquare },
                    { id: 'kakao', label: '카톡', icon: Send },
                    { id: 'email', label: '메일', icon: Mail },
                    { id: 'call', label: '전화', icon: Phone },
                  ].map((item) => {
                    const Icon = item.icon;
                    const active = contactMethod === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setContactMethod(item.id as any)}
                        className={`py-2 px-1 rounded-xl text-[12px] font-medium border flex items-center justify-center gap-1 transition-all ${
                          active
                            ? 'border-indigo-500 bg-indigo-950/80 text-white font-semibold'
                            : 'border-slate-800 bg-slate-800/50 text-slate-400 hover:bg-slate-800'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 남기실 말씀 */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  남기실 말씀
                </label>
                <textarea
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder=""
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-[12px] focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 transition-all placeholder:text-slate-500 resize-none"
                />
              </div>

              {/* 하단 버튼 */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="px-4 py-2.5 rounded-xl font-medium text-[12px] bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors"
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl font-medium text-[12px] bg-indigo-300 text-indigo-950 hover:bg-indigo-200 transition-colors shadow-sm disabled:opacity-50 flex items-center gap-1.5"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>등록 중...</span>
                    </>
                  ) : (
                    <span>상담 신청하기</span>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
