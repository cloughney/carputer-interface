import { AudioModule, AudioSource } from './audio';
import spotifyModule from './spotify';
import podcastModule from './streams';

interface AudioModuleMap { [key: string]: AudioModule }

class AudioSourceService {
    private activeSourceContainer: { key: string, module: AudioModule } | null;

    public constructor(private readonly moduleMap: AudioModuleMap) {
        this.activeSourceContainer = null;
    }

    public get availableSources(): AudioSource[] {
        return Object.getOwnPropertyNames(this.moduleMap)
            .map(x => this.getSourceFromModule(x, this.moduleMap[x]));
    }

    public get activeSource(): AudioSource | null {
        if (this.activeSourceContainer === null) {
            return null;
        }

        return this.getSourceFromModule(
            this.activeSourceContainer.key,
            this.activeSourceContainer.module);
    }

    public async setActiveSource(key: string): Promise<AudioSource> {
        if (this.activeSourceContainer !== null && this.activeSourceContainer.key !== key) {
            await this.activeSourceContainer.module.dispose();
        }
        
        const audioModule = this.moduleMap[key];
        if (audioModule === undefined) {
            throw new Error(`Cannot find an audio module with the key '${key}'.`);
        }

        this.activeSourceContainer = { key, module: audioModule };
        await audioModule.initialize();

        return this.activeSource as AudioSource;
    }

    private getSourceFromModule(key: string, audioModule: AudioModule): AudioSource {
        const { browser, player } = audioModule;
        return { key, browser, player };
    }
}

export const audioSourceService = new AudioSourceService({
	'spotify': spotifyModule as AudioModule,
	'podcast': podcastModule
});

export * from './audio';
