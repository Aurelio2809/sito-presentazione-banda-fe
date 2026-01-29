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
  photoDate?: string;
  favorite: boolean;
  displayOrder?: number;
}

export interface GalleryPhotoResponse {
  id: number;
  src: string;
  title: string;
  description?: string;
  location?: string;
  photoDate?: string;
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

// Messages
export interface MessageRequest {
  senderName: string;
  senderEmail: string;
  subject: string;
  content: string;
}

export interface MessageResponse {
  id: number;
  senderName: string;
  senderEmail: string;
  subject: string;
  content: string;
  read: boolean;
  receivedAt: string;
  readAt?: string;
}

// Activity Log
export type ActionType = 'CREATE' | 'UPDATE' | 'DELETE' | 'PUBLISH' | 'UNPUBLISH' | 'ARCHIVE' | 'READ' | 'UPLOAD' | 'LOGIN' | 'LOGOUT';
export type TargetType = 'PHOTO' | 'EVENT' | 'ANNOUNCEMENT' | 'MESSAGE' | 'USER' | 'SETTINGS';

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
