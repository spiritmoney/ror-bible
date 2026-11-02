export type ILoginInputs = {
  email: string;
  password: string;
  rememberMe?: boolean;
};

export type IRegisterInputs = {
  email: string;
  company?: string[];
  password: string;
  confirmPassword: string;
  region: string;
  fullName: string;
  terms?: boolean;
};

export interface IKingschatTokens {
  accessToken: string
  expiresInMillis: number
  refreshToken: string
}
