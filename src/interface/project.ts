
export interface IProject {
  createdAt: string;
  delta: string;
  html: string;
  id: string;
  title: string;
  updatedAt: string;
  userId: string;
  version: string;
  loading?: boolean;
  cover: string;
  count: number;
  storedImageFolder: string;
  storedImageName: string;
  to: string[];
  cc: string[];
  isLatest: boolean;
  author: string;
  subject?: string;
  comment?: string;
  organization?: string;
  seen: string[];
  lastOpened: string;
  originalOwner: string;
  isEdit?: boolean;
  collaborators?: string[];
  seenCollab?: string[];
  hasMadeDuplicate?: string[];
  isDuplicate?: boolean;
  makeDuplicate?: boolean;
  editorInCharge?: string;
  isApproved?: boolean;
}

export interface ISelectedText {
  index: number;
  length: number;
  value: string;
}

export interface IAnnotation {
  text: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  name: string;
  projectId: string;
  index: number;
  selectedText: ISelectedText;
  resolved: boolean;
  id: string;
  annotateImage: string;
  nextVersion: string;
  isSaved: boolean;
  savedBy: string;
  projectName: string;
  projectVersion: string;
  completed?: boolean;
}


export interface IVoiceNote {
  note: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  name: string;
  projectId: string;
  index: number;
  selectedText: ISelectedText;
  storedAudioFolder: string;
  storedAudioName: string;
  vNImage: string;
  audioUrl: string;
  resolved: boolean;
  id: string;
  nextVersion: string;
  projectName: string;
  projectVersion: string;
}

export interface IComment {
  comment: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  name: string;
  projectId: string;
  userAvatar: string;
  seen: string[];
  id: string;
  nextVersion: string;
  projectName: string;
  projectVersion: string;
}
