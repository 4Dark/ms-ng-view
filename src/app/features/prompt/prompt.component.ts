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
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { SidebarService } from '../../core/infrastructure/services/sidebar.service';
import { PromptUseCase } from '../../core/use-cases/prompt.use-case';
import { PromptTemplate, PromptVersion } from '../../core/domain/prompt.model';

/**
 * Prompt 管理组件
 * 负责展示 Prompt 模板列表、版本历史，以及提供 Prompt 内容编辑和版本激活功能。
 */
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
    MatTooltipModule,
    MatSnackBarModule
  ],
  templateUrl: './prompt.component.html',
  styleUrl: './prompt.component.css'
})
export class PromptComponent implements OnInit {
  /** 侧边栏服务 */
  public sidebarService = inject(SidebarService);
  /** Prompt 业务用例 */
  public useCase = inject(PromptUseCase);
  /** 消息提示服务 */
  private snackBar = inject(MatSnackBar);

  /** 
   * 编辑器模型 
   * 用于双向绑定当前正在编辑的 Prompt 详情
   */
  editModel = {
    versionTag: '',
    content: '',
    variables: [] as string[]
  };

  /**
   * 初始化时加载所有 Prompt 模板
   */
  ngOnInit() {
    this.useCase.loadTemplates();
  }

  /**
   * 切换侧边栏状态
   */
  toggleSidebar() {
    this.sidebarService.toggle();
  }

  /**
   * 获取侧边栏是否处于打开状态
   * @returns boolean
   */
  isSidebarOpen() {
    return this.sidebarService.isOpen();
  }

  /**
   * 选中一个 Prompt 模板
   * 加载该模板的版本列表，并默认同步显示生效版本的内容。
   * @param template 选中的模板对象
   */
  async onSelectTemplate(template: PromptTemplate) {
    await this.useCase.selectTemplate(template);
    
    // 默认选中后同步到编辑模型
    const version = this.useCase.selectedVersion();
    if (version) {
      this.onSelectVersion(version);
    }

    // 移动端选择后自动关闭侧边栏
    if (window.innerWidth < 1024) {
      this.sidebarService.close();
    }
  }

  /**
   * 选中一个具体的版本
   * 将版本内容填充到编辑模型中，准备进行克隆或查看。
   * @param version 选中的版本对象
   */
  onSelectVersion(version: PromptVersion) {
    this.useCase.selectedVersion.set(version);
    this.editModel = {
      versionTag: this.suggestNextVersion(version.versionTag), // 自动给出递加版本建议
      content: version.content,
      variables: [...version.variables]
    };
  }

  /**
   * 建议下一个版本号
   * 简单的递加逻辑，如 v1.0.0 -> v1.0.1
   * @param currentTag 当前版本号
   * @returns 建议的版本号
   */
  private suggestNextVersion(currentTag: string): string {
    if (!currentTag) return 'v1.0.0';
    // 匹配末尾数字
    const match = currentTag.match(/^(.*?)(\d+)$/);
    if (match) {
      const prefix = match[1];
      const num = parseInt(match[2], 10);
      return `${prefix}${num + 1}`;
    }
    return currentTag + '.1';
  }

  /**
   * 保存当前编辑的内容为新版本
   */
  async onSaveVersion() {
    if (!this.editModel.versionTag || !this.editModel.content) return;
    
    try {
      await this.useCase.saveVersion({
        versionTag: this.editModel.versionTag,
        content: this.editModel.content,
        variables: this.editModel.variables,
        modelConfig: this.useCase.selectedVersion()?.modelConfig || {}
      });
      
      this.snackBar.open('版本保存成功', '关闭', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: ['success-snackbar']
      });
    } catch (error) {
      this.snackBar.open('版本保存失败', '重试', {
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
    }
  }

  /**
   * 激活指定版本为生产生效版本
   * @param version 要激活的版本对象
   */
  async onActivate(version: PromptVersion) {
    try {
      await this.useCase.activateVersion(version.id);
      this.snackBar.open('版本激活成功', '关闭', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
    } catch (error) {
      this.snackBar.open('版本激活失败', '重试', {
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
    }
  }

  /**
   * 向当前 Prompt 中添加变量定义
   * @param input 包含变量名的输入框元素
   */
  addVariable(input: HTMLInputElement) {
    const value = input.value.trim();
    if (value && !this.editModel.variables.includes(value)) {
      this.editModel.variables.push(value);
    }
    input.value = '';
  }

  /**
   * 移除指定的变量定义
   * @param variable 要移除的变量名
   */
  removeVariable(variable: string) {
    this.editModel.variables = this.editModel.variables.filter(v => v !== variable);
  }
}
