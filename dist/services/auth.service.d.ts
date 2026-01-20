import { RegisterInput, LoginInput } from '../schemas/auth.schema';
export declare class AuthService {
    register(data: RegisterInput): Promise<{
        user: {
            id: string;
            email: string;
            name: string | null;
            role: string;
        };
        accessToken: string;
        refreshToken: string;
    }>;
    login(data: LoginInput): Promise<{
        user: {
            id: string;
            email: string;
            name: string | null;
            role: string;
        };
        accessToken: string;
        refreshToken: string;
    }>;
    refresh(refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
}
export declare const authService: AuthService;
//# sourceMappingURL=auth.service.d.ts.map