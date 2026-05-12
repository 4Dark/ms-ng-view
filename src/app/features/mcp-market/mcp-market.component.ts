import { Component, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { McpPluginUseCase } from '../../core/use-cases/mcp-plugin.use-case';
import { McpPlugin } from '../../core/domain/mcp-plugin.model';
import { TranslateModule } from '@ngx-translate/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { McpPluginDialogComponent } from './components/mcp-plugin-dialog/mcp-plugin-dialog.component';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-mcp-market',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatSlideToggleModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    TranslateModule,
    MatDialogModule,
    MatTooltipModule
  ],
  templateUrl: './mcp-market.component.html',
  styleUrl: './mcp-market.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class McpMarketComponent implements OnInit {
  public mcpUseCase = inject(McpPluginUseCase);
  private dialog = inject(MatDialog);

  ngOnInit(): void {
    this.mcpUseCase.loadPlugins();
  }

  onToggle(plugin: McpPlugin): void {
    this.mcpUseCase.togglePlugin(plugin);
  }

  async onRefresh(plugin: McpPlugin): Promise<void> {
    try {
      await this.mcpUseCase.refreshPlugin(plugin.id);
      // Maybe show a notification here
    } catch (error) {
      // Error is already logged in use case
    }
  }

  async openAddDialog(): Promise<void> {
    const dialogRef = this.dialog.open(McpPluginDialogComponent, {
      width: '600px',
      disableClose: true
    });

    const result = await firstValueFrom(dialogRef.afterClosed());
    if (result) {
      await this.mcpUseCase.registerPlugin(result);
    }
  }

  async openEditDialog(plugin: McpPlugin): Promise<void> {
    const dialogRef = this.dialog.open(McpPluginDialogComponent, {
      width: '600px',
      disableClose: true,
      data: plugin
    });

    const result = await firstValueFrom(dialogRef.afterClosed());
    if (result) {
      await this.mcpUseCase.updatePlugin(plugin.id, result);
    }
  }
}
