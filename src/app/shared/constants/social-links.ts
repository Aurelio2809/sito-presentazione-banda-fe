export type SocialKey = 'facebook' | 'instagram' | 'tiktok' | 'youtube';

export type SocialLink = {
  key: SocialKey;
  label: string;
  href: string;
};

export const SOCIAL_URLS = {
  facebook: 'https://www.facebook.com/profile.php?id=100015687872187',
  instagram: 'https://www.instagram.com/bandamusicalecasalidelmanco/?next=%2F',
  youtube: 'https://www.youtube.com/@BandaMusicaleCasaliDelManco',
  tiktok: 'https://www.tiktok.com/@bandamusicalecasalidelm?',
} as const;

export const SOCIAL_LINKS: SocialLink[] = [
  { key: 'instagram', label: 'Instagram', href: SOCIAL_URLS.instagram },
  { key: 'facebook', label: 'Facebook', href: SOCIAL_URLS.facebook },
  { key: 'tiktok', label: 'TikTok', href: SOCIAL_URLS.tiktok },
  { key: 'youtube', label: 'YouTube', href: SOCIAL_URLS.youtube },
];
