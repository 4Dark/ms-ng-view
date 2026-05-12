import { Injectable, signal, computed } from '@angular/core';
import { McpPlugin } from '../domain/mcp-plugin.model';
import { McpPluginAdapter } from '../adapters/mcp-plugin.adapter';

@Injectable({
  providedIn: 'root'
})
export class McpPluginUseCase {
  private pluginsSignal = signal<McpPlugin[]>([]);
  private loadingSignal = signal<boolean>(false);

  // Expose signals for UI
  public plugins = computed(() => this.pluginsSignal());
  public isLoading = computed(() => this.loadingSignal());

  constructor(private adapter: McpPluginAdapter) {}

  /**
   * Initial load of plugins
   */
  async loadPlugins(): Promise<void> {
    this.loadingSignal.set(true);
    try {
      const data = await this.adapter.listAll();
      this.pluginsSignal.set(data);
    } catch (error) {
      console.error('Failed to load MCP plugins', error);
    } finally {
      this.loadingSignal.set(false);
    }
  }

  async togglePlugin(plugin: McpPlugin): Promise<void> {
    try {
      await this.adapter.togglePlugin(plugin.id);
      // Update local state for immediate feedback
      this.pluginsSignal.update(list => 
        list.map(p => p.id === plugin.id ? { ...p, enabled: !p.enabled } : p)
      );
    } catch (error) {
      console.error(`Failed to toggle plugin ${plugin.name}`, error);
    }
  }

  async registerPlugin(plugin: Partial<McpPlugin>): Promise<void> {
    this.loadingSignal.set(true);
    try {
      const newPlugin = await this.adapter.register(plugin);
      // Add to list and sort or just reload
      await this.loadPlugins(); 
    } catch (error) {
      console.error('Failed to register MCP plugin', error);
      throw error;
    } finally {
      this.loadingSignal.set(false);
    }
  }

  async refreshPlugin(pluginId: string): Promise<void> {
    try {
      await this.adapter.refreshPlugin(pluginId);
      // Optional: show a toast or message
    } catch (error) {
      console.error(`Failed to refresh plugin ${pluginId}`, error);
      throw error;
    }
  }

  async updatePlugin(id: string, plugin: Partial<McpPlugin>): Promise<void> {
    this.loadingSignal.set(true);
    try {
      await this.adapter.update(id, plugin);
      await this.loadPlugins();
    } catch (error) {
      console.error(`Failed to update plugin ${id}`, error);
      throw error;
    } finally {
      this.loadingSignal.set(false);
    }
  }
}
