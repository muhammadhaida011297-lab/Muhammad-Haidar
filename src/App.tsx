import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, FileText, BookOpen, Layers, ShieldCheck, Award, 
  CheckSquare, AlertTriangle, FileSpreadsheet, Settings, Users, Bell, 
  Activity, Search, Plus, Filter, Download, Upload, CheckCircle2, 
  XCircle, Clock, ArrowUpRight, Sparkles, UserCheck, Lock, RefreshCw,
  HelpCircle, ChevronRight, BarChart3, Database, Eye, Trash2, Edit
} from 'lucide-react';
import { DatabaseState, User, DocumentItem, RequirementItem, AuditItem, AuditChecklist, FindingItem, CapaItem, LegalItem } from './types';

export default function App() {
  const [db, setDb] = useState<DatabaseState | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeMenu, setActiveMenu] = useState<string>('dashboard');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Modal & AI assistant states
  const [showAiModal, setShowAiModal] = useState<boolean>(false);
  const [aiPrompt, setAiPrompt] = useState<string>('');
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [aiResult, setAiResult] = useState<string>('');
  const [aiMode, setAiMode] = useState<'general' | 'classify' | 'gap' | 'rootcause'>('general');

  // Document modal states
  const [showDocModal, setShowDocModal] = useState<boolean>(false);
  const [selectedDoc, setSelectedDoc] = useState<DocumentItem | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterDept, setFilterDept] = useState<string>('All');
  const [filterSite, setFilterSite] = useState<string>('All');

  // Fetch initial data
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/state');
      const data = await res.json();
      setDb(data);
      if (data.users && data.users.length > 0) {
        setCurrentUser(data.users[0]); // Default to Super Admin
      }
      setLoading(false);
    } catch (err: any) {
      setError('Gagal memuat data dari server IMS.');
      setLoading(false);
    }
  };

  const handleAiSubmit = async () => {
    if (!aiPrompt.trim()) return;
    setAiLoading(true);
    setAiResult('');
    try {
      const res = await fetch('/api/ai/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: aiPrompt, mode: aiMode, contextData: db?.documents.slice(0, 5) })
      });
      const data = await res.json();
      if (data.success) {
        setAiResult(data.text);
      } else {
        setAiResult('Error: ' + data.error);
      }
    } catch (err: any) {
      setAiResult('Gagal menghubungi layanan AI Assistant.');
    } finally {
      setAiLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-900 text-white font-sans">
        <div className="text-center">
          <RefreshCw className="w-10 h-10 animate-spin text-amber-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold">Memuat Integrated Management System...</h2>
          <p className="text-sm text-slate-400 mt-1">SMKP Minerba | ISO 9001 | ISO 14001 | ISO 45001</p>
        </div>
      </div>
    );
  }

  if (error || !db || !currentUser) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-900 text-white font-sans">
        <div className="text-center p-8 bg-slate-800 rounded-xl border border-slate-700 max-w-md">
          <AlertTriangle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Terjadi Kesalahan Sistem</h2>
          <p className="text-sm text-slate-300 mb-6">{error || 'Gagal memuat profil pengguna.'}</p>
          <button onClick={fetchData} className="px-4 py-2 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-500 transition-colors">
            Coba Muat Ulang
          </button>
        </div>
      </div>
    );
  }

  // Calculate Dashboard Metrics
  const totalDocs = db.documents.length;
  const activeSops = db.documents.filter(d => d.docType === 'SOP' && d.status === 'Active').length;
  const pendingReview = db.documents.filter(d => d.status === 'Under Review' || d.status === 'Pending Approval').length;
  const openFindings = db.findings.filter(f => f.status === 'Open' || f.status === 'In Progress').length;
  const overdueCapas = db.capas.filter(c => c.status === 'In Progress').length;

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans overflow-hidden">
      {/* Sidebar Navigation */}
      <aside className="w-68 bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800 shrink-0">
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-white font-bold shadow-md">
            IMS
          </div>
          <div>
            <h1 className="text-xs font-bold text-white tracking-tight">Integrated Management System</h1>
            <p className="text-[10px] text-amber-400 font-medium">SMKP & ISO COMPLIANCE</p>
          </div>
        </div>

        {/* Menu Items */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1 text-xs">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">Menu Utama</div>
          
          <NavItem icon={<LayoutDashboard size={16} />} label="Dashboard Eksekutif" active={activeMenu === 'dashboard'} onClick={() => setActiveMenu('dashboard')} />
          <NavItem icon={<FileText size={16} />} label="Document Register" active={activeMenu === 'documents'} onClick={() => setActiveMenu('documents')} badge={totalDocs} />
          <NavItem icon={<BookOpen size={16} />} label="SOP & Work Procedures" active={activeMenu === 'sops'} onClick={() => setActiveMenu('sops')} />
          <NavItem icon={<Layers size={16} />} label="Integrated Requirements" active={activeMenu === 'requirements'} onClick={() => setActiveMenu('requirements')} />

          <div className="pt-4 px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">Standar & Regulasi</div>
          <NavItem icon={<ShieldCheck size={16} />} label="SMKP Minerba" active={activeMenu === 'smkp'} onClick={() => setActiveMenu('smkp')} />
          <NavItem icon={<Award size={16} />} label="ISO 9001 (Mutu)" active={activeMenu === 'iso9001'} onClick={() => setActiveMenu('iso9001')} />
          <NavItem icon={<Award size={16} />} label="ISO 14001 (Lingkungan)" active={activeMenu === 'iso14001'} onClick={() => setActiveMenu('iso14001')} />
          <NavItem icon={<Award size={16} />} label="ISO 45001 (K3)" active={activeMenu === 'iso45001'} onClick={() => setActiveMenu('iso45001')} />
          <NavItem icon={<FileSpreadsheet size={16} />} label="Legal Register" active={activeMenu === 'legal'} onClick={() => setActiveMenu('legal')} />

          <div className="pt-4 px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">Audit & CAPA</div>
          <NavItem icon={<CheckSquare size={16} />} label="Audit Program & Jadwal" active={activeMenu === 'audits'} onClick={() => setActiveMenu('audits')} />
          <NavItem icon={<CheckSquare size={16} />} label="Audit Checklist" active={activeMenu === 'checklists'} onClick={() => setActiveMenu('checklists')} />
          <NavItem icon={<AlertTriangle size={16} />} label="Temuan Outstanding" active={activeMenu === 'findings'} onClick={() => setActiveMenu('findings')} badge={openFindings} badgeColor="bg-rose-500" />
          <NavItem icon={<BarChart3 size={16} />} label="Manajemen Risiko & IBPR" active={activeMenu === 'risks'} onClick={() => setActiveMenu('risks')} />
          <NavItem icon={<Award size={16} />} label="Sasaran & KPI" active={activeMenu === 'objectives'} onClick={() => setActiveMenu('objectives')} />
          <NavItem icon={<FileText size={16} />} label="Tinjauan Manajemen" active={activeMenu === 'review'} onClick={() => setActiveMenu('review')} />

          <div className="pt-4 px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">Sistem & Laporan</div>
          <NavItem icon={<BarChart3 size={16} />} label="Laporan & Analisis" active={activeMenu === 'reports'} onClick={() => setActiveMenu('reports')} />
          <NavItem icon={<Bell size={16} />} label="Notifikasi" active={activeMenu === 'notifications'} onClick={() => setActiveMenu('notifications')} />
          <NavItem icon={<Users size={16} />} label="Manajemen Pengguna" active={activeMenu === 'users'} onClick={() => setActiveMenu('users')} />
          <NavItem icon={<Settings size={16} />} label="Pengaturan Sistem" active={activeMenu === 'settings'} onClick={() => setActiveMenu('settings')} />
          <NavItem icon={<Activity size={16} />} label="Audit Trail" active={activeMenu === 'auditlog'} onClick={() => setActiveMenu('auditlog')} />
        </div>

        {/* User Role Switcher at Bottom */}
        <div className="p-3 border-t border-slate-800 bg-slate-950">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-amber-600 text-white flex items-center justify-center font-bold text-xs">
              {currentUser.avatar}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-white truncate">{currentUser.name}</p>
              <p className="text-[10px] text-amber-400 truncate">{currentUser.role}</p>
            </div>
          </div>
          <select 
            value={currentUser.id}
            onChange={(e) => {
              const found = db.users.find(u => u.id === e.target.value);
              if (found) setCurrentUser(found);
            }}
            className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-[11px] rounded px-2 py-1 focus:outline-none focus:border-amber-500"
          >
            {db.users.map(u => (
              <option key={u.id} value={u.id}>{u.role} ({u.name.split(',')[0]})</option>
            ))}
          </select>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header Bar */}
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <h2 className="text-base font-bold text-slate-950 uppercase tracking-tight" style={{ color: '#080202' }}>
              {activeMenu === 'dashboard' && 'Dashboard HSE System & Training'}
              {activeMenu === 'documents' && 'Document Register & Version Control'}
              {activeMenu === 'sops' && 'SOP & Work Procedures Repository'}
              {activeMenu === 'requirements' && 'Integrated Requirements Matrix (SMKP & ISO)'}
              {activeMenu === 'smkp' && 'SMKP Minerba Master Standards & Elements'}
              {activeMenu === 'iso9001' && 'ISO 9001:2015 Quality Management System'}
              {activeMenu === 'iso14001' && 'ISO 14001:2015 Environmental Management System'}
              {activeMenu === 'iso45001' && 'ISO 45001:2018 OH&S Management System'}
              {activeMenu === 'legal' && 'Legal & Other Requirements Register'}
              {activeMenu === 'audits' && 'Audit Program & Schedule'}
              {activeMenu === 'checklists' && 'Audit Checklist Management'}
              {activeMenu === 'findings' && 'Temuan Audit Outstanding & CAPA'}
              {activeMenu === 'risks' && 'Risk Management & IBPR / HIRADC'}
              {activeMenu === 'objectives' && 'Objectives, Targets & KPI'}
              {activeMenu === 'review' && 'Management Review (Tinjauan Manajemen)'}
              {activeMenu === 'reports' && 'Reports & Compliance Analytics'}
              {activeMenu === 'notifications' && 'System Notifications & Alerts'}
              {activeMenu === 'users' && 'RBAC User Management'}
              {activeMenu === 'settings' && 'System Settings & Parameters'}
              {activeMenu === 'auditlog' && 'System Activity Audit Trail'}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {/* AI Assistant Button */}
            <button 
              onClick={() => setShowAiModal(true)}
              className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-lg text-xs font-semibold hover:from-amber-500 hover:to-amber-600 transition-all shadow-sm"
            >
              <Sparkles size={15} />
              <span>Compliance Assistant</span>
            </button>

            <div className="h-6 w-[1px] bg-slate-200"></div>

            <div className="text-right">
              <p className="text-xs font-semibold text-slate-900">Site Office</p>
              <p className="text-[10px] text-slate-500">{currentUser.department}</p>
            </div>
          </div>
        </header>

        {/* View Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-slate-100">
          {activeMenu === 'dashboard' && <DashboardView db={db} />}
          {activeMenu === 'documents' && <DocumentView db={db} onRefresh={fetchData} />}
          {activeMenu === 'sops' && <SopView db={db} />}
          {activeMenu === 'requirements' && <RequirementsView db={db} />}
          {activeMenu === 'smkp' && <SmkpView />}
          {activeMenu === 'iso9001' && <IsoView standard="ISO 9001:2015" />}
          {activeMenu === 'iso14001' && <IsoView standard="ISO 14001:2015" />}
          {activeMenu === 'iso45001' && <IsoView standard="ISO 45001:2018" />}
          {activeMenu === 'legal' && <LegalView db={db} />}
          {activeMenu === 'audits' && <AuditsView db={db} />}
          {activeMenu === 'checklists' && <ChecklistsView db={db} />}
          {activeMenu === 'findings' && <FindingsView db={db} onRefresh={fetchData} />}
          {activeMenu === 'risks' && <RisksView db={db} />}
          {activeMenu === 'objectives' && <ObjectivesView db={db} />}
          {activeMenu === 'review' && <ReviewView db={db} />}
          {activeMenu === 'reports' && <ReportsView db={db} />}
          {activeMenu === 'notifications' && <NotificationsView />}
          {activeMenu === 'users' && <UsersView db={db} />}
          {activeMenu === 'settings' && <SettingsView />}
          {activeMenu === 'auditlog' && <AuditLogView db={db} />}
        </main>
      </div>

      {/* AI Assistant Modal */}
      {showAiModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]">
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="text-amber-400" size={20} />
                <h3 className="font-bold text-sm">Gemini AI Compliance & Document Assistant</h3>
              </div>
              <button onClick={() => setShowAiModal(false)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>
            
            <div className="p-6 flex-1 overflow-y-auto space-y-4">
              <div className="flex gap-2">
                <button 
                  onClick={() => setAiMode('general')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${aiMode === 'general' ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                >
                  Tanya Regulasi / SOP
                </button>
                <button 
                  onClick={() => setAiMode('classify')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${aiMode === 'classify' ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                >
                  Klasifikasi Dokumen
                </button>
                <button 
                  onClick={() => setAiMode('gap')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${aiMode === 'gap' ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                >
                  Analisis Kesenjangan (Gap)
                </button>
                <button 
                  onClick={() => setAiMode('rootcause')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${aiMode === 'rootcause' ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                >
                  Analisis Akar Masalah (5 Whys)
                </button>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Pertanyaan atau Perintah untuk AI:</label>
                <textarea 
                  rows={3}
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder={
                    aiMode === 'classify' ? 'Masukkan judul dokumen atau ringkasan isi untuk diklasifikasikan ke elemen SMKP/ISO...' :
                    aiMode === 'gap' ? 'Tuliskan area operasional yang ingin dianalisis gap kepatuhannya...' :
                    aiMode === 'rootcause' ? 'Deskripsikan temuan audit atau masalah operasional...' :
                    'Tanyakan tentang Kepmen ESDM 1827 atau klausul ISO 45001...'
                  }
                  className="w-full p-3 border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-amber-600"
                ></textarea>
              </div>

              <button 
                onClick={handleAiSubmit}
                disabled={aiLoading}
                className="w-full py-2.5 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
              >
                {aiLoading ? <RefreshCw size={15} className="animate-spin" /> : <Sparkles size={15} />}
                <span>{aiLoading ? 'Memproses Analisis AI...' : 'Jalankan Analisis AI'}</span>
              </button>

              {aiResult && (
                <div className="mt-4 p-4 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase">
                    <span>Hasil Analisis AI (Saran & Rekomendasi)</span>
                    <span className="text-amber-600">Perlu Verifikasi Manusia</span>
                  </div>
                  <div className="whitespace-pre-wrap text-slate-800 leading-relaxed font-mono text-[11px] bg-white p-3 rounded border border-slate-200">
                    {aiResult}
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-100 border-t border-slate-200 text-right">
              <button onClick={() => setShowAiModal(false)} className="px-4 py-2 bg-slate-200 text-slate-800 text-xs font-medium rounded-lg hover:bg-slate-300">
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function NavItem({ icon, label, active, onClick, badge, badgeColor = 'bg-amber-500' }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void, badge?: number, badgeColor?: string }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg font-medium transition-colors ${active ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}
    >
      <div className="flex items-center gap-2.5">
        {icon}
        <span className="truncate">{label}</span>
      </div>
      {badge !== undefined && badge > 0 && (
        <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold text-white ${badgeColor}`}>
          {badge}
        </span>
      )}
    </button>
  );
}

// --- SUB VIEWS ---

function DashboardView({ db }: { db: DatabaseState }) {
  return (
    <div className="space-y-6">
      {/* Top Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard title="Total Pelatihan K3" value="3,450 Jam" subtitle="Training & Safety Induction YTD" icon={<BookOpen className="text-amber-600" />} />
        <MetricCard title="Kepatuhan SMKP Minerba" value="94.5%" subtitle="Skor Audit Internal Semester 1" icon={<ShieldCheck className="text-emerald-600" />} />
        <MetricCard title="Kepatuhan ISO Terpadu" value="91.2%" subtitle="ISO 9001 / 14001 / 45001" icon={<Award className="text-blue-600" />} />
        <MetricCard title="Temuan Audit Terbuka" value={db.findings.filter(f => f.status === 'Open' || f.status === 'In Progress').length} subtitle="Memerlukan tindakan CAPA" icon={<AlertTriangle className="text-rose-600" />} />
      </div>

      {/* SHE System & Training Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <h4 className="text-xs font-bold text-slate-700 uppercase mb-2">Statistik Safety Induction</h4>
          <p className="text-2xl font-bold text-slate-900">1,280 <span className="text-xs font-normal text-slate-500">Orang / Kontraktor</span></p>
          <p className="text-[11px] text-emerald-600 mt-1">✓ 100% tervalidasi sertifikat K3</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <h4 className="text-xs font-bold text-slate-700 uppercase mb-2">Pelaksanaan Toolbox Meeting</h4>
          <p className="text-2xl font-bold text-slate-900">98.4% <span className="text-xs font-normal text-slate-500">Kehadiran Shift</span></p>
          <p className="text-[11px] text-blue-600 mt-1">✓ Tercatat di 12 Pit & Workshop</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <h4 className="text-xs font-bold text-slate-700 uppercase mb-2">Laporan Temuan Outstanding</h4>
          <p className="text-2xl font-bold text-slate-900">{db.findings.filter(f => f.status !== 'Closed').length} <span className="text-xs font-normal text-slate-500">Temuan Open</span></p>
          <p className="text-[11px] text-rose-600 mt-1">⚠ Memerlukan tindak lanjut CAPA</p>
        </div>
      </div>

      {/* Compliance Progress Bars */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs lg:col-span-2 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Implementasi</h3>
          
          <ProgressBar label="Prosedur & Dokumen Operasional" percent={95.0} color="bg-emerald-600" />
          <ProgressBar label="Pengelolaan APD" percent={98.2} color="bg-blue-600" />
          <ProgressBar label="Izin Kerja Khusus (Permit to Work)" percent={92.5} color="bg-amber-600" />
          <ProgressBar label="Penerapan K3 dan KO" percent={94.0} color="bg-teal-600" />
          <ProgressBar label="Sistem Tanggap Darurat" percent={96.5} color="bg-indigo-600" />
          <ProgressBar label="Keselamatan Peledakan (Blasting Safety)" percent={97.1} color="bg-rose-600" />
          <ProgressBar label="Sistem Pembelian & Pengadaan (Procurement)" percent={91.8} color="bg-purple-600" />
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-3">Status Dokumen & Review</h3>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-600">Dokumen Aktif Berlaku</span>
                <span className="font-bold text-slate-900">{db.documents.filter(d => d.status === 'Active').length}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-600">Menunggu Review / Approval</span>
                <span className="font-bold text-amber-600">{db.documents.filter(d => d.status === 'Pending Approval' || d.status === 'Under Review').length}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-600">Dokumen Draft</span>
                <span className="font-bold text-slate-600">{db.documents.filter(d => d.status === 'Draft').length}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-600">Dokumen Obsolete / Kedaluwarsa</span>
                <span className="font-bold text-rose-600">{db.documents.filter(d => d.status === 'Obsolete').length}</span>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100">
            <p className="text-[11px] text-slate-500">Zona Waktu: Asia/Jakarta • Terakhir sinkronisasi: Hari ini</p>
          </div>
        </div>
      </div>

      {/* Outstanding Findings and Active CAPA */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Temuan Audit Outstanding (Open & In Progress)</h3>
          <span className="px-2.5 py-1 bg-rose-100 text-rose-700 font-bold text-xs rounded-lg">
            {db.findings.filter(f => f.status !== 'Closed').length} Temuan Belum Ditutup
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-600 uppercase text-[10px] tracking-wider border-b border-slate-200">
                <th className="p-3">ID Temuan</th>
                <th className="p-3">Uraian Ketidaksesuaian (Outstanding)</th>
                <th className="p-3">Departemen</th>
                <th className="p-3">Kategori</th>
                <th className="p-3">PIC</th>
                <th className="p-3">Target Selesai</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {db.findings.filter(f => f.status !== 'Closed').map(f => (
                <tr key={f.id} className="hover:bg-slate-50">
                  <td className="p-3 font-semibold text-slate-900">{f.id}</td>
                  <td className="p-3 text-slate-700 max-w-xs truncate">{f.statement}</td>
                  <td className="p-3 text-slate-600">{f.department}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${f.category === 'Major' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'}`}>
                      {f.category}
                    </span>
                  </td>
                  <td className="p-3 text-slate-700">{f.pic}</td>
                  <td className="p-3 font-mono text-slate-600">{f.targetDate}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-100 text-rose-700">
                      {f.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, subtitle, icon }: { title: string, value: string | number, subtitle: string, icon: React.ReactNode }) {
  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
      <div>
        <p className="text-xs font-medium text-slate-500">{title}</p>
        <h4 className="text-2xl font-bold text-slate-900 mt-1">{value}</h4>
        <p className="text-[11px] text-slate-400 mt-1">{subtitle}</p>
      </div>
      <div className="w-12 h-12 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center">
        {icon}
      </div>
    </div>
  );
}

function ProgressBar({ label, percent, color }: { label: string, percent: number, color: string }) {
  return (
    <div>
      <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
        <span>{label}</span>
        <span className="font-mono">{percent}%</span>
      </div>
      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${percent}%` }}></div>
      </div>
    </div>
  );
}

function DocumentView({ db, onRefresh }: { db: DatabaseState, onRefresh: () => void }) {
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form state
  const [newDoc, setNewDoc] = useState({
    docNumber: 'SOP/HSE/050',
    title: '',
    docType: 'SOP',
    department: 'HSE & Compliance',
    site: 'Site Lati (Berau)',
    businessProcess: 'Keselamatan Kerja',
    managementSystem: 'SMKP & ISO 45001',
    smkpElement: 'Elemen V',
    summary: '',
    author: 'Agus Pratama, IPM'
  });

  const handleCreateDoc = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/documents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...newDoc,
        issueDate: new Date().toLocaleDateString('id-ID'),
        effectiveDate: new Date().toLocaleDateString('id-ID'),
        nextReviewDate: '20-10-2027',
        revisionNo: 1,
        status: 'Pending Approval',
        reviewer: 'Ir. Budi Santoso, M.T.',
        approver: 'Dr. Marcus Aurelius',
        pic: 'Agus Pratama, IPM',
        confidentiality: 'Internal',
        filePath: '/files/new_uploaded_doc.pdf',
        keywords: ['SOP', 'K3', 'Tambang'],
        references: 'UU No 3 Tahun 2020',
        changeHistory: 'Draft awal',
        reviewNotes: 'Menunggu review',
        revisionReason: 'Dokumen baru'
      })
    });
    setShowAddModal(false);
    onRefresh();
  };

  const filteredDocs = db.documents.filter(d => {
    const matchSearch = d.title.toLowerCase().includes(search.toLowerCase()) || d.docNumber.toLowerCase().includes(search.toLowerCase());
    const matchDept = deptFilter === 'All' || d.department === deptFilter;
    const matchStatus = statusFilter === 'All' || d.status === statusFilter;
    return matchSearch && matchDept && matchStatus;
  });

  return (
    <div className="space-y-6">
      {/* Controls Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 min-w-[280px]">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Cari berdasarkan nomor atau judul dokumen..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-amber-600"
            />
          </div>
          <select 
            value={deptFilter} 
            onChange={(e) => setDeptFilter(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-700"
          >
            <option value="All">Semua Departemen</option>
            {db.departments.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-700"
          >
            <option value="All">Semua Status</option>
            <option value="Active">Active</option>
            <option value="Pending Approval">Pending Approval</option>
            <option value="Draft">Draft</option>
            <option value="Obsolete">Obsolete</option>
          </select>
        </div>

        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg text-xs font-semibold hover:bg-amber-500 transition-colors shadow-sm"
        >
          <Plus size={16} />
          <span>Registrasi Dokumen Baru</span>
        </button>
      </div>

      {/* Document Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-600 uppercase text-[10px] tracking-wider border-b border-slate-200">
                <th className="p-3.5">Nomor Dokumen</th>
                <th className="p-3.5">Judul Dokumen</th>
                <th className="p-3.5">Jenis</th>
                <th className="p-3.5">Departemen</th>
                <th className="p-3.5">Standar / Elemen</th>
                <th className="p-3.5">Rev</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDocs.map(doc => (
                <tr key={doc.id} className="hover:bg-slate-50">
                  <td className="p-3.5 font-mono font-semibold text-slate-900">{doc.docNumber}</td>
                  <td className="p-3.5 font-medium text-slate-800 max-w-sm truncate">{doc.title}</td>
                  <td className="p-3.5"><span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[11px] font-medium">{doc.docType}</span></td>
                  <td className="p-3.5 text-slate-600">{doc.department}</td>
                  <td className="p-3.5 text-slate-600 text-[11px]">{doc.managementSystem}</td>
                  <td className="p-3.5 font-mono text-slate-700">Rev.{doc.revisionNo}</td>
                  <td className="p-3.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                      doc.status === 'Active' ? 'bg-emerald-100 text-emerald-700' :
                      doc.status === 'Pending Approval' ? 'bg-amber-100 text-amber-700' :
                      doc.status === 'Obsolete' ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {doc.status}
                    </span>
                  </td>
                  <td className="p-3.5 text-right space-x-2">
                    <button onClick={() => alert(`Membuka preview dokumen: ${doc.title}`)} className="text-slate-600 hover:text-amber-600 font-medium">Lihat</button>
                    <button className="text-slate-600 hover:text-slate-900 font-medium">Download</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Document Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden border border-slate-200">
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="font-bold text-sm">Registrasi Dokumen / SOP Baru</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleCreateDoc} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Judul Dokumen</label>
                <input 
                  type="text" 
                  required
                  value={newDoc.title}
                  onChange={e => setNewDoc({...newDoc, title: e.target.value})}
                  placeholder="Contoh: SOP Pengujian Gas Metana di Underground Mining"
                  className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:border-amber-600"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nomor Dokumen</label>
                  <input 
                    type="text" 
                    required
                    value={newDoc.docNumber}
                    onChange={e => setNewDoc({...newDoc, docNumber: e.target.value})}
                    className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:border-amber-600 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Jenis Dokumen</label>
                  <select 
                    value={newDoc.docType}
                    onChange={e => setNewDoc({...newDoc, docType: e.target.value})}
                    className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:border-amber-600"
                  >
                    <option value="SOP">SOP</option>
                    <option value="Kebijakan">Kebijakan</option>
                    <option value="Instruksi Kerja">Instruksi Kerja</option>
                    <option value="Formulir">Formulir</option>
                    <option value="Manual">Manual</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Departemen Pemilik</label>
                  <select 
                    value={newDoc.department}
                    onChange={e => setNewDoc({...newDoc, department: e.target.value})}
                    className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:border-amber-600"
                  >
                    {db.departments.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Sistem Manajemen</label>
                  <input 
                    type="text" 
                    value={newDoc.managementSystem}
                    onChange={e => setNewDoc({...newDoc, managementSystem: e.target.value})}
                    className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:border-amber-600"
                  />
                </div>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Ringkasan Isi</label>
                <textarea 
                  rows={3}
                  value={newDoc.summary}
                  onChange={e => setNewDoc({...newDoc, summary: e.target.value})}
                  placeholder="Ringkasan singkat isi dokumen..."
                  className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:border-amber-600"
                ></textarea>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 bg-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-300">
                  Batal
                </button>
                <button type="submit" className="px-4 py-2 bg-amber-600 text-white font-semibold rounded-lg hover:bg-amber-500">
                  Simpan & Ajukan Persetujuan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function SopView({ db }: { db: DatabaseState }) {
  const sops = db.documents.filter(d => d.docType === 'SOP' || d.docType === 'Instruksi Kerja');
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {sops.map(sop => (
          <div key={sop.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-xs font-bold text-amber-600">{sop.docNumber}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-700">{sop.status}</span>
              </div>
              <h4 className="font-bold text-sm text-slate-900 mb-2">{sop.title}</h4>
              <p className="text-xs text-slate-600 line-clamp-3 mb-4">{sop.summary}</p>
            </div>
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span>{sop.department}</span>
              <button onClick={() => alert(`Membuka SOP: ${sop.title}`)} className="text-amber-600 font-semibold hover:underline">Baca SOP →</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RequirementsView({ db }: { db: DatabaseState }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      <div className="p-5 border-b border-slate-200 flex justify-between items-center">
        <div>
          <h3 className="font-bold text-sm text-slate-900">Matriks Integrasi Persyaratan SMKP & ISO</h3>
          <p className="text-xs text-slate-500 mt-0.5">Pemetaan relasi antara standar SMKP Minerba, ISO 9001, 14001, 45001 dan dokumen pengendali.</p>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-slate-50 text-slate-600 uppercase text-[10px] tracking-wider border-b border-slate-200">
              <th className="p-3.5">Standar & Klausul</th>
              <th className="p-3.5">Judul Persyaratan</th>
              <th className="p-3.5">Jenis Kewajiban</th>
              <th className="p-3.5">Bukti Pemenuhan Diharapkan</th>
              <th className="p-3.5">Departemen</th>
              <th className="p-3.5">Status Kepatuhan</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {db.requirements.map(req => (
              <tr key={req.id} className="hover:bg-slate-50">
                <td className="p-3.5 font-mono font-semibold text-slate-900">{req.standard}<br/><span className="text-amber-600">{req.clauseNumber}</span></td>
                <td className="p-3.5 font-medium text-slate-800">{req.title}</td>
                <td className="p-3.5"><span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[11px]">{req.obligationType}</span></td>
                <td className="p-3.5 text-slate-600 max-w-xs">{req.expectedEvidence}</td>
                <td className="p-3.5 text-slate-600">{req.department}</td>
                <td className="p-3.5">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                    req.compliantStatus === 'Compliant' ? 'bg-emerald-100 text-emerald-700' :
                    req.compliantStatus === 'Partially Compliant' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'
                  }`}>
                    {req.compliantStatus}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SmkpView() {
  const elements = [
    { no: 'I', title: 'Kebijakan Keselamatan Pertambangan', desc: 'Penetapan dan pengesahan kebijakan K3 serta keselamatan operasional.' },
    { no: 'II', title: 'Perencanaan', desc: 'Identifikasi bahaya, penilaian risiko (IBPR), dan pemenuhan peraturan perundang-undangan.' },
    { no: 'III', title: 'Organisasi dan Personil', desc: 'Struktur organisasi KTT, pengawas operasional, dan kompetensi pekerja.' },
    { no: 'IV', title: 'Pengelolaan Keselamatan Operasional', desc: 'Pengendalian teknis operasional tambang, alat berat, dan bahan peledak.' },
    { no: 'V', title: 'Pengelolaan Keselamatan Kerja', desc: 'APD, hygiene industri, ergonomi, dan kesiapsiagaan tanggap darurat.' },
    { no: 'VI', title: 'Pengelolaan Lingkungan Pertambangan', desc: 'Pengelolaan air asam tambang, reklamasi, limbah B3, dan revegetasi.' },
    { no: 'VII', title: 'Pengelolaan Kesehatan Kerja & Statistik', desc: 'Pemeriksaan kesehatan berkala dan pencatatan statistik kecelakaan.' }
  ];

  return (
    <div className="space-y-4">
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs mb-6">
        <h3 className="font-bold text-sm text-slate-900 mb-1">Master Struktur SMKP Minerba (Kepmen ESDM No. 1827 K/30/MEM/2018)</h3>
        <p className="text-xs text-slate-600">Sistem Manajemen Keselamatan Pertambangan wajib diterapkan oleh setiap pemegang IUP dan IUPK.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {elements.map(el => (
          <div key={el.no} className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center gap-3 mb-2">
              <span className="w-8 h-8 rounded-lg bg-amber-600 text-white font-bold text-xs flex items-center justify-center">
                {el.no}
              </span>
              <h4 className="font-bold text-sm text-slate-900">{el.title}</h4>
            </div>
            <p className="text-xs text-slate-600 pl-11">{el.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function IsoView({ standard }: { standard: string }) {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
      <h3 className="font-bold text-base text-slate-900">Struktur Klausul {standard}</h3>
      <p className="text-xs text-slate-600">Mengikuti High Level Structure (HLS) Annex SL untuk integrasi penuh dengan SMKP Minerba.</p>
      <div className="space-y-2 text-xs">
        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
          <strong className="text-slate-900">Klausul 4: Konteks Organisasi</strong> — Pemahaman organisasi dan kebutuhan pihak berkepentingan.
        </div>
        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
          <strong className="text-slate-900">Klausul 5: Kepemimpinan & Partisipasi Pekerja</strong> — Komitmen manajemen puncak dan konsultasi pekerja.
        </div>
        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
          <strong className="text-slate-900">Klausul 6: Perencanaan</strong> — Penilaian risiko, aspek lingkungan, dan sasaran pencapaian.
        </div>
        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
          <strong className="text-slate-900">Klausul 7: Dukungan</strong> — Sumber daya, kompetensi, kesadaran, dan informasi terdokumentasi.
        </div>
        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
          <strong className="text-slate-900">Klausul 8: Operasi</strong> — Perencanaan dan pengendalian operasional serta tanggap darurat.
        </div>
        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
          <strong className="text-slate-900">Klausul 9: Evaluasi Kinerja</strong> — Pemantauan, pengukuran, audit internal, dan tinjauan manajemen.
        </div>
        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
          <strong className="text-slate-900">Klausul 10: Peningkatan</strong> — Insiden, ketidaksesuaian, tindakan korektif, dan peningkatan berkelanjutan.
        </div>
      </div>
    </div>
  );
}

function LegalView({ db }: { db: DatabaseState }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      <div className="p-5 border-b border-slate-200">
        <h3 className="font-bold text-sm text-slate-900">Legal & Other Requirements Register</h3>
        <p className="text-xs text-slate-500 mt-0.5">Daftar peraturan perundang-undangan dan kewajiban kepatuhan pertambangan.</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-slate-50 text-slate-600 uppercase text-[10px] tracking-wider border-b border-slate-200">
              <th className="p-3.5">Nomor Regulasi</th>
              <th className="p-3.5">Judul Peraturan</th>
              <th className="p-3.5">Penerbit</th>
              <th className="p-3.5">Tahun</th>
              <th className="p-3.5">Status</th>
              <th className="p-3.5">Evaluasi Kepatuhan</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {db.legalRegister.map(reg => (
              <tr key={reg.id} className="hover:bg-slate-50">
                <td className="p-3.5 font-mono font-semibold text-slate-900">{reg.regNumber}</td>
                <td className="p-3.5 font-medium text-slate-800">{reg.title}</td>
                <td className="p-3.5 text-slate-600">{reg.publisher}</td>
                <td className="p-3.5 font-mono">{reg.year}</td>
                <td className="p-3.5"><span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded text-[10px] font-semibold">{reg.status}</span></td>
                <td className="p-3.5"><span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-[10px] font-semibold">{reg.evalResult}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AuditsView({ db }: { db: DatabaseState }) {
  return (
    <div className="space-y-4">
      {db.audits.map(aud => (
        <div key={aud.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold text-amber-600">{aud.auditNo}</span>
            <span className="px-2.5 py-1 rounded text-xs font-semibold bg-blue-100 text-blue-700">{aud.status}</span>
          </div>
          <h4 className="font-bold text-sm text-slate-900">{aud.auditType} — {aud.systemAudited}</h4>
          <p className="text-xs text-slate-600"><strong>Lingkup:</strong> {aud.scope}</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-3 border-t border-slate-100 text-xs">
            <div><span className="text-slate-400 block">Site / Lokasi</span><span className="font-semibold text-slate-800">{aud.site}</span></div>
            <div><span className="text-slate-400 block">Lead Auditor</span><span className="font-semibold text-slate-800">{aud.leadAuditor}</span></div>
            <div><span className="text-slate-400 block">Jadwal Pelaksanaan</span><span className="font-semibold text-slate-800 font-mono">{aud.execDate}</span></div>
            <div><span className="text-slate-400 block">Auditee</span><span className="font-semibold text-slate-800">{aud.auditee}</span></div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ChecklistsView({ db }: { db: DatabaseState }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      <div className="p-5 border-b border-slate-200">
        <h3 className="font-bold text-sm text-slate-900">Audit Checklist & Verifikasi Lapangan</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-slate-50 text-slate-600 uppercase text-[10px] tracking-wider border-b border-slate-200">
              <th className="p-3.5">Klausul / Elemen</th>
              <th className="p-3.5">Pertanyaan Audit</th>
              <th className="p-3.5">Kriteria Penerimaan</th>
              <th className="p-3.5">Hasil</th>
              <th className="p-3.5">Auditor</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {db.checklists.map(chk => (
              <tr key={chk.id} className="hover:bg-slate-50">
                <td className="p-3.5 font-mono text-slate-900">{chk.clauseOrElement}</td>
                <td className="p-3.5 font-medium text-slate-800 max-w-xs">{chk.question}</td>
                <td className="p-3.5 text-slate-600 max-w-xs">{chk.acceptanceCriteria}</td>
                <td className="p-3.5">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${chk.result === 'Sesuai' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                    {chk.result}
                  </span>
                </td>
                <td className="p-3.5 text-slate-700">{chk.auditor}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function FindingsView({ db, onRefresh }: { db: DatabaseState, onRefresh: () => void }) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex justify-between items-center">
          <div>
            <h3 className="font-bold text-sm text-slate-900">Daftar Temuan Ketidaksesuaian & CAPA</h3>
            <p className="text-xs text-slate-500 mt-0.5">Pengelolaan akar masalah, tindakan korektif, dan verifikasi efektivitas.</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-600 uppercase text-[10px] tracking-wider border-b border-slate-200">
                <th className="p-3.5">ID Temuan</th>
                <th className="p-3.5">Pernyataan Ketidaksesuaian</th>
                <th className="p-3.5">Departemen</th>
                <th className="p-3.5">Kategori</th>
                <th className="p-3.5">PIC</th>
                <th className="p-3.5">Target</th>
                <th className="p-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {db.findings.map(f => (
                <tr key={f.id} className="hover:bg-slate-50">
                  <td className="p-3.5 font-mono font-semibold text-slate-900">{f.id}</td>
                  <td className="p-3.5 font-medium text-slate-800 max-w-sm">{f.statement}</td>
                  <td className="p-3.5 text-slate-600">{f.department}</td>
                  <td className="p-3.5"><span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${f.category === 'Major' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'}`}>{f.category}</span></td>
                  <td className="p-3.5 text-slate-700">{f.pic}</td>
                  <td className="p-3.5 font-mono">{f.targetDate}</td>
                  <td className="p-3.5"><span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${f.status === 'Closed' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>{f.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function RisksView({ db }: { db: DatabaseState }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      <div className="p-5 border-b border-slate-200">
        <h3 className="font-bold text-sm text-slate-900">Manajemen Risiko (IBPR / HIRADC)</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-slate-50 text-slate-600 uppercase text-[10px] tracking-wider border-b border-slate-200">
              <th className="p-3.5">Kode</th>
              <th className="p-3.5">Proses / Aktivitas</th>
              <th className="p-3.5">Deskripsi Bahaya</th>
              <th className="p-3.5">Pengendalian Eksisting</th>
              <th className="p-3.5">Tingkat Risiko</th>
              <th className="p-3.5">PIC</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {db.risks.map(r => (
              <tr key={r.id} className="hover:bg-slate-50">
                <td className="p-3.5 font-mono font-semibold">{r.code}</td>
                <td className="p-3.5 font-medium">{r.processOrActivity}</td>
                <td className="p-3.5 text-slate-700">{r.hazardDescription}</td>
                <td className="p-3.5 text-slate-600">{r.existingControl}</td>
                <td className="p-3.5"><span className="px-2 py-0.5 bg-rose-100 text-rose-700 rounded text-[10px] font-bold">{r.riskLevel}</span></td>
                <td className="p-3.5">{r.pic}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ObjectivesView({ db }: { db: DatabaseState }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {db.objectives.map(obj => (
        <div key={obj.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex justify-between items-center">
            <span className="px-2.5 py-0.5 bg-amber-100 text-amber-700 rounded text-xs font-semibold">{obj.category}</span>
            <span className="font-mono text-xs font-bold text-emerald-600">Progress: {obj.currentProgress}</span>
          </div>
          <h4 className="font-bold text-sm text-slate-900">{obj.objectiveName}</h4>
          <p className="text-xs text-slate-600"><strong>Target:</strong> {obj.targetValue} • <strong>Departemen:</strong> {obj.department}</p>
        </div>
      ))}
    </div>
  );
}

function ReviewView({ db }: { db: DatabaseState }) {
  return (
    <div className="space-y-4">
      {db.managementReviews.map(mr => (
        <div key={mr.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex justify-between items-center">
            <span className="font-mono text-xs text-slate-400">{mr.date}</span>
            <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-700 rounded text-xs font-semibold">{mr.status}</span>
          </div>
          <h4 className="font-bold text-sm text-slate-900">{mr.title}</h4>
          <p className="text-xs text-slate-700"><strong>Pimpinan Rapat:</strong> {mr.chairperson} ({mr.attendees} Peserta)</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-slate-100 text-xs">
            <div className="p-3 bg-slate-50 rounded-lg"><strong>Key Inputs:</strong> {mr.keyInputs}</div>
            <div className="p-3 bg-slate-50 rounded-lg"><strong>Key Outputs / Keputusan:</strong> {mr.keyOutputs}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ReportsView({ db }: { db: DatabaseState }) {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-6">
      <div>
        <h3 className="font-bold text-sm text-slate-900">Pusat Laporan & Ekspor Data</h3>
        <p className="text-xs text-slate-500 mt-0.5">Unduh laporan resmi kepatuhan SMKP dan ISO dalam format Excel atau PDF.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ReportCard title="Master Document Register" desc="Daftar seluruh dokumen dan SOP aktif." onClick={() => alert('Mengunduh Master Document Register.xlsx')} />
        <ReportCard title="Laporan Kepatuhan SMKP" desc="Rekapitulasi pemenuhan Elemen I s.d VII." onClick={() => alert('Mengunduh Laporan Kepatuhan SMKP.pdf')} />
        <ReportCard title="Laporan Temuan & CAPA" desc="Status temuan audit dan overdue action." onClick={() => alert('Mengunduh Laporan CAPA.xlsx')} />
        <ReportCard title="Integrated Requirements Matrix" desc="Pemenuhan klausul ISO & regulasi." onClick={() => alert('Mengunduh Integrated Requirements Matrix.xlsx')} />
        <ReportCard title="Legal Register Compliance" desc="Evaluasi peraturan perundang-undangan." onClick={() => alert('Mengunduh Legal Register.pdf')} />
        <ReportCard title="Management Review Summary" desc="Notulensi dan keputusan tinjauan manajemen." onClick={() => alert('Mengunduh Management Review.pdf')} />
      </div>
    </div>
  );
}

function ReportCard({ title, desc, onClick }: { title: string, desc: string, onClick: () => void }) {
  return (
    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col justify-between hover:border-amber-500 transition-colors">
      <div>
        <h4 className="font-bold text-xs text-slate-900 mb-1">{title}</h4>
        <p className="text-[11px] text-slate-600 mb-4">{desc}</p>
      </div>
      <button onClick={onClick} className="flex items-center gap-2 text-xs font-semibold text-amber-600 hover:underline">
        <Download size={14} />
        <span>Unduh Laporan</span>
      </button>
    </div>
  );
}

function NotificationsView() {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
      <h3 className="font-bold text-sm text-slate-900">Pusat Notifikasi & Pengingat Sistem</h3>
      <div className="space-y-3 text-xs">
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
          <Clock className="text-amber-600 shrink-0 mt-0.5" size={16} />
          <div>
            <p className="font-semibold text-amber-900">Jatuh Tempo Review Dokumen SOP/HSE/012</p>
            <p className="text-amber-700 mt-0.5">Dokumen Prosedur Tanggap Darurat mendekati jadwal tinjauan tahunan (20 Januari 2026).</p>
          </div>
        </div>
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-start gap-3">
          <AlertTriangle className="text-rose-600 shrink-0 mt-0.5" size={16} />
          <div>
            <p className="font-semibold text-rose-900">Temuan Audit FIND-001 Membutuhkan Tindakan CAPA</p>
            <p className="text-rose-700 mt-0.5">Target penyelesaian tindakan korektif kolam pengendapan jatuh tempo pada 30 April 2026.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function UsersView({ db }: { db: DatabaseState }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      <div className="p-5 border-b border-slate-200">
        <h3 className="font-bold text-sm text-slate-900">Manajemen Pengguna & Role-Based Access Control (RBAC)</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-slate-50 text-slate-600 uppercase text-[10px] tracking-wider border-b border-slate-200">
              <th className="p-3.5">Nama Pengguna</th>
              <th className="p-3.5">Email</th>
              <th className="p-3.5">Peran (Role)</th>
              <th className="p-3.5">Departemen</th>
              <th className="p-3.5">Site / Lokasi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {db.users.map(u => (
              <tr key={u.id} className="hover:bg-slate-50">
                <td className="p-3.5 font-semibold text-slate-900 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-[10px]">{u.avatar}</div>
                  <span>{u.name}</span>
                </td>
                <td className="p-3.5 text-slate-600">{u.email}</td>
                <td className="p-3.5"><span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded font-semibold text-[10px]">{u.role}</span></td>
                <td className="p-3.5 text-slate-600">{u.department}</td>
                <td className="p-3.5 text-slate-600">{u.site}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SettingsView() {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-6">
      <div>
        <h3 className="font-bold text-sm text-slate-900">Pengaturan Sistem & Konfigurasi</h3>
        <p className="text-xs text-slate-500 mt-0.5">Konfigurasi parameter perusahaan, metode perhitungan kepatuhan, dan integrasi database.</p>
      </div>

      <div className="space-y-4 text-xs">
        <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 flex justify-between items-center">
          <div>
            <h4 className="font-bold text-slate-900">Mode Simulasi & Data Demo</h4>
            <p className="text-slate-600 mt-0.5">Mengatur ulang data sistem ke kondisi awal demo pertambangan.</p>
          </div>
          <button onClick={() => alert('Database direset ke demo state')} className="px-4 py-2 bg-slate-900 text-white font-semibold rounded-lg hover:bg-slate-800">
            Reset Data Demo
          </button>
        </div>
      </div>
    </div>
  );
}

function AuditLogView({ db }: { db: DatabaseState }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      <div className="p-5 border-b border-slate-200">
        <h3 className="font-bold text-sm text-slate-900">Audit Trail & Log Aktivitas Sistem</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-slate-50 text-slate-600 uppercase text-[10px] tracking-wider border-b border-slate-200">
              <th className="p-3.5">Waktu</th>
              <th className="p-3.5">Pengguna</th>
              <th className="p-3.5">Aksi</th>
              <th className="p-3.5">Detail</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {db.auditLogs.map(log => (
              <tr key={log.id} className="hover:bg-slate-50">
                <td className="p-3.5 font-mono text-slate-500">{log.timestamp}</td>
                <td className="p-3.5 font-semibold text-slate-900">{log.user}</td>
                <td className="p-3.5"><span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[10px] font-medium">{log.action}</span></td>
                <td className="p-3.5 text-slate-700">{log.details}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
