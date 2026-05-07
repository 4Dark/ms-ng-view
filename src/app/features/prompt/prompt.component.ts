import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SidebarService } from '../../core/services/sidebar.service';
import { PromptUseCase } from '../../core/use-cases/prompt.use-case';
import { PromptTemplate, PromptVersion } from '../../core/domain/prompt.model';

@Component({
  selector: 'app-prompt',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    MatDividerModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatTooltipModule
  ],
  templateUrl: './prompt.component.html',
  styleUrl: './prompt.component.css'
})
export class PromptComponent implements OnInit {
  public sidebarService = inject(SidebarService);
  public useCase = inject(PromptUseCase);

  // 编辑器模型
  editModel = {
    versionTag: '',
    content: '',
    variables: [] as string[]
  };

  ngOnInit() {
    this.useCase.loadTemplates();
  }

  isSidebarOpen() {
    return this.sidebarService.isOpen();
  }

  onSelectTemplate(template: PromptTemplate) {
    this.useCase.selectTemplate(template);
    // 移动端选择后自动关闭侧边栏
    if (window.innerWidth < 1024) {
      this.sidebarService.close();
    }
  }

  onSelectVersion(version: PromptVersion) {
    this.useCase.selectedVersion.set(version);
    this.editModel = {
      versionTag: '', // 重置为新版本
      content: version.content,
      variables: [...version.variables]
    };
  }

  onSaveVersion() {
    if (!this.editModel.versionTag || !this.editModel.content) return;
    
    this.useCase.saveVersion({
      versionTag: this.editModel.versionTag,
      content: this.editModel.content,
      variables: this.editModel.variables,
      modelConfig: this.useCase.selectedVersion()?.modelConfig || {}
    });
  }

  onActivate(version: PromptVersion) {
    this.useCase.activateVersion(version.id);
  }

  addVariable(input: HTMLInputElement) {
    const value = input.value.trim();
    if (value && !this.editModel.variables.includes(value)) {
      this.editModel.variables.push(value);
    }
    input.value = '';
  }

  removeVariable(variable: string) {
    this.editModel.variables = this.editModel.variables.filter(v => v !== variable);
  }
}
