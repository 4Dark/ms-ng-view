export interface McpPlugin {
  id: string;
  name: string;
  title: string;
  description: string;
  icon: string;
  type: 'sse' | 'stdio';
  config: any;
  enabled: boolean;
  system: boolean;
  createTime: string;
  updateTime: string;
}
