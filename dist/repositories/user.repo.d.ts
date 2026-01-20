import { User, Prisma } from '@prisma/client';
export type SafeUser = Omit<User, 'password'>;
type UserWithoutPassword = Prisma.UserGetPayload<{
    select: {
        id: true;
        email: true;
        name: true;
        role: true;
        createdAt: true;
        updatedAt: true;
    };
}>;
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
        users: UserWithoutPassword[];
        total: number;
    }>;
    update(id: string, data: Prisma.UserUpdateInput): Promise<User>;
    delete(id: string): Promise<User>;
    exists(email: string): Promise<boolean>;
}
export declare const userRepository: UserRepository;
export {};
//# sourceMappingURL=user.repo.d.ts.map