export type CustomerReview = {
  id: string;
  name: string;
  location: string;
  town?: string;
  country?: string;
  visited: string;
  quote: string;
  rating: number;
  photos: string[];
  submittedAt?: string;
};
