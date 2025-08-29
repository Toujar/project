// // types/property.ts
// export interface Property {
//   _id?: string;  // ✅ optional (fixes your undefined issue)
//   title: string;
//   location: string;
//   rent: number;
//   rooms: number;
//   bathrooms: number;
//   area?: number;
//   description: string;
//   images: string[];
//   availability: boolean;
//   amenities: string[];
// }
export interface Property {
  _id?: string;  // optional because new property may not have it yet
  title: string;
  location: string;
  rent: number;
  rooms: number;
  bathrooms: number;
  area?: number;
  description: string;
  images: string[];
  availability: boolean;
  amenities: string[];
}
