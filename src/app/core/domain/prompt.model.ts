/**
 * Prompt 模板领域模型
 */
export interface PromptTemplate {
  id: number;
  slug: string;
  type: 'System' | 'User' | 'Tool';
  description: string;
  createTime: string;
  updateTime: string;
}

/**
 * Prompt 版本领域模型
 */
export interface PromptVersion {
  id: number;
  templateId: number;
  versionTag: string;
  content: string;
  variables: string[];
  modelConfig: any;
  isActive: boolean;
  createTime: string;
}

/**
 * 创建版本请求
 */
export interface CreateVersionRequest {
  versionTag: string;
  content: string;
  variables: string[];
  modelConfig: any;
}
