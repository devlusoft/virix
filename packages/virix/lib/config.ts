import type {UserConfig} from 'vite'

export interface VirixConfig {
  port?: number
  vite?: UserConfig
}

export function defineConfig(config: VirixConfig): VirixConfig {
  return config
}
