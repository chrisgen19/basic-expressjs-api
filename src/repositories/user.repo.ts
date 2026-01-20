import prisma from '../config/database';
import { User, Prisma } from '@prisma/client';

// Define safe user type without password
export type SafeUser = Omit<User, 'password'>;

// Type for findMany with specific select
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

export class UserRepository {
  async create(data: {
    email: string;
    password: string;
    name?: string;
    role?: string;
  }): Promise<User> {
    return prisma.user.create({
      data: {
        email: data.email,
        password: data.password,
        ...(data.name !== undefined && { name: data.name }),
        role: data.role || 'user',
      },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  async findAll(options?: {
    skip?: number;
    take?: number;
    where?: {
      role?: string;
      OR?: Array<{
        email?: { contains: string; mode: 'insensitive' };
        name?: { contains: string; mode: 'insensitive' };
      }>;
    };
  }): Promise<{ users: UserWithoutPassword[]; total: number }> {
    const whereClause = options?.where || {};

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        ...(options?.skip !== undefined && { skip: options.skip }),
        ...(options?.take !== undefined && { take: options.take }),
        where: whereClause,
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      prisma.user.count({ where: whereClause }),
    ]);

    return { users, total };
  }

  async update(id: string, data: Prisma.UserUpdateInput): Promise<User> {
    return prisma.user.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<User> {
    return prisma.user.delete({
      where: { id },
    });
  }

  async exists(email: string): Promise<boolean> {
    const count = await prisma.user.count({
      where: { email },
    });
    return count > 0;
  }
}

export const userRepository = new UserRepository();
