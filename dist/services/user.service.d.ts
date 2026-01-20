import { CreateUserInput, UpdateUserInput, SearchUsersInput } from '../schemas/user.schema';
export declare class UserService {
    createUser(data: CreateUserInput): Promise<{
        id: string;
        email: string;
        name: string | null;
        role: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getUserById(id: string): Promise<{
        id: string;
        email: string;
        name: string | null;
        role: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getAllUsers(query: SearchUsersInput): Promise<{
        users: {
            id: string;
            email: string;
            name: string | null;
            role: string;
            createdAt: Date;
            updatedAt: Date;
        }[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    updateUser(id: string, data: UpdateUserInput): Promise<{
        id: string;
        email: string;
        name: string | null;
        role: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    deleteUser(id: string): Promise<{
        message: string;
    }>;
}
export declare const userService: UserService;
//# sourceMappingURL=user.service.d.ts.map