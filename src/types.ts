export type UserRole = 
  | 'Super Admin'
  | 'Management'
  | 'Document Controller'
  | 'SHE/HSE Department'
  | 'Quality Department'
  | 'Internal Auditor'
  | 'Department Head / Superintendent'
  | 'PIC / User'
  | 'Read Only';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  site: string;
  avatar: string;
}

export interface DocumentItem {
  id: string;
  docNumber: string;
  title: string;
  docType: string;
  department: string;
  site: string;
  businessProcess: string;
  managementSystem: string;
  smkpElement: string;
  iso9001Clause: string;
  iso14001Clause: string;
  iso45001Clause: string;
  issueDate: string;
  effectiveDate: string;
  nextReviewDate: string;
  revisionNo: number;
  status: 'Draft' | 'Pending Approval' | 'Active' | 'Under Review' | 'Obsolete' | 'Rejected';
  author: string;
  reviewer: string;
  approver: string;
  pic: string;
  confidentiality: string;
  filePath: string;
  summary: string;
  keywords: string[];
  references: string;
  changeHistory: string;
  reviewNotes: string;
  revisionReason: string;
}

export interface RequirementItem {
  id: string;
  standard: string;
  clauseNumber: string;
  title: string;
  description: string;
  obligationType: string;
  expectedEvidence: string;
  department: string;
  compliantStatus: 'Compliant' | 'Partially Compliant' | 'Non-Compliant' | 'Not Applicable' | 'Not Yet Assessed';
  gapDescription: string;
  riskIfNotMet: string;
  actionPlan: string;
  pic: string;
  targetDate: string;
  sourceRef: string;
}

export interface AuditItem {
  id: string;
  auditNo: string;
  auditType: string;
  systemAudited: string;
  site: string;
  scope: string;
  criteria: string;
  objective: string;
  planDate: string;
  execDate: string;
  leadAuditor: string;
  auditors: string[];
  auditee: string;
  status: 'Scheduled' | 'In Progress' | 'Completed' | 'Cancelled';
  summary: string;
}

export interface AuditChecklist {
  id: string;
  auditId: string;
  clauseOrElement: string;
  question: string;
  acceptanceCriteria: string;
  verificationMethod: string;
  referenceDoc: string;
  evidenceNote: string;
  result: 'Sesuai' | 'Tidak Sesuai' | 'Observasi' | 'Peluang Peningkatan' | 'Tidak Berlaku' | 'Belum Diperiksa';
  auditor: string;
  notes: string;
}

export interface FindingItem {
  id: string;
  auditId: string;
  clauseOrElement?: string;
  statement: string;
  criteria: string;
  objectiveEvidence: string;
  location: string;
  department: string;
  category: 'Major' | 'Minor' | 'Observasi' | 'OFI';
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  pic: string;
  targetDate: string;
  status: 'Open' | 'In Progress' | 'Pending Verification' | 'Closed' | 'Overdue';
  evidenceClosing: string;
  verifier: string;
  verificationResult: string;
}

export interface CapaItem {
  id: string;
  findingId: string;
  rootCauseAnalysis: string;
  immediateCorrection: string;
  correctiveAction: string;
  preventiveAction: string;
  pic: string;
  resources: string;
  targetDate: string;
  status: 'In Progress' | 'Under Verification' | 'Closed' | 'Reopened';
  executionEvidence: string;
  verificationResult: string;
  effectivenessIndicator: string;
  closureDate: string;
  reopenReason: string;
}

export interface LegalItem {
  id: string;
  regNumber: string;
  title: string;
  publisher: string;
  year: number;
  issueDate: string;
  effectiveDate: string;
  status: 'Berlaku' | 'Revisi' | 'Dicabut';
  changes: string;
  relevantArticles: string;
  obligationSummary: string;
  departmentOwner: string;
  complianceEvidence: string;
  evalFrequency: string;
  evalResult: string;
  actionPlan: string;
  sourceUrl: string;
  lastVerifiedDate: string;
}

export interface RiskItem {
  id: string;
  code: string;
  processOrActivity: string;
  hazardDescription: string;
  existingControl: string;
  severity: number;
  likelihood: number;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Extreme';
  treatmentAction: string;
  pic: string;
  status: string;
}

export interface ObjectiveItem {
  id: string;
  category: string;
  objectiveName: string;
  targetValue: string;
  currentProgress: string;
  department: string;
  year: number;
  status: string;
}

export interface ManagementReview {
  id: string;
  title: string;
  date: string;
  chairperson: string;
  attendees: number;
  keyInputs: string;
  keyOutputs: string;
  status: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  details: string;
}

export interface DatabaseState {
  users: User[];
  departments: string[];
  sites: string[];
  documents: DocumentItem[];
  requirements: RequirementItem[];
  audits: AuditItem[];
  checklists: AuditChecklist[];
  findings: FindingItem[];
  capas: CapaItem[];
  legalRegister: LegalItem[];
  risks: RiskItem[];
  objectives: ObjectiveItem[];
  managementReviews: ManagementReview[];
  auditLogs: AuditLog[];
}
