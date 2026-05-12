import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, Observable } from 'rxjs';
import { McpPlugin } from '../domain/mcp-plugin.model';
import { URLConfig } from '../constants/url.config';

@Injectable({
  providedIn: 'root'
})
export class McpPluginAdapter {
  constructor(private http: HttpClient) {}

  async listAll(): Promise<McpPlugin[]> {
    return firstValueFrom(this.http.get<McpPlugin[]>(URLConfig.MCP.PLUGINS));
  }

  async register(plugin: Partial<McpPlugin>): Promise<McpPlugin> {
    return firstValueFrom(this.http.post<McpPlugin>(URLConfig.MCP.PLUGINS, plugin));
  }

  async togglePlugin(id: string): Promise<void> {
    const url = (URLConfig.MCP.TOGGLE as (id: string) => string)(id);
    return firstValueFrom(this.http.patch<void>(url, {}));
  }

  async refreshPlugin(id: string): Promise<void> {
    const url = (URLConfig.MCP.REFRESH as (id: string) => string)(id);
    return firstValueFrom(this.http.post<void>(url, {}));
  }

  async update(id: string, plugin: Partial<McpPlugin>): Promise<McpPlugin> {
    const url = `${URLConfig.MCP.PLUGINS}/${id}`;
    return firstValueFrom(this.http.put<McpPlugin>(url, plugin));
  }
}
