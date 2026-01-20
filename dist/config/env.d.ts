interface Config {
    port: number;
    nodeEnv: string;
    databaseUrl: string;
    jwt: {
        accessSecret: string;
        refreshSecret: string;
        accessExpiresIn: string;
        refreshExpiresIn: string;
    };
    cors: {
        origin: string;
        credentials: boolean;
    };
}
export declare const config: Config;
export {};
//# sourceMappingURL=env.d.ts.map