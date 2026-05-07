import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { URLConfig } from '../constants/url.config';
import { PromptTemplate, PromptVersion, CreateVersionRequest } from '../domain/prompt.model';

@Injectable({
  providedIn: 'root'
})
export class PromptAdapter {
  private http = inject(HttpClient);

  /**
   * 获取模板列表
   */
  getTemplates(): Observable<PromptTemplate[]> {
    return this.http.get<PromptTemplate[]>(URLConfig.PROMPT.TEMPLATES);
  }

  /**
   * 获取指定模板的版本
   */
  getVersions(templateId: number): Observable<PromptVersion[]> {
    return this.http.get<PromptVersion[]>(`${URLConfig.PROMPT.TEMPLATES}/${templateId}/versions`);
  }

  /**
   * 保存新版本
   */
  saveVersion(templateId: number, request: CreateVersionRequest): Observable<void> {
    return this.http.post<void>(`${URLConfig.PROMPT.TEMPLATES}/${templateId}/versions`, request);
  }

  /**
   * 激活指定版本
   */
  activateVersion(versionId: number): Observable<void> {
    return this.http.patch<void>(`${URLConfig.PROMPT.VERSIONS}/${versionId}/activate`, {});
  }
}
