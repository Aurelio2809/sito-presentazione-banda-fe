// Auth
export interface LoginRequest {
  username: string;
  password: string;
}

export interface UserResponse {
  id: number;
  username: string;
  email: string;
  role: string;
  createdAt: string;
}

export interface UpdateProfileRequest {
  email?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

// Gallery
export interface GalleryPhotoRequest {
  src?: string;
  title: string;
  description?: string;
  location?: string;
  photoYear?: number | null;
  photoMonth?: number | null;
  photoDay?: number | null;
  favorite: boolean;
  displayOrder?: number;
}

export interface GalleryPhotoResponse {
  id: number;
  src: string;
  thumbnailSrc?: string;
  title: string;
  description?: string;
  location?: string;
  photoYear?: number;
  photoMonth?: number;
  photoDay?: number;
  favorite: boolean;
  displayOrder?: number;
}

// Events
export type EventType = 'EVENT' | 'ANNOUNCEMENT';
export type EventStatus = 'DRAFT' | 'PUBLISHED';

export interface EventRequest {
  title: string;
  eventDate: string;
  eventTime?: string;
  location?: string;
  cityLine?: string;
  shortDescription?: string;
  fullDescription?: string;
  bannerSrc?: string;
  type: EventType;
  status: EventStatus;
  attachmentLabel?: string;
  attachmentHref?: string;
  tags?: string[];
}

export interface EventResponse {
  id: number;
  title: string;
  eventDate: string;
  eventTime?: string;
  location?: string;
  cityLine?: string;
  shortDescription?: string;
  fullDescription?: string;
  bannerSrc?: string;
  type: string;
  status: string;
  attachmentLabel?: string;
  attachmentHref?: string;
  tags?: string[];
}

// Contact form
export interface MessageRequest {
  senderName: string;
  senderEmail: string;
  subject: string;
  content: string;
}

// Activity Log
export type ActionType = 'CREATE' | 'UPDATE' | 'DELETE' | 'PUBLISH' | 'UNPUBLISH' | 'ARCHIVE' | 'READ' | 'UPLOAD' | 'LOGIN' | 'LOGOUT';
export type TargetType = 'PHOTO' | 'EVENT' | 'ANNOUNCEMENT' | 'USER' | 'SETTINGS';

export interface ActivityLogResponse {
  id: number;
  username: string;
  action: string;
  targetName: string;
  targetType: string;
  targetId?: number;
  details?: string;
  timestamp: string;
}

// Pagination
export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

// API Error
export interface ApiErrorResponse {
  status: number;
  message: string;
  timestamp: string;
  errors?: Record<string, string>;
}
