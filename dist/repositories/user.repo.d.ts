import { User } from '@prisma/client';
export declare class UserRepository {
    create(data: {
        email: string;
        password: string;
        name?: string;
        role?: string;
    }): Promise<User>;
    findByEmail(email: string): Promise<User | null>;
    findById(id: string): Promise<User | null>;
    findAll(options?: {
        skip?: number;
        take?: number;
        where?: {
            role?: string;
            OR?: Array<{
                email?: {
                    contains: string;
                    mode: 'insensitive';
                };
                name?: {
                    contains: string;
                    mode: 'insensitive';
                };
            }>;
        };
    }): Promise<{
        users: User[];
        total: number;
    }>;
    update(id: string, data: {
        email?: string;
        name?: string;
        role?: string;
    }): Promise<User>;
    delete(id: string): Promise<User>;
    exists(email: string): Promise<boolean>;
}
export declare const userRepository: UserRepository;
//# sourceMappingURL=user.repo.d.ts.map