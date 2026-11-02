import { IUserPlans, IUserRoles } from '../interface/user';
import { IUserDept } from '../interface/user';

export const userPlansData : { name: string; value: IUserPlans }[] = [
  { name: 'Free', value: 'free' },
  { name: 'Team', value: 'team' },
  { name: 'Organization', value: 'organization' },
  { name: 'Enterprise', value: 'enterprise' },
];
export const fontSizeData : { name: string; value: string }[] = [
  { name: "Tiny", value: "12px" },
  { name: "Small", value: "14px" },
  { name: "Medium", value: "16px" },
  { name: "Large", value: "18px" },
  { name: "Extra Large", value: "20px" }
];

export const userRolesData: { name: string; value: IUserRoles }[] = [
  { name: 'Author', value: 'author' },
  { name: 'Editor In Chief', value: 'editor-in-chief' },
  { name: 'Managing Editor', value: 'managing-editor' },
  { name: 'Editor', value: 'editor' },
  { name: 'Systems Admin', value: 'systems-admin' },
  { name: 'App Manager', value: 'app-Manager' },
];
export const userDeptData: { name: string; value: IUserDept }[] = [
  { name: 'Author', value: 'Author' },
  { name: 'Super-user', value: 'Super-User' },
  { name: 'LWPM', value: 'LWPM' },
  { name: 'ROR', value: 'ROR' },
  { name: 'TNI', value: 'TNI' },
  { name: 'Kiddies Production', value: 'Kiddies Production' },
  { name: 'CGI', value: 'CGI' },
  { name: 'Cell Ministry', value: 'Cell Ministry' },
  { name: "Children's Ministry", value: "Children's Ministry" },
];

export type IUserDepts = "Author" | "Super-user" | "LWPM" | "ROR" | "TNI" |  "Kiddies Production" | "CGI" | "Cell Ministry" | "Children's Ministry" | "Ushering";