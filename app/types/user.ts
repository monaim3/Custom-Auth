export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  address: string;
  contact_number: string;
  birthday: string;
  profile_image: string;
  bio: string;
}

export interface UpdateProfileDto {
  first_name?: string;
  last_name?: string;
  address?: string;
  contact_number?: string;
  birthday?: string;
  bio?: string;
  profile_image?: File;
}