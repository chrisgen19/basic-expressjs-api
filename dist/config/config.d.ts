import { CorsOptions } from 'cors';
interface Config {
    port: number;
    nodeEnv: string;
    databaseUrl: string;
    jwtSecret: string;
    jwtRefreshSecret: string;
    cors: CorsOptions;
}
export declare const config: Config;
export {};
//# sourceMappingURL=config.d.ts.map