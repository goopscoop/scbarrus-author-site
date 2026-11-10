/**
 * S.C. Barrus social profiles. Change a handle here and it updates the footer
 * links and the Person structured data (sameAs) everywhere.
 */
export type SocialProfile = {
  id: 'youtube' | 'instagram' | 'tiktok';
  label: string;
  url: string;
};

export const socialProfiles: SocialProfile[] = [
  { id: 'youtube', label: 'YouTube', url: 'https://www.youtube.com/@SCBarrusAuthor' },
  { id: 'instagram', label: 'Instagram', url: 'https://www.instagram.com/scbarrusauthor' },
  { id: 'tiktok', label: 'TikTok', url: 'https://www.tiktok.com/@scbarrusauthor' },
];
