import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { AppConfig } from '../models/Config';

class ConfigManager {
  private configPath: string;
  private config: AppConfig;

  constructor(configPath?: string) {
    this.configPath = configPath || join(__dirname, '../../config/default.json');
    this.config = this.loadConfig();
  }

  private loadConfig(): AppConfig {
    try {
      const data = readFileSync(this.configPath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error loading config:', error);
      throw new Error('Failed to load configuration file');
    }
  }

  public getConfig(): AppConfig {
    return this.config;
  }

  public getSources() {
    return this.config.sources;
  }

  public getFilters() {
    return this.config.filters;
  }

  public getWeights() {
    return this.config.weights;
  }

  public getScrapingConfig() {
    return this.config.scraping;
  }

  public updateConfig(updates: Partial<AppConfig>): void {
    this.config = { ...this.config, ...updates };
    this.saveConfig();
  }

  public updateSources(sources: Partial<AppConfig['sources']>): void {
    this.config.sources = { ...this.config.sources, ...sources };
    this.saveConfig();
  }

  public updateFilters(filters: Partial<AppConfig['filters']>): void {
    this.config.filters = { ...this.config.filters, ...filters };
    this.saveConfig();
  }

  public updateWeights(weights: Partial<AppConfig['weights']>): void {
    this.config.weights = { ...this.config.weights, ...weights };
    this.saveConfig();
  }

  private saveConfig(): void {
    try {
      writeFileSync(this.configPath, JSON.stringify(this.config, null, 2));
      console.log('Configuration saved successfully');
    } catch (error) {
      console.error('Error saving config:', error);
      throw new Error('Failed to save configuration file');
    }
  }

  public reload(): void {
    this.config = this.loadConfig();
  }
}

export const configManager = new ConfigManager();
export default configManager;
