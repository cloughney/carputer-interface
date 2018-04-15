import { IAudioModule, AudioSource } from './audio';

class AudioSourceService {
    private activeSourceContainer: { key: string, module: IAudioModule } | null;

    public constructor() {
        this.activeSourceContainer = null;
    }

    public get activeSource(): AudioSource | null {
        if (this.activeSourceContainer === null) {
            return null;
        }

        const key = this.activeSourceContainer.key;
        const { browser, player } = this.activeSourceContainer.module;

        return { key, browser, player };
    }

    public async setActiveSource(key: string): Promise<AudioSource> {
        if (this.activeSourceContainer !== null && this.activeSourceContainer.key !== key) {
            await this.activeSourceContainer.module.dispose();
        }
        
        const audioModule = await import(`./${key}`) as IAudioModule;

        this.activeSourceContainer = { key, module: audioModule };
        await audioModule.initialize();

        return this.activeSource as AudioSource;
    }
}

export const audioSourceService = new AudioSourceService();
export * from './audio';