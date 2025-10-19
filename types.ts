export enum ToneOfVoice {
  Friendly = 'Friendly',
  Urgent = 'Urgent',
  Professional = 'Professional',
  Luxury = 'Luxury',
}

export enum Language {
  English = 'English',
  Spanish = 'Spanish',
  French = 'French',
  German = 'German',
  Japanese = 'Japanese',
  Italian = 'Italian',
  Portuguese = 'Portuguese',
  Dutch = 'Dutch',
  Russian = 'Russian',
  Chinese = 'Chinese (Simplified)',
  Arabic = 'Arabic',
  Hindi = 'Hindi',
}

export interface AdCopy {
  headlines: string[];
  descriptions: string[];
}

export interface WebsiteAnalysis {
  productName: string;
  targetAudience: string;
  keywords: string;
}
