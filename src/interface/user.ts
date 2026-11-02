export interface IUser {
  email: string;
  fullName: string;
  region: string;
  terms: boolean;
  password?: string;
  expiresAt?: string;
  avatar?: string;
  birth_date_millis?: null | number;
  gender?: null | string;
  id?: string;
  is_email_verified?: boolean;
  name?: string;
  phone_number?: null | string;
  username?: string;
  level?: number;
  company?: string[];
  team?: string;
  admin?: string;
  role?: IUserRoles;
  plan?: IUserPlans;
  teamMembers?: string[];
  organizations?: string[];
  dept?: IUserDept[];
  isActive?: boolean;
  storedImageName?: string
  storedImageFolder?: string
  createdAt: string | null;
  updatedAt?: string;
  kingsChatTokens?: IKingsChatTokens;
  kingsChatid?: string;
  status?: IUserStatus;
  startDate?: string;
  startCountDate?: string;
  endDate?:  string;
  suspendDate?: string;
}

export interface IKingsChatTokens {
  accessToken: string;
  expiresInMillis: number;
  refreshToken: string;
}

export interface IInTeam{
 key: string;

}

export interface ISupportKingsChatTokens {
  accessToken: string;
  expiresInMillis: number;
  refreshToken: string;
}
export type IUserRoles =
  | 'author'
  | 'editor-in-chief'
  | 'managing-editor'
  | 'editor'
  | 'systems-admin'
  | 'app-Manager';

export type IUserPlans =
  | 'free'
  | 'team'
  | 'organization'
  | 'enterprise';

export type IUserStatus =
  | 'active'
  | 'paused'
  | 'suspended'
  | 'archived';

export type IUserDept =
  // | 'Author/Super-user'
  | 'Author'
  | 'Super-User'
  | 'LWPM'
  | 'ROR'
  | 'TNI'
  | 'Kiddies Production'
  | 'CGI'
  | 'Cell Ministry'
  | "Children's Ministry";

