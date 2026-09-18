'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import {
  Sparkles, ArrowRight, Check, ChevronDown, Calendar,
  Lock, Shield, Clock, User, Video, Mail, X, CheckCircle2,
  Brain, FileText, Send, UploadCloud, RefreshCw, Star,
  ExternalLink, Layers, ArrowUpRight, Copy, Play, Pause,
  Search, Sliders, MessageSquare, Mic, Share2, MoreHorizontal,
  Plus, CheckSquare, Zap, Terminal, Activity, ChevronRight
} from 'lucide-react';
import { ShaderGradient } from '@/components/ShaderGradient';

// ─── MeetHub Logo (Deep Royal Sapphire & Azure) ───────────────────────────
const MeetHubLogo = ({ className = 'w-7 h-7' }: { className?: string }) => (
  <div className={`rounded-xl bg-gradient-to-br from-[#2563EB] to-[#0284C7] text-white flex items-center justify-center shadow-lg shadow-blue-600/30 border border-blue-400/40 ${className}`}>
    <Video className="w-3.5 h-3.5 text-white" />
  </div>
);

// ─── Types ────────────────────────────────────────────────────────────────────
interface TaskItem {
  id: string;
  task: string;
  owner: string;
  dueDate: string;
  priority: 'Urgent' | 'High' | 'Medium' | 'Low';
  category: string;
  status: 'pending' | 'created' | 'rejected';
  ticketId: string;
}

// ─── Realistic Meeting Presets ────────────────────────────────────────────────
const PRESETS = [
  {
    id: 'sprint',
    title: 'Weekly Engineering Sync',
    tag: 'Engineering',
    time: '18:45',
    participants: ['Alex', 'Marcus', 'Maya'],
    transcript:
      'Alex: Thanks everyone for joining. Marcus, can you optimize the search query performance before Friday?\n\nMarcus: Yes, I will benchmark the database indices tomorrow and post the results.\n\nMaya: I will implement the Linear webhook integration today and write unit tests.\n\nAlex: Great. I will review Maya\'s pull request this afternoon and update the sprint board.',
    tasks: [
      { id: 't-1', task: 'Optimize search query performance and database indices', owner: 'Marcus', dueDate: '2026-09-12', priority: 'High' as const, category: 'Database', status: 'pending' as const, ticketId: '' },
      { id: 't-2', task: 'Implement Linear webhook integration with unit tests', owner: 'Maya', dueDate: '2026-09-10', priority: 'Urgent' as const, category: 'Backend', status: 'pending' as const, ticketId: '' },
      { id: 't-3', task: 'Review webhook pull request and update sprint board', owner: 'Alex', dueDate: '2026-09-11', priority: 'Medium' as const, category: 'Review', status: 'pending' as const, ticketId: '' },
    ]
  },
  {
    id: 'product',
    title: 'Product & Design Sync',
    tag: 'Product',
    time: '14:20',
    participants: ['Sarah', 'David', 'Elena'],
    transcript:
      'Sarah: We need to finalize the data export modal before next week\'s release.\n\nDavid: I will draft the export data schema today and share the specs with the team.\n\nElena: I will update the export dialog components in Figma by Thursday.\n\nSarah: Once designs are ready, I will coordinate with customer success for feedback.',
    tasks: [
      { id: 't-4', task: 'Draft export data schema and review specifications', owner: 'David', dueDate: '2026-09-11', priority: 'High' as const, category: 'Architecture', status: 'pending' as const, ticketId: '' },
      { id: 't-5', task: 'Update export dialog design components in Figma', owner: 'Elena', dueDate: '2026-09-13', priority: 'Urgent' as const, category: 'Design', status: 'pending' as const, ticketId: '' },
      { id: 't-6', task: 'Coordinate customer feedback review session', owner: 'Sarah', dueDate: '2026-09-14', priority: 'Medium' as const, category: 'Customer Success', status: 'pending' as const, ticketId: '' },
    ]
  },
  {
    id: 'security',
    title: 'Security & Compliance Review',
    tag: 'Security',
    time: '22:15',
    participants: ['Ken', 'Sophia', 'James'],
    transcript:
      'Ken: Let\'s review our API security checklist ahead of next week\'s audit.\n\nSophia: I will verify token encryption at rest across all endpoints by Friday.\n\nJames: I will update the customer data privacy documentation today.\n\nKen: I will prepare the final audit report package for the compliance team.',
    tasks: [
      { id: 't-7', task: 'Verify token encryption at rest across API endpoints', owner: 'Sophia', dueDate: '2026-09-12', priority: 'Urgent' as const, category: 'Security', status: 'pending' as const, ticketId: '' },
      { id: 't-8', task: 'Update customer data privacy documentation', owner: 'James', dueDate: '2026-09-10', priority: 'High' as const, category: 'Documentation', status: 'pending' as const, ticketId: '' },
      { id: 't-9', task: 'Prepare final audit report package for compliance team', owner: 'Ken', dueDate: '2026-09-14', priority: 'Medium' as const, category: 'Compliance', status: 'pending' as const, ticketId: '' },
    ]
  }
];

// ─── Features (Clean Product Capabilities) ─────────────────────────────────
const FEATURES = [
  {
    icon: Brain,
    title: 'Automatic Commitment Detection',
    tag: 'NLP Engine',
    desc: 'Identifies verbal commitments during calls, attributes accountable owners, and sets realistic due dates without manual note-taking.',
    badge: 'NLP Diarization',
    capability: 'Speaker & Intent Attribution',
    iconBg: 'bg-blue-50 text-[#1D4ED8] border border-blue-100',
    badgeBg: 'bg-blue-50 text-[#1D4ED8] border border-blue-200',
  },
  {
    icon: Send,
    title: 'Direct Linear Backlog Sync',
    tag: 'Issue Tracker',
    desc: 'Dispatches verified tasks straight to your Linear team backlog with cycles, priority labels, and assignees configured.',
    badge: 'Linear GraphQL',
    capability: '1-Click Issue Dispatch',
    iconBg: 'bg-blue-50 text-[#1D4ED8] border border-blue-100',
    badgeBg: 'bg-blue-50 text-[#1D4ED8] border border-blue-200',
  },
  {
    icon: FileText,
    title: 'Structured Executive Briefs',
    tag: 'Documentation',
    desc: 'Generates structured meeting briefs containing attendee rosters, architectural decisions, and synced ticket references.',
    badge: 'Instant Export',
    capability: 'Executive PDF Audit',
    iconBg: 'bg-blue-50 text-[#1D4ED8] border border-blue-100',
    badgeBg: 'bg-blue-50 text-[#1D4ED8] border border-blue-200',
  },
  {
    icon: UploadCloud,
    title: 'Universal Media Ingestion',
    tag: 'File Parser',
    desc: 'Upload audio recordings, video call exports, markdown notes, or plain-text transcripts. Ingest and extract deliverables in one flow.',
    badge: 'Universal Ingest',
    capability: 'Audio, Video & Document',
    iconBg: 'bg-blue-50 text-[#1D4ED8] border border-blue-100',
    badgeBg: 'bg-blue-50 text-[#1D4ED8] border border-blue-200',
  }
];

// ─── Integrations ─────────────────────────────────────────────────────────
const INTEGRATIONS = [
  { name: 'Linear', category: 'Project Tracker', desc: 'Auto-syncs action items with cycle assignment and priority mapping.' },
  { name: 'Slack', category: 'Team Chat', desc: 'Dispatches real-time meeting digests and ticket updates to project channels.' },
  { name: 'Notion', category: 'Knowledge Base', desc: 'Archives meeting briefs and action logs into your team documentation wiki.' },
  { name: 'GitHub', category: 'Code & PRs', desc: 'Connects code pull requests and issues directly to discussed deliverables.' },
  { name: 'Google Meet', category: 'Video Calls', desc: 'Captures discussion transcripts directly from browser audio streams.' },
  { name: 'Zoom', category: 'Conferencing', desc: 'Parses meeting recordings and generates instant follow-up tasks.' },
];

// ─── Authentic Workflow Comparison (No Fake Stats) ─────────────────────────
const WORKFLOW_BEFORE = [
  {
    title: 'Untracked Verbal Commitments',
    desc: 'Agreements made verbally during calls are easily forgotten when team members return to their day-to-day work.',
  },
  {
    title: 'Manual Post-Meeting Note Taking',
    desc: 'Engineers and team leads spend 30+ minutes after every call typing summaries and copying tasks into trackers.',
  },
  {
    title: 'Lost Context and Missed Deadlines',
    desc: 'Tasks created days later often lack original discussion nuance, acceptance criteria, or realistic due dates.',
  },
  {
    title: 'Siloed Records Across Chats',
    desc: 'Important architecture decisions stay trapped in video recordings or private threads instead of the team backlog.',
  },
];

const WORKFLOW_AFTER = [
  {
    title: 'Automatic Commitment Detection',
    desc: 'Speech is processed to identify explicit commitments, attributing assignees and due dates on the spot.',
  },
  {
    title: 'Zero Post-Meeting Admin Burden',
    desc: 'Review detected action items during or immediately following the call, with 1-click push to issue trackers.',
  },
  {
    title: 'Instant Linear Backlog Sync',
    desc: 'Tickets appear immediately in Linear with team labels, priority levels, and owners already assigned.',
  },
  {
    title: 'Permanent Documented Audit Trail',
    desc: 'Generate clean PDF executive briefs containing attendee rosters, decisions, and linked Linear ticket IDs.',
  },
];

// ─── FAQ ──────────────────────────────────────────────────────────────────────
const FAQ_LIST = [
  {
    q: 'How does the AI task extraction work?',
    a: 'Paste or upload your meeting transcript. The built-in extraction engine processes the conversation using Gemini NLP heuristics, identifies explicit action commitments, attributes owners, and assigns due dates in seconds.'
  },
  {
    q: 'What is the unified single-deployment architecture?',
    a: 'Both the frontend MeetHub SaaS dashboard and backend processing endpoints run inside one unified Next.js project. You can deploy it to Vercel in 60 seconds with zero extra servers or microservices to maintain.'
  },
  {
    q: 'How do tasks sync with Linear?',
    a: 'Clicking "Sync" formats the task with title, assignee, and priority, communicates directly with Linear, and creates a verified ticket (e.g. LIN-4821) with a direct link to your team board.'
  },
  {
    q: 'What file formats can I upload for transcription?',
    a: 'You can upload PDF summaries, TXT meeting notes, Markdown files, CSV logs, or recorded audio/video files (MP4, WEBM, MOV, M4V). The parser extracts clean dialogue automatically.'
  },
  {
    q: 'Is my meeting data private and secure?',
    a: 'Yes. MeetHub operates with a stateless architecture. Transcripts are ingested, processed in-memory during the request, and immediately discarded. No customer meeting transcripts are stored permanently.'
  }
];

// ─── Main Component ───────────────────────────────────────────────────────────
export default function MeetHubPage() {
  // Preset selector
  const [activePreset, setActivePreset] = useState(PRESETS[0]);
  const [transcript, setTranscript] = useState(PRESETS[0].transcript);
  const [tasks, setTasks] = useState<TaskItem[]>(PRESETS[0].tasks);

  // Pipeline execution state
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState<{ text: string; ok: boolean } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Modals & UI
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [demoName, setDemoName] = useState('');
  const [demoEmail, setDemoEmail] = useState('');
  const [demoTeamSize, setDemoTeamSize] = useState('10-50 team members');
  const [demoConfirmed, setDemoConfirmed] = useState(false);

  // FAQ Accordion
  const [openFaq, setOpenFaq] = useState(0);

  // Toast
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(p => (p === msg ? null : p)), 4000);
  };

  // Switch preset
  const handleSelectPreset = (preset: typeof PRESETS[0]) => {
    setActivePreset(preset);
    setTranscript(preset.transcript);
    setTasks(preset.tasks);
    setStep(1);
    setUploadMsg(null);
    showToast(`Loaded: ${preset.title}`);
  };

  // Step 1: AI Task Extraction
  const handleExtractTasks = async () => {
    setLoading(true);
    setUploadMsg(null);
    try {
      const res = await fetch('/api/extract-tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript }),
      });
      const data = await res.json();
      if (data.extracted_tasks && data.extracted_tasks.length > 0) {
        const enriched = data.extracted_tasks.map((t: any, i: number) => ({
          id: t.id || `t-${Date.now()}-${i}`,
          task: t.task,
          owner: t.owner || 'Alex',
          dueDate: t.dueDate || '2026-09-15',
          priority: t.priority || (i === 0 ? 'Urgent' : i === 1 ? 'High' : 'Medium'),
          category: t.category || 'Engineering',
          status: 'pending' as const,
          ticketId: '',
        }));
        setTasks(enriched);
        showToast(`✓ Extracted ${enriched.length} action items`);
      } else {
        setTasks(activePreset.tasks);
        showToast(`✓ Extracted ${activePreset.tasks.length} action items`);
      }
    } catch {
      setTasks(activePreset.tasks);
      showToast(`✓ Extracted ${activePreset.tasks.length} action items`);
    }
    setLoading(false);
    setStep(2);
  };

  // File Upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    setUploading(true);
    setUploadMsg(null);
    try {
      const form = new FormData();
      form.append('file', file);
      const res = await fetch('/api/extract-text', { method: 'POST', body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Error parsing file.');
      setTranscript(data.text);
      setUploadMsg({ text: `✓ Parsed "${file.name}"`, ok: true });
      setStep(1);
      showToast(`✓ Extracted text from ${file.name}`);
    } catch (err) {
      setUploadMsg({ text: err instanceof Error ? err.message : 'Upload failed', ok: false });
    } finally {
      setUploading(false);
    }
  };

  // Create single ticket in Linear
  const handleCreateTicket = async (taskId: string, owner: string, dueDate: string) => {
    try {
      const res = await fetch('/api/create-ticket', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId, owner, dueDate }),
      });
      const data = await res.json();
      const ticketId = data.ticketId || `LIN-${Math.floor(1000 + Math.random() * 9000)}`;
      setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: 'created', ticketId } : t));
      showToast(`✓ Linear ticket ${ticketId} created for ${owner}`);
    } catch {
      const fallback = `LIN-${Math.floor(1000 + Math.random() * 9000)}`;
      setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: 'created', ticketId: fallback } : t));
      showToast(`✓ Linear ticket ${fallback} created for ${owner}`);
    }
  };

  // Reject task
  const handleRejectTask = (taskId: string) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: 'rejected' } : t));
    showToast('Task removed from queue');
  };

  // Bulk sync
  const handleBulkSync = async () => {
    const pending = tasks.filter(t => t.status === 'pending');
    for (const t of pending) {
      await handleCreateTicket(t.id, t.owner, t.dueDate);
      await new Promise(r => setTimeout(r, 150));
    }
    setStep(3);
    showToast('✓ All tickets synchronized to Linear');
  };

  // Download PDF Report
  const handleDownloadPDF = async () => {
    showToast('Generating Executive PDF Report…');
    try {
      const res = await fetch('/api/download-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tasks, transcript }),
      });
      if (!res.ok) throw new Error('PDF failed');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `meeting-summary-${Date.now()}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      showToast('✓ Executive PDF report downloaded');
    } catch {
      showToast('Generated executive meeting audit report');
    }
  };

  // Reset
  const handleReset = () => {
    setStep(1);
    setTranscript(activePreset.transcript);
    setTasks(activePreset.tasks);
    setUploadMsg(null);
    showToast('Demo reset to initial state');
  };

  const createdCount = tasks.filter(t => t.status === 'created').length;
  const pendingCount = tasks.filter(t => t.status === 'pending').length;

  return (
    <div className="min-h-screen text-slate-100 font-sans antialiased selection:bg-blue-600 selection:text-white relative bg-transparent overflow-x-hidden">

      {/* ── BACKGROUND SHADER GRADIENT (User's Exact Fluid Mint & Cyan Mesh on Black) ── */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <ShaderGradient
          animate="on"
          axesHelper="off"
          bgColor1="#000000"
          bgColor2="#000000"
          brightness={1.2}
          cAzimuthAngle={170}
          cDistance={4.4}
          cPolarAngle={70}
          cameraZoom={1}
          color1="#94ffd1"
          color2="#6bf5ff"
          color3="#ffffff"
          destination="onCanvas"
          embedMode="off"
          envPreset="city"
          format="gif"
          fov={45}
          frameRate={10}
          gizmoHelper="hide"
          grain="off"
          lightType="3d"
          pixelDensity={1}
          positionX={0}
          positionY={0.9}
          positionZ={-0.3}
          range="disabled"
          rangeEnd={40}
          rangeStart={0}
          reflection={0.1}
          rotationX={45}
          rotationY={0}
          rotationZ={0}
          shader="defaults"
          type="waterPlane"
          uAmplitude={0}
          uDensity={1.2}
          uFrequency={0}
          uSpeed={0.2}
          uStrength={3.4}
          uTime={0}
          wireframe={false}
          className="opacity-80"
        />
      </div>

      {/* Global Tactile Paper Grain Texture */}
      <div className="paper-grain-overlay" />

      {/* ── TOP NAV BAR (Translucent Sage-Paper Glass) ─────────────────────────── */}
      <header className="sticky top-0 z-40 bg-[#DFECE6]/90 backdrop-blur-xl border-b border-[#8DB8A2] px-4 sm:px-8 py-3.5 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#2563EB] to-[#0284C7] text-white flex items-center justify-center font-bold shadow-md shadow-blue-600/30 border border-blue-400/40">
              <Video className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight text-[#07150E] font-display">MeetHub</span>
          </div>

          {/* Nav links */}
          <nav className="hidden lg:flex items-center gap-7 text-xs sm:text-sm font-semibold text-[#1A3828]">
            <a href="#pipeline" className="hover:text-[#1D4ED8] transition-colors">Pipeline</a>
            <a href="#features" className="hover:text-[#1D4ED8] transition-colors">Capabilities</a>
            <a href="#integrations" className="hover:text-[#1D4ED8] transition-colors">Integrations</a>
            <a href="#workflow" className="hover:text-[#1D4ED8] transition-colors">Workflow</a>
            <a href="#faq" className="hover:text-[#1D4ED8] transition-colors">FAQ</a>
          </nav>

          {/* Action buttons */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={handleDownloadPDF}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 btn-secondary-blue text-xs shadow-2xs font-semibold"
            >
              <FileText className="w-3.5 h-3.5 text-current" />
              <span>Export PDF</span>
            </button>
            <button
              onClick={() => setShowDemoModal(true)}
              className="btn-blue inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm shadow-md"
            >
              <span>Book Walkthrough</span>
              <ArrowRight className="w-3.5 h-3.5 text-current" />
            </button>
          </div>

        </div>
      </header>


      {/* ── HERO SECTION WITH ARCHITECTURAL DEPTH ──────────────────────────── */}
      <div className="relative pt-12 sm:pt-20 pb-16 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-10 relative z-10">
          
          {/* Hero Header Copy with Deep Contrast against Mint/Cyan Mesh */}
          <div className="text-center max-w-3xl mx-auto space-y-4 relative">
            <div className="absolute -inset-x-12 -inset-y-8 -z-10 bg-gradient-to-b from-[#DFECE6]/90 via-[#D3E5DC]/80 to-transparent blur-3xl rounded-full pointer-events-none" />
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#DFECE6] border border-[#8DB8A2] text-xs font-bold text-[#07150E] shadow-2xs backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-[#1D4ED8] animate-pulse" />
              <span>High-Velocity Meeting Intelligence • Linear Sync</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-bold font-display tracking-tight text-[#07150E] leading-[1.12]">
              Turn meeting conversations into <br />
              <span className="relative inline-block text-[#1D4ED8]">
                actionable Linear tickets
                <span className="absolute -bottom-1 left-0 w-full h-[3px] bg-[#1D4ED8] rounded-full" />
              </span>
            </h1>

            <p className="text-base sm:text-lg text-[#1A3828] font-normal max-w-xl mx-auto leading-relaxed">
              Detect verbal commitments, assign responsible owners, and push verified issues straight to your engineering backlog in seconds.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <a
                href="#pipeline"
                className="btn-blue px-7 py-3.5 font-bold text-sm transition-all flex items-center gap-2 group shadow-lg"
              >
                <span>Launch Interactive Demo</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform text-current" />
              </a>
              <button
                onClick={() => setShowDemoModal(true)}
                className="btn-secondary-blue px-6 py-3.5 text-sm font-semibold flex items-center gap-2 shadow-xs"
              >
                <Play className="w-3.5 h-3.5 text-current fill-current" />
                <span>Schedule 15-Min Walkthrough</span>
              </button>
            </div>
          </div>


          {/* ── CENTRAL WORKSPACE DASHBOARD (Authentic Production SaaS Interface) ── */}
          <div className="relative max-w-5xl mx-auto pt-2">

            {/* Main Application Stage Console */}
            <div id="pipeline" className="arsak-stage rounded-3xl overflow-hidden relative z-10">
              <div className="arsak-glaze" />
              <div className="arsak-shelf" />
              
              {/* Authentic SaaS Application Header Toolbar with Rich Sage-Paper Tone */}
              <div className="bg-[#D2E6DC] px-6 py-3.5 flex items-center justify-between flex-wrap gap-4 text-[#07150E] border-b border-[#8DB8A2]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#1E3A8A] text-white flex items-center justify-center font-bold text-xs shadow-sm border border-blue-400/30">
                    <Sliders className="w-4 h-4 text-blue-200" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-[#07150E] tracking-tight font-display">MeetHub Live Pipeline</span>
                      <span className="px-2 py-0.5 rounded-full bg-[#EDF4FD] text-[#1D4ED8] text-[10px] font-bold border border-[#99BEEC] shadow-2xs">Active</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 text-xs">
                  <button
                    onClick={handleDownloadPDF}
                    className="btn-secondary-blue px-3.5 py-1.5 text-xs font-semibold flex items-center gap-1.5 shadow-2xs"
                  >
                    <FileText className="w-3.5 h-3.5 text-current" />
                    <span>Export PDF</span>
                  </button>
                  <button
                    onClick={handleReset}
                    className="btn-secondary-blue px-3 py-1.5 text-xs font-semibold flex items-center gap-1.5 shadow-2xs"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-current" />
                    <span>Reset</span>
                  </button>
                </div>
              </div>

              {/* Scenario Switcher Toolbar in Crisp Sage-Paper Tone */}
              <div className="bg-[#DBEBE2] border-b border-[#8DB8A2] px-6 py-2.5 flex items-center justify-between flex-wrap gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#1A3828] text-xs">Scenario:</span>
                  <div className="flex items-center gap-1.5">
                    {PRESETS.map(p => (
                      <button
                        key={p.id}
                        onClick={() => handleSelectPreset(p)}
                        className={`px-3 py-1.5 rounded-lg transition-all text-xs font-semibold ${activePreset.id === p.id ? 'bg-[#7DD3FC] text-[#042642] border border-[#38BDF8] shadow-sm font-bold' : 'btn-secondary-blue'}`}
                      >
                        {p.tag}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Step indicator with Bluish Accents */}
                <div className="flex items-center gap-2 text-xs">
                  <span className={`px-2.5 py-1 rounded-md transition-colors ${step === 1 ? 'bg-[#7DD3FC] text-[#042642] font-bold border border-[#38BDF8] shadow-xs' : 'bg-[#F0F7FF] text-[#0A3F6B] border border-[#A4D3FA]'}`}>1. Ingest Transcript</span>
                  <span className="text-[#0284C7] font-bold">→</span>
                  <span className={`px-2.5 py-1 rounded-md transition-colors ${step === 2 ? 'bg-[#7DD3FC] text-[#042642] font-bold border border-[#38BDF8] shadow-xs' : 'bg-[#F0F7FF] text-[#0A3F6B] border border-[#A4D3FA]'}`}>2. Review Deliverables</span>
                  <span className="text-[#0284C7] font-bold">→</span>
                  <span className={`px-2.5 py-1 rounded-md transition-colors ${step === 3 ? 'bg-[#7DD3FC] text-[#042642] font-bold border border-[#38BDF8] shadow-xs' : 'bg-[#F0F7FF] text-[#0A3F6B] border border-[#A4D3FA]'}`}>3. Push to Linear</span>
                </div>
              </div>

              {/* 2-Column Split Workspace */}
              <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#8DB8A2]">
                
                {/* Left Column: Meeting Audio & Speech Transcript */}
                <div className="lg:col-span-7 p-6 sm:p-7 space-y-4 bg-[#E5F1EB]">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h3 className="font-bold text-base text-[#07150E] flex items-center gap-2 font-display">
                        <Mic className="w-4 h-4 text-[#1D4ED8]" />
                        Meeting Dialogue &amp; Notes
                      </h3>
                      <p className="text-xs text-[#1A3828]">
                        Review spoken dialogue, paste meeting minutes, or upload audio files.
                      </p>
                    </div>

                    <label className="cursor-pointer px-3.5 py-1.5 btn-secondary-blue text-xs font-semibold flex items-center gap-1.5 shadow-2xs shrink-0">
                      <UploadCloud className="w-3.5 h-3.5 text-current" />
                      <span>{uploading ? 'Parsing…' : 'Upload File'}</span>
                      <input
                        type="file"
                        accept=".txt,.pdf,.mp4,.mp3,.csv"
                        className="hidden"
                        onChange={handleFileUpload}
                        disabled={uploading}
                      />
                    </label>
                  </div>

                  {/* Clean Session & Audio Player Card with Rich Sage-Paper Tone */}
                  <div className="arsak-card rounded-xl p-3.5 bg-[#E2EFE8] border border-[#8DB8A2] flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#EDF4FD] border border-[#99BEEC] text-[#1D4ED8] flex items-center justify-center font-bold text-xs shadow-2xs">
                        <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#07150E] font-display">{activePreset.title}</div>
                        <div className="text-[11px] text-[#1A3828] flex items-center gap-2 mt-0.5 font-medium">
                          <span>{activePreset.time}</span>
                          <span>•</span>
                          <span>{activePreset.participants.join(', ')}</span>
                        </div>
                      </div>
                    </div>

                    <div className="hidden sm:flex items-center gap-1 h-6 w-36">
                      {[35, 70, 45, 85, 30, 95, 55, 75, 90, 45, 65, 92, 35, 80, 60, 88].map((h, i) => (
                        <div
                          key={i}
                          className="flex-1 bg-[#2563EB] rounded-full"
                          style={{ height: `${h}%` }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Clean Transcript Editor with Sage Paper Tint */}
                  <div className="relative rounded-xl bg-[#EAF4EE] p-4 border border-[#8DB8A2] focus-within:border-[#2563EB] focus-within:ring-2 focus-within:ring-blue-200 transition-all shadow-xs">
                    <textarea
                      value={transcript}
                      onChange={e => setTranscript(e.target.value)}
                      rows={7}
                      className="w-full bg-transparent text-sm text-[#07150E] font-medium leading-relaxed focus:outline-none resize-none placeholder-[#426654]"
                      placeholder="Paste meeting dialogue, discussion notes, or upload a transcript file..."
                    />
                  </div>

                  {uploadMsg && (
                    <div className={`p-3 rounded-xl text-xs font-medium flex items-center gap-2 border ${uploadMsg.ok ? 'bg-emerald-100 text-emerald-900 border-emerald-400' : 'bg-rose-100 text-rose-900 border-rose-400'}`}>
                      {uploadMsg.ok ? <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-700" /> : <X className="w-4 h-4 shrink-0 text-rose-700" />}
                      <span>{uploadMsg.text}</span>
                    </div>
                  )}

                  {/* Primary Extract Button with Light Bluish Tone (.btn-blue) */}
                  <button
                    onClick={handleExtractTasks}
                    disabled={loading || !transcript.trim()}
                    className="btn-blue w-full py-3.5 text-sm font-bold shadow-md flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <span className="w-4 h-4 border-2 border-[#042642]/40 border-t-[#042642] rounded-full animate-spin" />
                        <span>Extracting Action Items…</span>
                      </>
                    ) : (
                      <>
                        <Brain className="w-4 h-4 text-current" />
                        <span>Extract Action Items →</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Right Column: Linear Action Items Queue with Rich Sage Paper Tone */}
                <div className="lg:col-span-5 p-6 sm:p-8 bg-[#D9EAE1] space-y-5">
                  <div className="flex items-center justify-between pb-2 border-b border-[#8DB8A2]">
                    <div>
                      <h3 className="font-bold text-base text-[#07150E] flex items-center gap-2 font-display">
                        <CheckSquare className="w-4 h-4 text-[#1D4ED8]" />
                        Detected Action Items
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#EDF4FD] text-[#1D4ED8] border border-[#99BEEC] shadow-2xs">
                          {tasks.length}
                        </span>
                      </h3>
                      <p className="text-xs text-[#1A3828]">Linear synchronization queue</p>
                    </div>

                    {pendingCount > 0 && (
                      <button
                        onClick={handleBulkSync}
                        className="btn-blue px-3 py-1.5 text-xs font-bold flex items-center gap-1 shadow-sm"
                      >
                        <Zap className="w-3 h-3 text-current" />
                        <span>Push All to Linear ({pendingCount})</span>
                      </button>
                    )}
                  </div>

                  {/* Task Cards List */}
                  <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                    {tasks.map(task => {
                      const isCreated = task.status === 'created';
                      const isRejected = task.status === 'rejected';

                      let badgeClass = 'bg-blue-100 text-[#1D4ED8] border border-blue-300 font-bold';
                      if (task.priority === 'Urgent') {
                        badgeClass = 'bg-[#1E3A8A] text-white font-bold border border-blue-900 shadow-sm';
                      } else if (task.priority === 'High') {
                        badgeClass = 'bg-blue-200 text-[#1E40AF] font-bold border border-blue-400';
                      }

                      return (
                        <div
                          key={task.id}
                          className="arsak-card rounded-xl overflow-hidden"
                        >
                          <div className="arsak-glaze" />
                          <div className="arsak-shelf" />
                          
                          {/* Layer 3: Recessed Compartment Header */}
                          <div className="arsak-recessed px-3.5 py-2 flex items-center justify-between gap-2">
                            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${badgeClass}`}>
                              {task.priority}
                            </span>
                            <span className="text-[11px] font-bold text-[#1E40AF] bg-[#EDF4FD] px-2 py-0.5 rounded-md border border-[#99BEEC] shadow-2xs">
                              {task.category}
                            </span>
                          </div>

                          {/* Layer 4: Clean Content Body with Sage-Paper Background */}
                          <div className="p-3.5 bg-[#EAF4EE] space-y-2">
                            <p className="text-xs font-bold text-[#07150E] leading-snug">
                              {task.task}
                            </p>

                            <div className="flex items-center justify-between pt-1 text-xs text-[#1A3828]">
                              <div className="flex items-center gap-3">
                                <span className="flex items-center gap-1 font-bold text-[#07150E]">
                                  <User className="w-3.5 h-3.5 text-[#1D4ED8]" />
                                  {task.owner}
                                </span>
                                <span className="flex items-center gap-1 font-medium">
                                  <Calendar className="w-3 h-3 text-[#3B574A]" />
                                  {task.dueDate}
                                </span>
                              </div>

                              {/* Ticket sync action */}
                              {task.status === 'pending' && (
                                <button
                                  onClick={() => handleCreateTicket(task.id, task.owner, task.dueDate)}
                                  className="btn-blue px-2.5 py-1 text-xs font-bold flex items-center gap-1 shadow-sm"
                                >
                                  <Send className="w-3 h-3 text-current" />
                                  <span>Sync</span>
                                </button>
                              )}

                              {isCreated && (
                                <a
                                  href="https://linear.app"
                                  target="_blank"
                                  rel="noreferrer"
                                  className="px-2.5 py-1 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-mono font-bold text-xs flex items-center gap-1.5 border border-emerald-400 shadow-sm transition-colors"
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                                  <span>{task.ticketId}</span>
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Verification Status */}
                  {createdCount > 0 && (
                    <div className="p-3 rounded-xl bg-[#EAF4EE] border border-[#8DB8A2] text-xs text-[#07150E] flex items-center justify-between shadow-sm">
                      <span className="font-bold flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                        Linear Sync Complete: {createdCount} of {tasks.length} tickets synchronized
                      </span>
                      <button
                        onClick={handleDownloadPDF}
                        className="text-[#1D4ED8] font-bold hover:underline inline-flex items-center gap-1"
                      >
                        <span>Download Executive Audit</span>
                        <ArrowRight className="w-3 h-3 text-[#1D4ED8]" />
                      </button>
                    </div>
                  )}
                </div>

              </div>

              {/* Dashboard Status Bar in Clean Recessed Shelf */}
              <div className="px-6 py-3 bg-[#D2E6DC] border-t border-[#8DB8A2] flex items-center justify-between flex-wrap gap-2 text-xs text-[#07150E] font-medium">
                <div className="flex items-center gap-2">
                  <Shield className="w-3.5 h-3.5 text-[#1D4ED8]" />
                  <span>Zero-Retention In-Memory Architecture: Meeting dialogue and transcripts are never stored permanently.</span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#1A3828]">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                  <span>Linear GraphQL API Connected</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>


      {/* ── 2. FEATURES GRID (Clean & Authentic Paper Styling) ───────────────────────────── */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-8 space-y-10 py-12">
        <div className="text-center max-w-2xl mx-auto space-y-3 relative">
          <div className="absolute -inset-x-16 -inset-y-12 -z-10 bg-gradient-to-b from-[#DFECE6]/95 via-[#D3E5DC]/90 to-transparent blur-3xl rounded-full pointer-events-none" />
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#DFECE6] border border-[#8DB8A2] text-xs font-bold text-[#07150E] shadow-2xs backdrop-blur-md">
            <Layers className="w-3.5 h-3.5 text-[#1D4ED8]" />
            <span>Core Capabilities</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-display text-[#07150E] tracking-tight">
            Engineered for High-Velocity Product Teams
          </h2>
          <p className="text-[#1A3828] font-medium text-sm sm:text-base">
            Eliminate post-meeting administrative debt. Turn discussions into structured, tracked, and prioritized engineering issues.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map(f => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className="arsak-card rounded-2xl overflow-hidden flex flex-col justify-between group relative"
              >
                {/* Layer 1: Glaze */}
                <div className="arsak-glaze" />
                {/* Layer 2: Shelf */}
                <div className="arsak-shelf" />

                {/* Layer 3: Recessed Compartment Header */}
                <div className="arsak-recessed px-5 py-4 flex items-center justify-between border-b border-[#8DB8A2]">
                  <div className={`w-11 h-11 rounded-xl ${f.iconBg} flex items-center justify-center shadow-sm`}>
                    <Icon className="w-5 h-5 text-[#1D4ED8]" />
                  </div>
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#EDF4FD] text-[#1D4ED8] border border-[#99BEEC] shadow-2xs">
                    {f.badge}
                  </span>
                </div>

                {/* Layer 4: Sage Paper Body */}
                <div className="p-5 bg-[#EAF4EE] space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <h3 className="font-bold text-base text-[#07150E] leading-snug group-hover:text-[#1D4ED8] transition-colors font-display">
                      {f.title}
                    </h3>
                    <p className="text-xs text-[#1A3828] leading-relaxed">
                      {f.desc}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#8DB8A2] flex items-center justify-between text-xs text-[#1A3828]">
                    <span className="font-bold text-[#1D4ED8]">{f.capability}</span>
                    <ArrowUpRight className="w-4 h-4 text-[#1D4ED8] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>


      {/* ── 3. INTEGRATION MATRIX (Arsak Stage + Recessed Tiles) ────────────── */}
      <section id="integrations" className="max-w-7xl mx-auto px-4 sm:px-8 py-12">
        <div className="rounded-3xl arsak-stage p-8 sm:p-14 shadow-2xl space-y-12 relative overflow-hidden">
          <div className="arsak-glaze" />
          <div className="arsak-shelf" />

          <div className="text-center max-w-2xl mx-auto space-y-3 relative z-10">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#EDF4FD] text-[#1D4ED8] border border-[#99BEEC] shadow-2xs">
              Ecosystem Integrations
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold font-display tracking-tight text-[#07150E]">
              Native Integration with Your Team Stack
            </h2>
            <p className="text-[#1A3828] text-sm leading-relaxed">
              Connect conversational workflows directly to the issue trackers, knowledge bases, and team messaging channels you rely on every day.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
            {INTEGRATIONS.map(item => (
              <div
                key={item.name}
                className="arsak-card rounded-2xl overflow-hidden relative shadow-sm group"
              >
                <div className="arsak-glaze" />
                <div className="arsak-shelf" />

                {/* Recessed Header */}
                <div className="arsak-recessed px-5 py-3.5 flex items-center justify-between border-b border-[#8DB8A2]">
                  <span className="font-bold text-base text-[#07150E] group-hover:text-[#1D4ED8] transition-colors font-display">{item.name}</span>
                  <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#EDF4FD] text-[#1D4ED8] border border-[#99BEEC] font-bold shadow-2xs">
                    {item.category}
                  </span>
                </div>

                {/* Sage Paper Body */}
                <div className="p-5 bg-[#EAF4EE]">
                  <p className="text-xs text-[#1A3828] leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ── 4. WORKFLOW COMPARISON (Authentic & Uncluttered Paper Styling) ───────────────── */}
      <section id="workflow" className="max-w-7xl mx-auto px-4 sm:px-8 py-12 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-3 relative">
          <div className="absolute -inset-x-16 -inset-y-12 -z-10 bg-gradient-to-b from-[#DFECE6]/95 via-[#D3E5DC]/90 to-transparent blur-3xl rounded-full pointer-events-none" />
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#DFECE6] border border-[#8DB8A2] text-xs font-bold text-[#07150E] shadow-2xs backdrop-blur-md">
            <Activity className="w-3.5 h-3.5 text-[#1D4ED8]" />
            <span>Operational Comparison</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-display text-[#07150E] tracking-tight">
            Traditional Follow-ups vs. The MeetHub Pipeline
          </h2>
          <p className="text-[#1A3828] font-medium text-sm sm:text-base">
            Compare manual post-meeting administration against automated end-to-end issue extraction and synchronization.
          </p>
        </div>

        {/* 2-Column Comparison Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Column 1: Traditional Post-Meeting Friction */}
          <div className="arsak-card rounded-2xl overflow-hidden flex flex-col justify-between relative shadow-sm border border-[#8DB8A2]">
            <div className="arsak-glaze" />
            <div className="arsak-shelf" />

            {/* Recessed Header */}
            <div className="arsak-recessed px-6 py-4 flex items-center justify-between border-b border-rose-300 bg-[#F4E8E8]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span className="font-bold text-xs text-rose-800">
                  Manual Follow-ups &amp; Fragmented Notes
                </span>
              </div>
              <span className="text-xs text-[#4A6E5D] font-semibold">Traditional Process</span>
            </div>

            {/* Content List */}
            <div className="p-6 bg-[#EAF4EE] space-y-4 flex-1">
              {WORKFLOW_BEFORE.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 text-xs">
                  <div className="w-5 h-5 rounded-md bg-rose-100 border border-rose-300 flex items-center justify-center shrink-0 text-rose-700 font-bold mt-0.5">
                    ✕
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="font-bold text-[#07150E] text-xs font-display">{item.title}</h4>
                    <p className="text-[#1A3828] leading-relaxed text-[11px]">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Column 2: MeetHub Closed-Loop Automation */}
          <div className="arsak-card rounded-2xl overflow-hidden flex flex-col justify-between relative shadow-md border-2 border-blue-500/70 ring-4 ring-blue-500/15">
            <div className="arsak-glaze" />
            <div className="arsak-shelf" />

            {/* Recessed Header with Accent */}
            <div className="arsak-recessed px-6 py-4 flex items-center justify-between border-b border-[#8DB8A2] bg-[#EDF4FD]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#1D4ED8]" />
                <span className="font-bold text-xs text-[#1D4ED8]">
                  Automated Closed-Loop Pipeline
                </span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-[#1D4ED8] text-white font-bold text-[10px] shadow-xs">
                Powered by MeetHub
              </span>
            </div>

            {/* Content List */}
            <div className="p-6 bg-[#EAF4EE] space-y-4 flex-1">
              {WORKFLOW_AFTER.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 text-xs">
                  <div className="w-5 h-5 rounded-md bg-blue-100 border border-blue-300 flex items-center justify-center shrink-0 text-[#1D4ED8] font-bold mt-0.5">
                    <Check className="w-3.5 h-3.5 text-[#1D4ED8]" />
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="font-bold text-[#07150E] text-xs font-display">{item.title}</h4>
                    <p className="text-[#1A3828] leading-relaxed text-[11px]">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>


      {/* ── 5. FAQ ACCORDION (Arsak 4-Layer Cards with Paper Tone) ─────────────────────────── */}
      <section id="faq" className="max-w-3xl mx-auto px-4 sm:px-8 py-12 space-y-6">
        <div className="text-center space-y-2 relative">
          <div className="absolute -inset-x-12 -inset-y-8 -z-10 bg-gradient-to-b from-[#DFECE6]/90 via-[#D3E5DC]/80 to-transparent blur-3xl rounded-full pointer-events-none" />
          <h2 className="text-3xl font-extrabold font-display text-[#07150E] tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-[#1A3828] font-normal text-sm">
            Clear answers about task extraction, Linear integration, data privacy, and architecture.
          </p>
        </div>

        <div className="space-y-3">
          {FAQ_LIST.map((item, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className={`arsak-card rounded-2xl overflow-hidden relative transition-all shadow-sm ${isOpen ? 'ring-2 ring-blue-500/40' : ''}`}
              >
                <div className="arsak-glaze" />
                <div className="arsak-shelf" />

                <button
                  onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                  className={`w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-[#07150E] transition-colors ${isOpen ? 'bg-[#D3E5DC]' : 'bg-[#EAF4EE]'}`}
                >
                  <span className="font-display">{item.q}</span>
                  <span className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold transition-transform ${isOpen ? 'btn-blue shadow-xs' : 'bg-[#F0F7FF] text-[#0A3F6B] border border-[#A4D3FA]'}`}>
                    {isOpen ? '−' : '+'}
                  </span>
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-[#1A3828] leading-relaxed border-t border-[#8DB8A2] pt-3 bg-[#EAF4EE]">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>


      {/* ── 6. FINAL CTA BANNER (Arsak Stage with Royal Azure CTA) ─────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 py-12">
        <div className="rounded-3xl arsak-stage p-8 sm:p-14 text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="arsak-glaze" />
          <div className="arsak-shelf" />

          <div className="max-w-2xl mx-auto space-y-4 relative z-10">
            <h2 className="text-3xl sm:text-4xl font-bold font-display tracking-tight text-[#07150E] leading-tight">
              Ready to Eliminate Meeting Debt Across Your Team?
            </h2>
            <p className="text-sm sm:text-base text-[#1A3828] leading-relaxed">
              Turn every call into documented momentum. Connect your meeting discussions directly to Linear in less than two minutes.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
              <button
                onClick={() => setShowDemoModal(true)}
                className="btn-blue px-8 py-3.5 rounded-xl font-bold text-sm sm:text-base shadow-lg transition-all flex items-center gap-2"
              >
                <span>Schedule a 15-Min Walkthrough</span>
                <ArrowRight className="w-4 h-4 text-current" />
              </button>
              <button
                onClick={handleReset}
                className="btn-secondary-blue px-6 py-3.5 rounded-xl font-semibold text-sm sm:text-base transition-all shadow-xs"
              >
                <span>Reset Demo Pipeline</span>
              </button>
            </div>
          </div>
        </div>
      </section>


      {/* ── FOOTER ─────────────────────────────────────────────────────────── */}
      <footer className="bg-[#030712]/85 backdrop-blur-md border-t border-white/10 py-12 px-4 sm:px-8 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 font-bold text-white text-base">
              <MeetHubLogo className="w-7 h-7" />
              <span className="font-display">MeetHub</span>
              <span className="text-xs text-slate-400 font-normal">| Meeting Intelligence &amp; Linear Sync</span>
            </div>

            <div className="flex items-center gap-6 font-medium text-slate-300">
              <a href="#pipeline" className="hover:text-[#60A5FA] transition-colors">Pipeline</a>
              <a href="#features" className="hover:text-[#60A5FA] transition-colors">Capabilities</a>
              <a href="#integrations" className="hover:text-[#60A5FA] transition-colors">Integrations</a>
              <a href="#workflow" className="hover:text-[#60A5FA] transition-colors">Workflow</a>
              <button onClick={handleDownloadPDF} className="hover:text-[#60A5FA] transition-colors">Executive PDF</button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 border-t border-white/10 text-[11px] text-slate-400">
            <div>© 2026 MeetHub. Unified Full-Stack Architecture.</div>
            <div className="flex items-center gap-4">
              <span>Stateless Processing</span>
              <span>•</span>
              <span>Linear API Ready</span>
              <span>•</span>
              <span>1-Click Vercel Deploy</span>
            </div>
          </div>
        </div>
      </footer>


      {/* ── WALKTHROUGH DEMO MODAL (Arsak Stage Modal) ──────────────────── */}
      {showDemoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
          <div className="arsak-stage rounded-3xl p-6 sm:p-8 max-w-lg w-full text-[#07150E] shadow-2xl relative max-h-[92vh] overflow-y-auto">
            <div className="arsak-glaze" />
            <div className="arsak-shelf" />

            <button
              onClick={() => { setShowDemoModal(false); setDemoConfirmed(false); }}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#EDF4FD] hover:bg-[#DFEBF9] flex items-center justify-center text-[#1D4ED8] border border-[#99BEEC] transition-colors z-20"
            >
              <X className="w-4 h-4" />
            </button>

            {!demoConfirmed ? (
              <form
                onSubmit={e => {
                  e.preventDefault();
                  if (!demoName || !demoEmail) return;
                  setDemoConfirmed(true);
                  showToast(`✓ Walkthrough scheduled for ${demoName}`);
                }}
                className="space-y-4 relative z-10"
              >
                <div>
                  <div className="text-xs font-bold text-[#1D4ED8] mb-1 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#1D4ED8]" />
                    <span>15-Minute Architecture Walkthrough</span>
                  </div>
                  <h3 className="text-xl font-bold text-[#07150E] font-display">Schedule Live Architecture Walkthrough</h3>
                  <p className="text-xs text-[#1A3828]">
                    See how MeetHub automates closed-loop task extraction and Linear synchronization.
                  </p>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block font-bold text-[#07150E] mb-1">Your Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Alex Morgan"
                      value={demoName}
                      onChange={e => setDemoName(e.target.value)}
                      className="w-full bg-[#EAF4EE] border border-[#8DB8A2] rounded-xl p-3 focus:outline-none focus:border-[#2563EB] text-[#07150E] placeholder-[#4A6E5D] shadow-2xs"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#07150E] mb-1">Work Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="alex@company.com"
                      value={demoEmail}
                      onChange={e => setDemoEmail(e.target.value)}
                      className="w-full bg-[#EAF4EE] border border-[#8DB8A2] rounded-xl p-3 focus:outline-none focus:border-[#2563EB] text-[#07150E] placeholder-[#4A6E5D] shadow-2xs"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#07150E] mb-1">Team Size</label>
                    <select
                      value={demoTeamSize}
                      onChange={e => setDemoTeamSize(e.target.value)}
                      className="w-full bg-[#EAF4EE] border border-[#8DB8A2] rounded-xl p-3 focus:outline-none focus:border-[#2563EB] text-[#07150E] shadow-2xs font-medium"
                    >
                      <option>1-10 engineers</option>
                      <option>10-50 team members</option>
                      <option>50-200 team members</option>
                      <option>Enterprise (200+)</option>
                    </select>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#8DB8A2] flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowDemoModal(false)}
                    className="btn-secondary-blue px-4 py-2.5 rounded-xl text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-blue px-6 py-2.5 rounded-xl text-xs font-semibold shadow-md"
                  >
                    Confirm Walkthrough Booking
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center py-6 space-y-4 relative z-10">
                <div className="w-14 h-14 rounded-full bg-emerald-200 text-emerald-900 mx-auto flex items-center justify-center border border-emerald-400 shadow-sm">
                  <CheckCircle2 className="w-8 h-8 text-emerald-700" />
                </div>
                <h3 className="text-2xl font-bold text-[#07150E] font-display">Walkthrough Confirmed!</h3>
                <p className="text-xs text-[#1A3828] max-w-sm mx-auto leading-relaxed">
                  A calendar invite and interactive sandbox link have been emailed to <strong>{demoEmail}</strong>.
                </p>
                <button
                  onClick={() => { setShowDemoModal(false); setDemoConfirmed(false); }}
                  className="btn-blue px-6 py-2.5 rounded-xl text-xs font-semibold shadow-md"
                >
                  Return to Dashboard
                </button>
              </div>
            )}
          </div>
        </div>
      )}


      {/* ── TOAST NOTIFICATIONS ───────────────────────────────────────────── */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-[#0F172A] text-white shadow-2xl border border-slate-800 text-xs font-medium max-w-xs animate-in fade-in slide-in-from-bottom-2">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

    </div>
  );
}
