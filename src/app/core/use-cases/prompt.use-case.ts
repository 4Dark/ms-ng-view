import { Injectable, inject, signal } from '@angular/core';
import { PromptAdapter } from '../adapters/prompt.adapter';
import { PromptTemplate, PromptVersion, CreateVersionRequest } from '../domain/prompt.model';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PromptUseCase {
  private adapter = inject(PromptAdapter);

  // State Signals
  templates = signal<PromptTemplate[]>([]);
  versions = signal<PromptVersion[]>([]);
  selectedTemplate = signal<PromptTemplate | null>(null);
  selectedVersion = signal<PromptVersion | null>(null);
  isLoading = signal<boolean>(false);

  /**
   * 加载所有模板
   */
  async loadTemplates() {
    this.isLoading.set(true);
    try {
      const data = await firstValueFrom(this.adapter.getTemplates());
      this.templates.set(data);
    } finally {
      this.isLoading.set(false);
    }
  }

  /**
   * 选择模板并加载版本
   */
  async selectTemplate(template: PromptTemplate) {
    this.selectedTemplate.set(template);
    this.isLoading.set(true);
    try {
      const data = await firstValueFrom(this.adapter.getVersions(template.id));
      this.versions.set(data);
      // 默认选择第一个版本（通常是最新或已激活的）
      this.selectedVersion.set(data.find(v => v.isActive) || data[0] || null);
    } finally {
      this.isLoading.set(false);
    }
  }

  /**
   * 保存新版本
   */
  async saveVersion(request: CreateVersionRequest) {
    const template = this.selectedTemplate();
    if (!template) return;

    this.isLoading.set(true);
    try {
      await firstValueFrom(this.adapter.saveVersion(template.id, request));
      // 重新加载版本列表
      await this.selectTemplate(template);
    } finally {
      this.isLoading.set(false);
    }
  }

  /**
   * 激活版本
   */
  async activateVersion(versionId: number) {
    this.isLoading.set(true);
    try {
      await firstValueFrom(this.adapter.activateVersion(versionId));
      const template = this.selectedTemplate();
      if (template) {
        await this.selectTemplate(template);
      }
    } finally {
      this.isLoading.set(false);
    }
  }
}
