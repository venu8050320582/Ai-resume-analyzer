export type UserRole = 'ADMIN' | 'RECRUITER'

export interface AuthUser {
  id: number
  fullName: string
  email: string
  role: UserRole
  token: string
}

export interface Job {
  id: number
  title: string
  companyName: string
  description: string
  requiredSkills: string
  experienceRequired?: string
  educationRequirement?: string
  location?: string
}

export interface ResumeUploadResponse {
  id?: number
  resumeId?: number
  candidateId?: number
  message?: string
  [key: string]: unknown
}

export interface ScreeningResult {
  id: number
  resumeId: number
  jobId: number
  matchScore: number
  matchingSkills?: string
  missingSkills?: string
  candidateSummary?: string
  status?: string
  createdAt?: string
}
