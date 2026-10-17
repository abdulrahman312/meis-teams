import React, { useState, useRef } from 'react';
import {
  Search,
  Copy,
  Check,
  AlertCircle,
  RefreshCw,
  Play,
  ExternalLink,
  Video,
  MonitorPlay,
  CheckCircle2,
  Sparkles,
  LifeBuoy,
  ZoomIn,
  X
} from 'lucide-react';

interface StaffData {
  englishName: string;
  arabicName: string;
  employeeNumber: string;
  branch: string;
  microsoftAccount: string;
  password: string;
}

interface LookupResponse {
  found: boolean;
  data?: StaffData;
  message?: string;
}

export default function App() {
  const [employeeNumber, setEmployeeNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<LookupResponse | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<'username' | 'password' | null>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [enlargedImage, setEnlargedImage] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const videoDriveDirectUrl = 'https://drive.google.com/file/d/1-G9V6KCceT7rZqVqJu6aWLGeZIcWD0gm/view?usp=sharing';
  const itsmPortalUrl = 'https://ataa-dwp.onbmc.com/';

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = employeeNumber.trim();
    if (!query) {
      if (inputRef.current) inputRef.current.focus();
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);
    setResult(null);
    setCopiedField(null);

    try {
      const response = await fetch(`/api/lookup?employeeNumber=${encodeURIComponent(query)}`);
      const data: LookupResponse = await response.json();

      if (response.ok && data.found) {
        setResult(data);
      } else {
        setErrorMsg(data.message || 'No account found for this Employee Number.');
      }
    } catch {
      setErrorMsg('Unable to connect to the staff directory. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, field: 'username' | 'password') => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => {
      setCopiedField(null);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50/50 to-indigo-50/40 text-slate-900 flex flex-col justify-between selection:bg-indigo-500 selection:text-white antialiased">
      {/* Header with School Logo & Name on Left, Company Logo on Right */}
      <header className="bg-white/90 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-30 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          {/* Left: School Logo + School Name as requested */}
          <div className="flex items-center gap-3 sm:gap-4">
            <img
              src="/images/meis_logo.png"
              alt="Middle East International School Logo"
              className="w-12 h-12 sm:w-14 sm:h-14 object-contain shrink-0 drop-shadow-xs"
            />
            <div className="flex flex-col">
              <span className="text-sm sm:text-base md:text-lg font-bold text-[#0d3880] font-arabic leading-snug">
                مدرسة الشرق الأوسط العالمية - المروج
              </span>
              <span className="text-xs sm:text-sm md:text-[15px] font-bold text-[#0d3880] tracking-tight leading-snug">
                Middle East International School - AlMuruj
              </span>
            </div>
          </div>

          {/* Right: Company Logo */}
          <div className="flex items-center shrink-0">
            <img
              src="/images/ataa_logo.png"
              alt="Ataa Educational Company Logo"
              className="h-10 sm:h-12 w-auto object-contain"
            />
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 flex flex-col items-center">
        {/* Portal Introduction */}
        <div className="text-center mb-8 max-w-xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-100/70 text-[#0d3880] text-xs font-semibold mb-3 border border-blue-200/60">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Microsoft Teams Account Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Find Your Microsoft Teams Account
          </h1>
          <p className="text-sm text-slate-600 mt-1 font-arabic">
            بوابة المعلمين والمعلمات للحصول على بيانات حساب مايكروسوفت تيمز
          </p>
        </div>

        {/* Input Box Card */}
        <div className="w-full max-w-lg mb-8">
          <div className="bg-white/95 border border-slate-200/90 rounded-2xl p-6 sm:p-7 shadow-lg shadow-blue-900/5 backdrop-blur-sm">
            <form onSubmit={handleSearch} className="space-y-4">
              <div>
                <label
                  htmlFor="employeeNumber"
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2"
                >
                  Employee Number <span className="font-arabic font-normal text-slate-400">(الرقم الوظيفي)</span>
                </label>
                <div className="relative flex items-center shadow-xs">
                  <input
                    id="employeeNumber"
                    ref={inputRef}
                    type="text"
                    inputMode="numeric"
                    value={employeeNumber}
                    onChange={(e) => {
                      setEmployeeNumber(e.target.value);
                      if (errorMsg) setErrorMsg(null);
                    }}
                    placeholder="Enter your Employee Number"
                    disabled={isLoading}
                    className="w-full pl-4 pr-28 py-3.5 bg-slate-50/70 border border-slate-300 rounded-xl text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0d3880] focus:border-[#0d3880] focus:bg-white transition-all font-medium font-mono"
                  />
                  <button
                    type="submit"
                    disabled={isLoading || !employeeNumber.trim()}
                    className="absolute right-1.5 px-4 py-2 bg-[#0d3880] hover:bg-[#0b2d66] disabled:opacity-40 disabled:hover:bg-[#0d3880] text-white font-medium rounded-lg text-sm transition-all shadow-xs active:scale-95 flex items-center gap-1.5 cursor-pointer"
                  >
                    {isLoading ? (
                      <RefreshCw className="w-4 h-4 animate-spin text-white" />
                    ) : (
                      <Search className="w-4 h-4" />
                    )}
                    <span>Submit</span>
                  </button>
                </div>
              </div>
            </form>

            {/* Error Message */}
            {errorMsg && (
              <div className="mt-4 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-sm flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Results Display Card */}
            {result?.found && result.data && (
              <div className="mt-6 pt-5 border-t border-slate-100 transition-all animate-in fade-in duration-300">
                {/* Teacher Name */}
                <div className="pb-4 mb-4 border-b border-slate-100">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#0d3880]">
                    Teacher Name
                  </span>
                  <h2 className="text-xl font-bold text-slate-900 leading-snug">
                    {result.data.englishName}
                  </h2>
                  {result.data.arabicName && (
                    <p className="text-sm text-slate-600 font-arabic font-medium mt-0.5">
                      {result.data.arabicName}
                    </p>
                  )}
                </div>

                {/* Microsoft Username */}
                <div className="mb-4">
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5">
                    Microsoft Account Username
                  </label>
                  <div className="flex items-center justify-between gap-2 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <span className="font-mono text-sm sm:text-base text-slate-800 break-all select-all font-semibold">
                      {result.data.microsoftAccount}
                    </span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(result.data?.microsoftAccount || '', 'username')}
                      className="shrink-0 flex items-center gap-1 px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 rounded-lg text-xs font-semibold transition active:scale-95 shadow-2xs cursor-pointer"
                    >
                      {copiedField === 'username' ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-600">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-slate-500" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Password - Visible in plain text as requested */}
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5">
                    Password
                  </label>
                  <div className="flex items-center justify-between gap-2 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <span className="font-mono text-sm sm:text-base text-slate-800 select-all font-semibold">
                      {result.data.password}
                    </span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(result.data?.password || '', 'password')}
                      className="shrink-0 flex items-center gap-1 px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 rounded-lg text-xs font-semibold transition active:scale-95 shadow-2xs cursor-pointer"
                    >
                      {copiedField === 'password' ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-600">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-slate-500" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tutorial Section: Connect Teams account to Classera */}
        <section className="w-full max-w-3xl mt-4">
          <div className="bg-white/95 border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-lg shadow-blue-900/5 backdrop-blur-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200/60 flex items-center justify-center text-[#0d3880]">
                  <Video className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                    Tutorial: Connect Teams Account to Classera
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 font-arabic">
                    شرح بالفيديو لكيفية ربط حساب مايكروسوفت تيمز بمنصة كلاسيرا
                  </p>
                </div>
              </div>

              <a
                href={videoDriveDirectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition shrink-0"
              >
                <span>Open in Google Drive</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Video Player */}
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-black shadow-inner">
              {isVideoPlaying ? (
                <div className="relative w-full aspect-video bg-black flex items-center justify-center">
                  <video
                    src="/videos/classera_teams_tutorial.mp4"
                    controls
                    autoPlay
                    playsInline
                    preload="auto"
                    className="w-full h-full object-contain"
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
              ) : (
                <div
                  onClick={() => setIsVideoPlaying(true)}
                  className="relative w-full aspect-video bg-gradient-to-tr from-slate-900 via-slate-800 to-indigo-950 flex flex-col items-center justify-center cursor-pointer group p-6 text-center"
                >
                  <div className="absolute inset-0 bg-blue-600/10 group-hover:bg-blue-600/20 transition-all pointer-events-none" />

                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/95 text-[#0d3880] flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:bg-[#0d3880] group-hover:text-white transition-all duration-300 z-10 mb-4">
                    <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-current ml-1" />
                  </div>

                  <h4 className="text-white text-base sm:text-lg font-bold z-10 group-hover:text-blue-200 transition">
                    Click to Play Tutorial Video
                  </h4>
                  <p className="text-slate-300 text-xs sm:text-sm mt-1 z-10 max-w-md font-arabic text-slate-300">
                    اضغط هنا لبدء مشاهدة الشرح مباشرة
                  </p>
                  <div className="mt-4 inline-flex items-center gap-1.5 text-xs text-blue-300/90 z-10 font-medium">
                    <MonitorPlay className="w-4 h-4" />
                    <span>Watch in interactive player</span>
                  </div>
                </div>
              )}
            </div>

            {/* Steps Guide */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 pt-5 border-t border-slate-100 text-xs text-slate-600">
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/60">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-800 block">Step 1: Sign in</span>
                  <span>Log in to your school Classera account using your credentials.</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/60">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-800 block">Step 2: Choose Teams</span>
                  <span>Go to Virtual Classrooms and select Microsoft Teams as your platform.</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/60">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-800 block">Step 3: Link Account</span>
                  <span>Authorize with your Middle East International School account credentials.</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* IT Support & Account Request Section (ITSM Portal) */}
        <section className="w-full max-w-3xl mt-8 mb-4">
          <div className="bg-white/95 border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-lg shadow-purple-900/5 backdrop-blur-sm">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-200/60 flex items-center justify-center text-[#4c3575]">
                  <LifeBuoy className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                    Teams Account Issues & Password Reset
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 font-arabic">
                    الدعم الفني • طلبات إنشاء الحسابات وإعادة تهيئة كلمة المرور
                  </p>
                </div>
              </div>

              <a
                href={itsmPortalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-[#4c3575] hover:bg-[#3c2a5c] text-white rounded-xl text-xs font-bold transition shadow-xs active:scale-95 shrink-0"
              >
                <span>Ataa ITSM Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Official Announcement / Circular Box in Arabic and English */}
            <div className="p-4 sm:p-5 rounded-xl bg-slate-50 border border-slate-200/90 mb-6">
              <div className="text-right font-arabic leading-relaxed text-sm text-slate-800 space-y-2 mb-4 pb-4 border-b border-slate-200/70" dir="rtl">
                <p className="font-bold text-base text-[#0d3880]">السلام عليكم ورحمه الله وبركاته</p>
                <p className="font-semibold text-slate-700">تحية طيبة وبعد،</p>
                <p className="text-slate-700">
                  نظراً لتعليمات إدارة تقنية المعلومات بشركة <span className="font-bold text-slate-900">عطاء التعليمية</span> بخصوص طلبات التقنية، نود التنويه بأنه <span className="font-bold text-rose-600">لن يتم قبول أي طلبات خاصة بالتقنية إلا من خلال منصة ITSM</span>، وذلك حرصاً منا على تقديم أعلى جودة في حل المشاكل التقنية والاستجابة السريعة للطلبات.
                </p>
                <div className="pt-2">
                  <a
                    href={itsmPortalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 font-bold text-[#4c3575] hover:text-[#3c2a5c] underline text-sm"
                  >
                    <span>رابط المنصة لرفع الطلبات التقنية: {itsmPortalUrl}</span>
                    <ExternalLink className="w-4 h-4 inline" />
                  </a>
                </div>
              </div>

              <div className="text-xs text-slate-600 space-y-1">
                <p className="font-semibold text-slate-800">For Teachers and Staff:</p>
                <p>
                  If you could not find your Teams account in the directory above, or are experiencing login issues or need a password reset, please submit a formal technical request via the official Ataa Educational ITSM portal.
                </p>
              </div>
            </div>

            {/* 3 Step-by-Step Visual Cards */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-4 flex items-center justify-between">
                <span>How to Submit a Request on the ITSM Portal</span>
                <span className="font-arabic font-semibold text-slate-500 text-xs">خطوات رفع الطلب عبر المنصة</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Step 1 */}
                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs hover:shadow-md transition flex flex-col">
                  <div
                    onClick={() => setEnlargedImage('/images/1.png')}
                    className="relative aspect-video bg-slate-100 overflow-hidden cursor-pointer group"
                  >
                    <img
                      src="/images/1.png"
                      alt="Step 1: Select Account Management"
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition duration-300"
                    />
                    <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/30 transition flex items-center justify-center">
                      <span className="opacity-0 group-hover:opacity-100 transition px-2.5 py-1 bg-white/95 text-slate-800 text-[11px] font-bold rounded-md shadow-xs flex items-center gap-1">
                        <ZoomIn className="w-3.5 h-3.5" /> Enlarge
                      </span>
                    </div>
                    <span className="absolute top-2 left-2 px-2 py-0.5 bg-[#4c3575] text-white text-[11px] font-bold rounded-md shadow-xs">
                      Step 1
                    </span>
                  </div>
                  <div className="p-3.5 flex-1 flex flex-col justify-between">
                    <div>
                      <h5 className="font-bold text-sm text-slate-900 mb-1">
                        1. Select Account Management
                      </h5>
                      <p className="text-xs text-slate-500 font-arabic mb-1">
                        إدارة الحسابات
                      </p>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        In the service catalog, find <strong className="text-slate-800">إدارة الحسابات</strong> and click on <strong className="text-slate-800">طلب إنشاء / إعادة تهيئة حسابات إلكترونية</strong>.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs hover:shadow-md transition flex flex-col">
                  <div
                    onClick={() => setEnlargedImage('/images/2.png')}
                    className="relative aspect-video bg-slate-100 overflow-hidden cursor-pointer group"
                  >
                    <img
                      src="/images/2.png"
                      alt="Step 2: Click Request Now"
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition duration-300"
                    />
                    <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/30 transition flex items-center justify-center">
                      <span className="opacity-0 group-hover:opacity-100 transition px-2.5 py-1 bg-white/95 text-slate-800 text-[11px] font-bold rounded-md shadow-xs flex items-center gap-1">
                        <ZoomIn className="w-3.5 h-3.5" /> Enlarge
                      </span>
                    </div>
                    <span className="absolute top-2 left-2 px-2 py-0.5 bg-[#4c3575] text-white text-[11px] font-bold rounded-md shadow-xs">
                      Step 2
                    </span>
                  </div>
                  <div className="p-3.5 flex-1 flex flex-col justify-between">
                    <div>
                      <h5 className="font-bold text-sm text-slate-900 mb-1">
                        2. Click "Request Now"
                      </h5>
                      <p className="text-xs text-slate-500 font-arabic mb-1">
                        الضغط على طلب الآن
                      </p>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        On the service details screen, click the purple <strong className="text-slate-800">طلب الآن (Request Now)</strong> button to open the ticket request form.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs hover:shadow-md transition flex flex-col">
                  <div
                    onClick={() => setEnlargedImage('/images/3.png')}
                    className="relative aspect-video bg-slate-100 overflow-hidden cursor-pointer group"
                  >
                    <img
                      src="/images/3.png"
                      alt="Step 3: Fill Request Form and Submit"
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition duration-300"
                    />
                    <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/30 transition flex items-center justify-center">
                      <span className="opacity-0 group-hover:opacity-100 transition px-2.5 py-1 bg-white/95 text-slate-800 text-[11px] font-bold rounded-md shadow-xs flex items-center gap-1">
                        <ZoomIn className="w-3.5 h-3.5" /> Enlarge
                      </span>
                    </div>
                    <span className="absolute top-2 left-2 px-2 py-0.5 bg-[#4c3575] text-white text-[11px] font-bold rounded-md shadow-xs">
                      Step 3
                    </span>
                  </div>
                  <div className="p-3.5 flex-1 flex flex-col justify-between">
                    <div>
                      <h5 className="font-bold text-sm text-slate-900 mb-1">
                        3. Fill Details & Submit
                      </h5>
                      <p className="text-xs text-slate-500 font-arabic mb-1">
                        تعبئة البيانات وإرسال الطلب
                      </p>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Choose request type, enter your Employee Number, select <strong className="text-slate-800">مايكروسوفت (Microsoft)</strong>, provide your ID, and click <strong className="text-slate-800">إرسال الطلب (Submit)</strong>.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Direct Portal Button */}
            <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs text-slate-500 font-arabic">
                منصة إدارة الخدمات التقنية لشركة عطاء التعليمية
              </span>
              <a
                href={itsmPortalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#4c3575] hover:bg-[#3c2a5c] text-white rounded-xl text-sm font-bold transition shadow-sm active:scale-95"
              >
                <span>Go to ITSM Portal (الانتقال إلى المنصة)</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Footer with School Logo & Name on Left, Company Logo on Right */}
      <footer className="bg-white/90 backdrop-blur-md border-t border-slate-200/80 mt-12 py-5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Left: School Logo + Name */}
          <div className="flex items-center gap-3">
            <img
              src="/images/meis_logo.png"
              alt="Middle East International School Logo"
              className="w-10 h-10 object-contain shrink-0"
            />
            <div className="flex flex-col">
              <span className="text-xs sm:text-sm font-bold text-[#0d3880] font-arabic">
                مدرسة الشرق الأوسط العالمية - المروج
              </span>
              <span className="text-[11px] sm:text-xs font-bold text-[#0d3880]">
                Middle East International School - AlMuruj
              </span>
            </div>
          </div>

          {/* Center: Copyright */}
          <div className="text-center text-xs text-slate-500 font-medium">
            Middle East International School • Microsoft Teams Staff Portal
          </div>

          {/* Right: Company Logo */}
          <div className="flex items-center shrink-0">
            <img
              src="/images/ataa_logo.png"
              alt="Ataa Educational Company Logo"
              className="h-9 sm:h-10 w-auto object-contain"
            />
          </div>
        </div>
      </footer>

      {/* Image Lightbox Modal for Enlarging Step Screenshots */}
      {enlargedImage && (
        <div
          onClick={() => setEnlargedImage(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 transition-all"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-5xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-slate-50">
              <span className="text-xs sm:text-sm font-bold text-slate-800">
                ITSM Portal Step Screenshot Preview
              </span>
              <button
                type="button"
                onClick={() => setEnlargedImage(null)}
                className="p-1.5 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-200 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-3 bg-slate-100 flex items-center justify-center overflow-auto max-h-[calc(92vh-60px)]">
              <img
                src={enlargedImage}
                alt="Enlarged Instruction"
                className="max-h-[80vh] w-auto max-w-full object-contain rounded-lg shadow-sm"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
