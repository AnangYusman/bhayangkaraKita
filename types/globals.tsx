import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export type SidebarMenuTask = {
  childMenu: any[];
  name: string;
  id: number;
  parentId: number;
  position: number;
  statusId: number;
  statusName: string;
};

export type MasterUser = {
  id: number;
  address: string;
  dateOfBirth: string;
  email: string;
  fullname: string;
  genderType: string;
  identityNumber: string;
  identityType: string;
  lastEducation: string;
  phoneNumber: string;
  userLevelsId: number;
  userRoleId: number;
  username: string;
  workType: string;
};

export type Article = {
  id: any;
  title: string;
  articleCategory: string;
  tags: string;
  updated_at: string;
  creator: string;
  source: string;
  description: string;
  htmlDescription: string;
  status: string;
  actions: string;
};

export type RequestInformation = {
  no: number;
  id: number;
  ticketNumber: string;
  createdByUserName: string;
  createdByUserPhone: string;
  createdByUserId: number;
  reason: string;
  createdAt: string;
  title: string;
  reqNumber: any;
  statusId: any;
  description: string;
};

export type RequestObjection = {
  id: number;
  dateTime: string;
  title: string;
  reqNumber: any;
  status: string;
  description: string;
};

export type UserObject = {
  id: number;
  name: string;
  levelNumber: string;
  aliasName: string;
  parentLevelId: string;
  provinceId: string;
  is_active: string;
};

export type UserObjectTable = {
  id: number;
  name: string;
  level_number: string;
  aliasName: string;
  parent_level_id: string;
  province_id: string;
  is_active: string;
};

export type UserObjectDetail = {
  id: number;
  name: string;
  levelNumber: string;
  alias_name: string;
  parentLevelId: string;
  provinceId: string;
  is_active: string;
};

export type ModuleObject = {
  id: number;
  name: string;
  is_active: string;
  description: string;
  pathUrl: string;
};

export type ModuleObjectDetail = {
  id: number;
  name: string;
  is_active: string;
  description: string;
  path_url: string;
};

export type MenuObject = {
  id: number;
  name: string;
  is_active: string;
  description: string;
  moduleName: string;
  pathUrl: string;
};

export type MenuObjectDetail = {
  id: number;
  name: string;
  status: string;
  description: string;
  moduleName: string;
  pathUrl: string;
};

export type DataMasterMenu = {
  id: number;
  description: string;
  icon: string;
  moduleId: number;
  name: string;
  parentMenuId: number;
  position: number;
  statusId: number;
};

export type DataCategory = {
  id: number;
  title: string;
};

export type DataMasterMenuById = {
  id: number;
  description: string;
  icon: string;
  module_id: number;
  name: string;
  parent_menu_id: number;
  position: number;
  status_id: number;
};
export type MasterUserRole = {
  id: number;
  name: string;
  description: string;
  code: string;
  level_number: number;
  status_id: number;
  created_by_id: string | number;
  is_active: true;
  created_at: string;
  updated_at: string;
};

export type PublicInformation = {
  id: number;
  no: number;
  title: string;
  description: string;
  slug: string;
  categoryId: number;
  categoryName: string;
  createdById: number;
  createdByName: string;
  position: any;
  statusId: number;
  statusName: number;
  isPublish: boolean;
  publishedAt: any;
  isActive: boolean;
  createdAt: any;
  updatedAt: any;
  files: any | [];
  ppidDatas: any;
};

export type PPIDFiles = {
  id: number;
  title: string;
  type: any;
  ppidDataId: number;
  fileName: string;
  fileType: string;
  downloadCount: any;
};

export type AllData = {
  id: number;
  ticketNumber: string;
  createdAt: string;
  nextAction: string;
  fileUrl: string;
  howToGetFiles: string;
  howToGetInfo: string;
};

export type DataReplies = {
  id: number;
  requestForInformationItemId: number;
  fileUrl: string;
  response: string;
  statusId: number;
  createdById: string;
  isActive: true;
  createdAt: string;
  updatedAt: string;
};

export type ObjectionData = {
  id: number;
  no: number;
  created_by_id: number;
  status: string;
  statusId: number;
  documentName: string;
  main_reason: string;
  secondary_reason: string;
  createdAt: string;
  updatedAt: string;
  request_for_information_id: number;
};

export type CategoryData = {
  id: number;
  no: number;
  title: string;
  description: string;
  parentId: string | null;
  thumbnailUrl: string;
};

export type RequestData = {
  id: number;
  no: number;
  title: string;
  description: string;
  parentId: string | null;
  thumbnailUrl: string;
};

export type DataArticleCategory = {
  id: number;
  description: string;
  title: string;
  status_id: number;
};

export type DataPublicCategory = {
  id: number;
  description: string;
  title: string;
  parentId: string;
  slug: string;
  status_id: number;
};

export type RegisterUser = {
  id: number;
  address: string;
  dateOfBirth: string;
  email: string;
  fullName: string;
  genderType: string;
  identityGroup: string;
  identityGroupNumber: string;
  identityNumber: string;
  identityType: string;
  lastEducation: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
  userLevelId: number;
  userRoleId: number;
  username: string;
  workType: string;
};

export type RequestInformationResponse = {
  response: string;
  fileUrl: string;
};

export type PaginationRequest = {
  limit: string;
  page: number;
  search: string;
  startDate?: string;
  endDate?: string;
  isPublish?: boolean;
  category?: string;
  sortBy?: string;
  sort?: string;
  categorySlug?: string;
  isBanner?: boolean;
};
