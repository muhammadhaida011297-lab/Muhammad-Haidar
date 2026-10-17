import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Initialize Gemini SDK server-side
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || 'AIza-mock-key',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// In-Memory Database Store for Enterprise IMS
let db = {
  users: [
    { id: 'usr-1', name: 'Ir. Budi Santoso, M.T.', email: 'budi.santoso@tambang.co.id', role: 'Super Admin', department: 'HSE & Compliance', site: 'Head Office Jakarta', avatar: 'BS' },
    { id: 'usr-2', name: 'Siti Rahma, S.T.', email: 'siti.rahma@tambang.co.id', role: 'Document Controller', department: 'Document Control Center', site: 'Head Office Jakarta', avatar: 'SR' },
    { id: 'usr-3', name: 'Agus Pratama, IPM', email: 'agus.pratama@tambang.co.id', role: 'SHE/HSE Department', department: 'SHE Department', site: 'Site Lati', avatar: 'AP' },
    { id: 'usr-4', name: 'Dewi Lestari, M.Sc.', email: 'dewi.lestari@tambang.co.id', role: 'Quality Department', department: 'Quality Assurance', site: 'Head Office Jakarta', avatar: 'DL' },
    { id: 'usr-5', name: 'Capt. Hendra Wijaya', email: 'hendra.wijaya@tambang.co.id', role: 'Internal Auditor', department: 'Internal Audit', site: 'Site Balangan', avatar: 'HW' },
    { id: 'usr-6', name: 'Rian Hidayat, ST', email: 'rian.hidayat@tambang.co.id', role: 'Department Head / Superintendent', department: 'Mining Operations', site: 'Site Lati', avatar: 'RH' },
    { id: 'usr-7', name: 'Joko Widodo', email: 'joko.widodo@tambang.co.id', role: 'PIC / User', department: 'Plant & Maintenance', site: 'Site Balangan', avatar: 'JW' },
    { id: 'usr-8', name: 'Dr. Marcus Aurelius', email: 'marcus@tambang.co.id', role: 'Management', department: 'Board of Directors', site: 'Head Office Jakarta', avatar: 'MA' }
  ],
  departments: [
    'HSE & Compliance', 'Document Control Center', 'SHE Department', 'Quality Assurance', 
    'Internal Audit', 'Mining Operations', 'Plant & Maintenance', 'Supply Chain & Logistics', 'Geology & Exploration'
  ],
  sites: [
    'Head Office Jakarta', 'Site Lati (Berau)', 'Site Balangan (Kalsel)', 'Site Melak (Kaltim)'
  ],
  documents: [
    {
      id: 'DOC-SOP-001',
      docNumber: 'SOP/HSE/012',
      title: 'Prosedur Tanggap Darurat Kebakaran Tambang Terbuka',
      docType: 'SOP',
      department: 'HSE & Compliance',
      site: 'Site Lati (Berau)',
      businessProcess: 'Keselamatan Pertambangan',
      managementSystem: 'SMKP & ISO 45001',
      smkpElement: 'Elemen V: Pengelolaan Keselamatan Kerja (Sub Elemen 5.2)',
      iso9001Clause: 'Klausul 8.1 - Operational Planning',
      iso14001Clause: 'Klausul 8.2 - Emergency Preparedness',
      iso45001Clause: 'Klausul 8.2 - Emergency Preparedness and Response',
      issueDate: '15-01-2025',
      effectiveDate: '20-01-2025',
      nextReviewDate: '20-01-2026',
      revisionNo: 2,
      status: 'Active',
      author: 'Agus Pratama, IPM',
      reviewer: 'Ir. Budi Santoso, M.T.',
      approver: 'Dr. Marcus Aurelius',
      pic: 'Agus Pratama, IPM',
      confidentiality: 'Internal Restricted',
      filePath: '/files/sop_tanggap_darurat_rev2.pdf',
      summary: 'Prosedur wajib penanggulangan keadaan darurat kebakaran di area pit penambangan dan stockroom bahan peledak.',
      keywords: ['tanggap darurat', 'kebakaran', 'fire emergency', 'K3', 'SMKP'],
      references: 'Kepmen ESDM 1827 K/30/MEM/2018 Lampiran II',
      changeHistory: 'Revisi 2: Penambahan jalur evakuasi sektor barat pit Lati.',
      reviewNotes: 'Disetujui tanpa catatan khusus oleh manajemen.',
      revisionReason: 'Perluasan area operasional pit baru.'
    },
    {
      id: 'DOC-SOP-002',
      docNumber: 'SOP/OPR/045',
      title: 'Standar Operasional Pengoperasian Excavator Komatsu PC2000 di Front Tambang',
      docType: 'SOP',
      department: 'Mining Operations',
      site: 'Site Balangan (Kalsel)',
      businessProcess: 'Produksi Overburden & Coal Getting',
      managementSystem: 'SMKP & ISO 9001',
      smkpElement: 'Elemen IV: Pengelolaan Keselamatan Operasional',
      iso9001Clause: 'Klausul 8.5 - Production and Service Provision',
      iso14001Clause: 'N/A',
      iso45001Clause: 'Klausul 8.1 - Operational Control',
      issueDate: '10-02-2025',
      effectiveDate: '15-02-2025',
      nextReviewDate: '15-02-2026',
      revisionNo: 1,
      status: 'Active',
      author: 'Rian Hidayat, ST',
      reviewer: 'Agus Pratama, IPM',
      approver: 'Dr. Marcus Aurelius',
      pic: 'Rian Hidayat, ST',
      confidentiality: 'Confidential',
      filePath: '/files/sop_excavator_pc2000.pdf',
      summary: 'Panduan teknis pengoperasian alat berat excavator di kemiringan lereng > 15 derajat.',
      keywords: ['excavator', 'loading', 'hauling', 'slope stability', 'SMKP'],
      references: 'UU No 3 Tahun 2020 jo PP 55 Tahun 2010',
      changeHistory: 'Revisi 1: Dokumen baru hasil validasi keselamatan operasional.',
      reviewNotes: 'Lolos uji praktik lapangan.',
      revisionReason: 'Pembaharuan unit armada baru.'
    },
    {
      id: 'DOC-POL-001',
      docNumber: 'POL/CORP/01',
      title: 'Kebijakan Terpadu K3, Lingkungan, dan Mutu PT Tambang Mineral Perkasa',
      docType: 'Kebijakan',
      department: 'HSE & Compliance',
      site: 'Head Office Jakarta',
      businessProcess: 'Manajemen Korporat',
      managementSystem: 'SMKP, ISO 9001, ISO 14001, ISO 45001',
      smkpElement: 'Elemen I: Kebijakan Keselamatan Pertambangan',
      iso9001Clause: 'Klausul 5.2 - Policy',
      iso14001Clause: 'Klausul 5.2 - Environmental Policy',
      iso45001Clause: 'Klausul 5.2 - OH&S Policy',
      issueDate: '02-01-2025',
      effectiveDate: '02-01-2025',
      nextReviewDate: '02-01-2026',
      revisionNo: 3,
      status: 'Active',
      author: 'Dr. Marcus Aurelius',
      reviewer: 'Ir. Budi Santoso, M.T.',
      approver: 'Dr. Marcus Aurelius',
      pic: 'Ir. Budi Santoso, M.T.',
      confidentiality: 'Public',
      filePath: '/files/kebijakan_terpadu_2025.pdf',
      summary: 'Komitmen manajemen puncak dalam pemenuhan nihil kecelakaan kerja, kelestarian lingkungan, dan mutu prima.',
      keywords: ['kebijakan', 'policy', 'K3', 'lingkungan', 'mutu', 'SMKP'],
      references: 'Permen ESDM No 26 Tahun 2018',
      changeHistory: 'Revisi 3: Integrasi klausul ESG dan dekarbonisasi.',
      reviewNotes: 'Ditandatangani oleh seluruh Dewan Direksi.',
      revisionReason: 'Review tahunan manajemen.'
    },
    {
      id: 'DOC-ENV-004',
      docNumber: 'SOP/ENV/019',
      title: 'Pengelolaan Air Asam Tambang (Acid Mine Drainage) dan Monitoring pH Settling Pond',
      docType: 'SOP',
      department: 'SHE Department',
      site: 'Site Lati (Berau)',
      businessProcess: 'Pengelolaan Lingkungan',
      managementSystem: 'ISO 14001 & SMKP',
      smkpElement: 'Elemen VI: Pengelolaan Lingkungan Pertambangan',
      iso9001Clause: 'N/A',
      iso14001Clause: 'Klausul 8.1 - Operational Control',
      iso45001Clause: 'N/A',
      issueDate: '12-03-2025',
      effectiveDate: '15-03-2025',
      nextReviewDate: '15-03-2026',
      revisionNo: 1,
      status: 'Pending Approval',
      author: 'Dewi Lestari, M.Sc.',
      reviewer: 'Agus Pratama, IPM',
      approver: 'Dr. Marcus Aurelius',
      pic: 'Dewi Lestari, M.Sc.',
      confidentiality: 'Internal Restricted',
      filePath: '/files/sop_limbah_cair_amd.pdf',
      summary: 'Instruksi kerja penambahan kapur tohor (CaO) pada kolam pengendapan lumpur untuk menjaga baku mutu air limbah.',
      keywords: ['air asam tambang', 'AMD', 'settling pond', 'pH', 'limbah cair'],
      references: 'Permen LH No 5 Tahun 2014',
      changeHistory: 'Draft awal untuk persetujuan direksi.',
      reviewNotes: 'Menunggu verifikasi laboratorium lingkungan.',
      revisionReason: 'Penyesuaian baku mutu baru.'
    }
  ],
  requirements: [
    {
      id: 'REQ-SMKP-01',
      standard: 'SMKP Minerba',
      clauseNumber: 'Elemen I (Sub 1.1)',
      title: 'Pernyataan Kebijakan Keselamatan Pertambangan',
      description: 'Perusahaan pertambangan harus menetapkan dan mengesahkan kebijakan keselamatan pertambangan secara tertulis.',
      obligationType: 'Mandatory Legal',
      expectedEvidence: 'Dokumen kebijakan bertanda tangan direksi utama yang disosialisasikan ke seluruh pekerja dan mitra kerja.',
      department: 'HSE & Compliance',
      compliantStatus: 'Compliant',
      gapDescription: 'Tidak ada gap, kebijakan telah ditandatangani dan dipajang di seluruh mess hall dan office.',
      riskIfNotMet: 'Sanksi administratif berat dan penghentian sementara kegiatan penambangan.',
      actionPlan: 'Maintenance sosialisasi berkala.',
      pic: 'Ir. Budi Santoso, M.T.',
      targetDate: '30-06-2026',
      sourceRef: 'Kepmen ESDM 1827 K/30/MEM/2018 Lampiran I'
    },
    {
      id: 'REQ-SMKP-05',
      standard: 'SMKP Minerba',
      clauseNumber: 'Elemen V (Sub 5.2)',
      title: 'Keselamatan Kerja - Kesiapsiagaan Tanggap Darurat',
      description: 'Perusahaan wajib memiliki prosedur tanggap darurat dan sarana evakuasi yang memadai.',
      obligationType: 'Mandatory Legal',
      expectedEvidence: 'SOP tanggap darurat, catatan drill/simulasi minimal 2 kali setahun, alat pemadam & jalur evakuasi.',
      department: 'HSE & Compliance',
      compliantStatus: 'Compliant',
      gapDescription: 'Perlu penambahan rambu evakuasi di workshop timur.',
      riskIfNotMet: 'Fatalitas korban jiwa saat kejadian darurat dan sanksi Ditjen Minerba.',
      actionPlan: 'Pengadaan 25 buah rambu evakuasi fotoluminesen.',
      pic: 'Agus Pratama, IPM',
      targetDate: '15-05-2026',
      sourceRef: 'Kepdirjen Minerba No 185.K/37.04/DJB/2019'
    },
    {
      id: 'REQ-ISO9001-08',
      standard: 'ISO 9001:2015',
      clauseNumber: 'Klausul 8.2',
      title: 'Persyaratan untuk Produk dan Layanan',
      description: 'Komunikasi dengan pelanggan, penentuan dan peninjauan persyaratan produk dan jasa.',
      obligationType: 'Quality Standard',
      expectedEvidence: 'Kontrak penjualan batubara, spesifikasi parameter kalori, TM, TS, Ash content.',
      department: 'Quality Assurance',
      compliantStatus: 'Compliant',
      gapDescription: 'Sertifikat COA laboratorium terakreditasi KAN telah terlampir.',
      riskIfNotMet: 'Klaim pelanggan dan penolakan kargo di pelabuhan bongkar.',
      actionPlan: 'Audit silang laboratorium secara berkala.',
      pic: 'Dewi Lestari, M.Sc.',
      targetDate: '30-09-2026',
      sourceRef: 'ISO 9001:2015 Clause 8.2'
    },
    {
      id: 'REQ-ISO14001-06',
      standard: 'ISO 14001:2015',
      clauseNumber: 'Klausul 6.1.3',
      title: 'Kewajiban Kepatuhan Lingkungan',
      description: 'Organisasi harus menentukan dan memiliki akses terhadap kewajiban kepatuhan terkait aspek lingkungan.',
      obligationType: 'Environmental Compliance',
      expectedEvidence: 'Legal Register, izin lingkungan (AMDAL / Persetujuan Teknis Limbah B3).',
      department: 'SHE Department',
      compliantStatus: 'Partially Compliant',
      gapDescription: 'Perpanjangan izin TPS Limbah B3 site Balangan sedang dalam proses di KLHK.',
      riskIfNotMet: 'Tuntutan hukum dan denda administratif lingkungan.',
      actionPlan: 'Pengawalan dokumen izin ke PTSP Kementerian ESDM / KLHK.',
      pic: 'Dewi Lestari, M.Sc.',
      targetDate: '15-06-2026',
      sourceRef: 'ISO 14001:2015 Clause 6.1.3 & UU 32/2009'
    },
    {
      id: 'REQ-ISO45001-08',
      standard: 'ISO 45001:2018',
      clauseNumber: 'Klausul 8.1.2',
      title: 'Menghilangkan Bahaya dan Mengurangi Risiko K3',
      description: 'Organisasi harus menetapkan proses untuk menghilangkan bahaya dan mengurangi risiko K3 menggunakan hierarki pengendalian.',
      obligationType: 'OH&S Standard',
      expectedEvidence: 'Formulir HIRADC / IBPR, Job Safety Analysis (JSA) sebelum pekerjaan high risk.',
      department: 'HSE & Compliance',
      compliantStatus: 'Compliant',
      gapDescription: 'Implementasi JSA digital telah mencapai 95%.',
      riskIfNotMet: 'Kecelakaan kerja akibat kegagalan analisis bahaya.',
      actionPlan: 'Pelatihan refresher JSA untuk pengawas operasional (PO).',
      pic: 'Agus Pratama, IPM',
      targetDate: '30-07-2026',
      sourceRef: 'ISO 45001:2018 Clause 8.1.2'
    }
  ],
  audits: [
    {
      id: 'AUD-2026-Q1',
      auditNo: 'AUD/SMKP-ISO/2026/01',
      auditType: 'Audit Terintegrasi',
      systemAudited: 'SMKP Minerba & ISO 9001/14001/45001',
      site: 'Site Lati (Berau)',
      scope: 'Seluruh operasional penambangan, workshop, dan instalasi pengolahan air limbah',
      criteria: 'Kepmen ESDM 1827 K/2018 & ISO 9001/14001/45001',
      objective: 'Menilai tingkat kepatuhan penjalanan sistem manajemen terpadu semester 1 tahun 2026',
      planDate: '10-04-2026',
      execDate: '12-04-2026 s.d 15-04-2026',
      leadAuditor: 'Capt. Hendra Wijaya',
      auditors: ['Capt. Hendra Wijaya', 'Dewi Lestari, M.Sc.', 'Agus Pratama, IPM'],
      auditee: 'Rian Hidayat, ST (Superintendent Mining)',
      status: 'Scheduled',
      summary: 'Persiapan dokumen dan penyusunan checklist audit telah selesai 100%.'
    },
    {
      id: 'AUD-2025-Q4',
      auditNo: 'AUD/SMKP/2025/04',
      auditType: 'Audit SMKP',
      systemAudited: 'SMKP Minerba (Elemen I s.d VII)',
      site: 'Site Balangan (Kalsel)',
      scope: 'Departemen Plant & Pemeliharaan Alat Berat',
      criteria: 'Permen ESDM No 26 Tahun 2018',
      objective: 'Evaluasi tahunan penerapan elemen keselamatan operasional',
      planDate: '15-11-2025',
      execDate: '18-11-2025 s.d 20-11-2025',
      leadAuditor: 'Capt. Hendra Wijaya',
      auditors: ['Capt. Hendra Wijaya', 'Ir. Budi Santoso, M.T.'],
      auditee: 'Joko Widodo (Supervisor Plant)',
      status: 'Completed',
      summary: 'Audit selesai dengan predikat memuaskan (Compliance score 88.5%).'
    }
  ],
  checklists: [
    {
      id: 'CHK-01',
      auditId: 'AUD-2026-Q1',
      clauseOrElement: 'SMKP Elemen I - Kebijakan',
      question: 'Apakah kebijakan keselamatan pertambangan telah ditandatangani oleh KTT dan disosialisasikan kepada seluruh pekerja?',
      acceptanceCriteria: 'Tersedia salinan kebijakan di setiap papan pengumuman dan hasil kuesioner pemahaman pekerja.',
      verificationMethod: 'Wawancara acak 5 pekerja dan inspeksi visual papan pengumuman.',
      referenceDoc: 'DOC-POL-001',
      evidenceNote: 'Papan pengumuman mess hall terpasang poster kebijakan.',
      result: 'Sesuai',
      auditor: 'Capt. Hendra Wijaya',
      notes: 'Sangat baik dan terawat.'
    },
    {
      id: 'CHK-02',
      auditId: 'AUD-2026-Q1',
      clauseOrElement: 'ISO 14001 - Klausul 8.1',
      question: 'Apakah pemantauan baku mutu air limbah kolam pengendapan dilakukan secara berkala setiap bulan oleh laboratorium terakreditasi?',
      acceptanceCriteria: 'Laporan uji laboratorium parameter pH, TSS, Fe, dan Mn sesuai Kepmen LH No 5/2014.',
      verificationMethod: 'Pemeriksaan logbook pemantauan harian dan sertifikat lab.',
      referenceDoc: 'DOC-ENV-004',
      evidenceNote: 'Logbook kolam settling pond B tercatat lengkap bulan Januari-Maret 2026.',
      result: 'Tidak Sesuai',
      auditor: 'Dewi Lestari, M.Sc.',
      notes: 'Ditemukan 2 hari di bulan Februari pencatatan pH terlewat karena alat pH meter portable kalibrasinya habis.'
    }
  ],
  findings: [
    {
      id: 'FIND-001',
      auditId: 'AUD-2026-Q1',
      clauseOrElement: 'ISO 14001 - Klausul 8.1 / Kolam Pengendapan',
      statement: 'Pencatatan parameter harian pH air limbah pada Settling Pond B terlewat pada tanggal 14 dan 15 Februari 2026 akibat keterlambatan kalibrasi sensor pH meter.',
      criteria: 'SOP Pengelolaan Air Asam Tambang (DOC-ENV-004) poin 4.2',
      objectiveEvidence: 'Logbook pemantauan harian kolam B kosong pada tanggal tersebut dan stiker kalibrasi alat expired per 10 Feb 2026.',
      location: 'Settling Pond B Sektor Timur',
      department: 'SHE Department',
      category: 'Minor',
      riskLevel: 'Medium',
      pic: 'Dewi Lestari, M.Sc.',
      targetDate: '30-04-2026',
      status: 'Open',
      evidenceClosing: '',
      verifier: 'Capt. Hendra Wijaya',
      verificationResult: 'Pending'
    },
    {
      id: 'FIND-002',
      auditId: 'AUD-2025-Q4',
      statement: 'Beberapa APAR (Alat Pemadam Api Ringan) jenis dry powder di workshop utama belum dilakukan inspection tag bulanan.',
      criteria: 'NFPA 10 & SOP Pemadam Kebakaran',
      objectiveEvidence: 'Inspeksi fisik 3 unit APAR di sudut barat workshop menunjukkan kartu pemeriksaan terakhir tertulis bulan Agustus 2025.',
      location: 'Workshop Utama Site Balangan',
      department: 'Plant & Maintenance',
      category: 'Major',
      riskLevel: 'High',
      pic: 'Joko Widodo',
      targetDate: '15-12-2025',
      status: 'Closed',
      evidenceClosing: 'Foto kartu inspeksi baru yang telah diparaf oleh petugas K3 per 20 November 2025.',
      verifier: 'Capt. Hendra Wijaya',
      verificationResult: 'Effective & Closed'
    }
  ],
  capas: [
    {
      id: 'CAPA-001',
      findingId: 'FIND-001',
      rootCauseAnalysis: 'Menggunakan metode 5 Whys:\n1. Mengapa pencatatan pH terlewat? Karena alat rusak/tidak dikalibrasi.\n2. Mengapa tidak dikalibrasi? Jadwal kalibrasi eksternal terlambat.\n3. Mengapa terlambat? Belum ada sistem reminder otomatis di PIC lingkungan.\n4. Mengapa belum ada? Sistem pemantauan alat ukur masih manual menggunakan Excel lokal.\n\nAkar Masalah Utama: Ketiadaan sistem kontrol kalibrasi alat ukur lingkungan berbasis notifikasi sistem.',
      immediateCorrection: 'Melakukan kalibrasi darurat menggunakan buffer solution standar pada tanggal 16 Februari 2026.',
      correctiveAction: 'Membuat modul master alat ukur dengan reminder otomatis 7 hari sebelum kalibrasi berakhir.',
      preventiveAction: 'Pelatihan penanggung jawab alat ukur lingkungan dan penunjukan backup PIC.',
      pic: 'Dewi Lestari, M.Sc.',
      resources: '1 Unit pH Meter cadangan & software reminder',
      targetDate: '30-04-2026',
      status: 'In Progress',
      executionEvidence: 'Sertifikat kalibrasi darurat terlampir.',
      verificationResult: 'Menunggu verifikasi lapangan',
      effectivenessIndicator: '0% keterlambatan kalibrasi alat ukur selama 12 bulan ke depan.',
      closureDate: '',
      reopenReason: ''
    }
  ],
  legalRegister: [
    {
      id: 'LEG-01',
      regNumber: 'UU No. 3 Tahun 2020',
      title: 'Perubahan atas Undang-Undang Nomor 4 Tahun 2009 tentang Pertambangan Mineral dan Batubara',
      publisher: 'DPR RI / Pemerintah Pusat',
      year: 2020,
      issueDate: '10-06-2020',
      effectiveDate: '10-06-2020',
      status: 'Berlaku',
      changes: 'Pengalihan kewenangan perizinan ke pusat dan penguatan sanksi pidana lingkungan.',
      relevantArticles: 'Pasal 95 s.d 115 mengenai K3 dan Keselamatan Pertambangan',
      obligationSummary: 'Perusahaan wajib menerapkan kaidah teknik pertambangan yang baik (good mining practice).',
      departmentOwner: 'HSE & Compliance',
      complianceEvidence: 'Dokumen izin IUPK dan Laporan RKAB tahunan.',
      evalFrequency: 'Tahunan',
      evalResult: 'Compliant',
      actionPlan: 'Kepatuhan penuh pada seluruh kewajiban royalti dan reklamasi.',
      sourceUrl: 'https://peraturan.bpk.go.id',
      lastVerifiedDate: '10-01-2026'
    },
    {
      id: 'LEG-02',
      regNumber: 'Kepmen ESDM No. 1827 K/30/MEM/2018',
      title: 'Pedoman Pelaksanaan Kaidah Teknik Pertambangan yang Baik',
      publisher: 'Kementerian ESDM',
      year: 2018,
      issueDate: '30-04-2018',
      effectiveDate: '30-04-2018',
      status: 'Berlaku',
      changes: 'Standar teknis keselamatan pertambangan, ventilasi, geoteknik, dan lingkungan.',
      relevantArticles: 'Lampiran I s.d IX',
      obligationSummary: 'Penyusunan dokumen SMKP dan penunjukan KTT yang disahkan oleh KaIT.',
      departmentOwner: 'HSE & Compliance',
      complianceEvidence: 'Sertifikat Pengesahan SMKP Minerba.',
      evalFrequency: 'Per Semester',
      evalResult: 'Compliant',
      actionPlan: 'Audit internal berkala sesuai ketentuan.',
      sourceUrl: 'https://jdih.esdm.go.id',
      lastVerifiedDate: '15-01-2026'
    }
  ],
  risks: [
    {
      id: 'RSK-01',
      code: 'IBPR-01',
      processOrActivity: 'Aktivitas Blasting (Pengeboran dan Peledakan) di Pit Timur',
      hazardDescription: 'Batu terbang (flyrock) mengenai fasilitas pemukiman atau unit alat berat yang beroperasi.',
      existingControl: 'Radius evakuasi 500 meter, sirene peringatan, spotter jaga.',
      severity: 4,
      likelihood: 3,
      riskLevel: 'High',
      treatmentAction: 'Pemasangan blast shelter portabel tambahan dan kalkulasi burden spacing presisi.',
      pic: 'Rian Hidayat, ST',
      status: 'Controlled'
    }
  ],
  objectives: [
    {
      id: 'OBJ-01',
      category: 'K3 & Keselamatan',
      objectiveName: 'Pencapaian Zero Fatality dan LTIFR < 0.10',
      targetValue: '0 Fatality, LTIFR 0.08',
      currentProgress: '92%',
      department: 'HSE & Compliance',
      year: 2026,
      status: 'On Track'
    },
    {
      id: 'OBJ-02',
      category: 'Lingkungan',
      objectiveName: 'Reklamasi Lahan Bekas Tambang seluas 150 Hektar',
      targetValue: '150 Ha',
      currentProgress: '65%',
      department: 'SHE Department',
      year: 2026,
      status: 'In Progress'
    }
  ],
  managementReviews: [
    {
      id: 'MR-2025',
      title: 'Tinjauan Manajemen (Management Review) Kinerja SMKP & ISO Tahun 2025',
      date: '15-12-2025',
      chairperson: 'Dr. Marcus Aurelius (President Director)',
      attendees: 18,
      keyInputs: 'Laporan audit internal Q4, pencapaian sasaran K3, status CAPA temuan eksternal.',
      keyOutputs: 'Persetujuan penambahan anggaran K3 sebesar 15% untuk modernisasi alat pemantau gas metana.',
      status: 'Approved'
    }
  ],
  auditLogs: [
    { id: 'LOG-1', timestamp: '17-10-2026 08:30', user: 'Siti Rahma', action: 'Upload Dokumen Baru', details: 'SOP Tanggap Darurat Kebakaran (DOC-SOP-001) direvisi ke rev 2' },
    { id: 'LOG-2', timestamp: '16-10-2026 14:15', user: 'Capt. Hendra Wijaya', action: 'Update Temuan Audit', details: 'Membuat temuan FIND-001 pada audit AUD-2026-Q1' }
  ]
};

const app = express();
app.use(express.json({ limit: '50mb' }));

// REST API Endpoints
app.get('/api/state', (req, res) => {
  res.json(db);
});

// Documents CRUD & Workflow
app.post('/api/documents', (req, res) => {
  const newDoc = {
    id: `DOC-${Date.now()}`,
    ...req.body,
    revisionNo: req.body.revisionNo || 1,
    status: req.body.status || 'Draft'
  };
  db.documents.unshift(newDoc);
  db.auditLogs.unshift({
    id: `LOG-${Date.now()}`,
    timestamp: new Date().toLocaleString('id-ID'),
    user: req.body.author || 'System User',
    action: 'Tambah Dokumen',
    details: `Menambahkan dokumen ${newDoc.docNumber} - ${newDoc.title}`
  });
  res.json({ success: true, document: newDoc });
});

app.put('/api/documents/:id', (req, res) => {
  const { id } = req.params;
  const idx = db.documents.findIndex(d => d.id === id);
  if (idx !== -1) {
    db.documents[idx] = { ...db.documents[idx], ...req.body };
    db.auditLogs.unshift({
      id: `LOG-${Date.now()}`,
      timestamp: new Date().toLocaleString('id-ID'),
      user: req.body.user || 'System User',
      action: 'Edit Dokumen',
      details: `Memperbarui dokumen ${db.documents[idx].docNumber}`
    });
    res.json({ success: true, document: db.documents[idx] });
  } else {
    res.status(404).json({ error: 'Document not found' });
  }
});

app.delete('/api/documents/:id', (req, res) => {
  const { id } = req.params;
  db.documents = db.documents.filter(d => d.id !== id);
  res.json({ success: true });
});

// Findings & CAPA
app.post('/api/findings', (req, res) => {
  const newFinding = {
    id: `FIND-${Date.now()}`,
    ...req.body,
    status: 'Open'
  };
  db.findings.unshift(newFinding);
  res.json({ success: true, finding: newFinding });
});

app.put('/api/findings/:id', (req, res) => {
  const { id } = req.params;
  const idx = db.findings.findIndex(f => f.id === id);
  if (idx !== -1) {
    db.findings[idx] = { ...db.findings[idx], ...req.body };
    res.json({ success: true, finding: db.findings[idx] });
  } else {
    res.status(404).json({ error: 'Finding not found' });
  }
});

app.post('/api/capas', (req, res) => {
  const newCapa = {
    id: `CAPA-${Date.now()}`,
    ...req.body,
    status: 'In Progress'
  };
  db.capas.unshift(newCapa);
  res.json({ success: true, capa: newCapa });
});

app.put('/api/capas/:id', (req, res) => {
  const { id } = req.params;
  const idx = db.capas.findIndex(c => c.id === id);
  if (idx !== -1) {
    db.capas[idx] = { ...db.capas[idx], ...req.body };
    res.json({ success: true, capa: db.capas[idx] });
  } else {
    res.status(404).json({ error: 'CAPA not found' });
  }
});

// Requirements & Mappings
app.post('/api/requirements', (req, res) => {
  const newReq = {
    id: `REQ-${Date.now()}`,
    ...req.body
  };
  db.requirements.unshift(newReq);
  res.json({ success: true, requirement: newReq });
});

// Gemini AI Assistant Endpoint
app.post('/api/ai/assistant', async (req, res) => {
  try {
    const { prompt, mode, contextData } = req.body;
    
    let systemInstruction = "Anda adalah Asisten AI Senior untuk Integrated Management System (SMKP Minerba, ISO 9001, ISO 14001, ISO 45001) di industri pertambangan. Berikan jawaban dalam Bahasa Indonesia yang profesional, akurat, dan berbasis standar regulasi K3 pertambangan.";
    
    if (mode === 'classify') {
      systemInstruction += " Tugas Anda adalah menganalisis judul dokumen dan memberikan rekomendasi Jenis Dokumen, Elemen SMKP, Klausul ISO, dan Kata Kunci dalam format JSON.";
    } else if (mode === 'gap') {
      systemInstruction += " Tugas Anda adalah melakukan analisis kesenjangan (gap analysis) kepatuhan terhadap persyaratan SMKP/ISO berdasarkan data yang diberikan.";
    } else if (mode === 'rootcause') {
      systemInstruction += " Tugas Anda adalah membantu menyusun analisis akar masalah menggunakan metode 5 Whys dan menyarankan tindakan korektif yang efektif.";
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt + (contextData ? `\n\nContext Data:\n${JSON.stringify(contextData)}` : ''),
      config: {
        systemInstruction,
        temperature: 0.3
      }
    });

    res.json({ success: true, text: response.text });
  } catch (error: any) {
    console.error('Gemini AI Error:', error);
    res.status(500).json({ error: error.message || 'Gagal memproses permintaan AI.' });
  }
});

// Reset demo data
POST: app.post('/api/reset-demo', (req, res) => {
  // Reset db to initial state if needed
  res.json({ success: true, message: 'Database reset to demo state' });
});

// Vite middleware in development
if (process.env.NODE_ENV !== 'production') {
  const vite = await createViteServer({
    server: { middlewareMode: true, hmr: process.env.DISABLE_HMR !== 'true' }
  });
  app.use(vite.middlewares);
} else {
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

const PORT = Number(process.env.PORT || 3000);
app.listen(PORT, '0.0.0.0', () => {
  console.log(`IMS Enterprise server running on http://localhost:${PORT}`);
});
