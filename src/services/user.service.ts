import { userRepository } from '../repositories/user.repo';
import { hashPassword } from '../utils/password';
import { CreateUserInput, UpdateUserInput, SearchUsersInput } from '../schemas/user.schema';

export class UserService {
  async createUser(data: CreateUserInput) {
    // Check if user already exists
    const existingUser = await userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    // Hash password
    const hashedPassword = await hashPassword(data.password);

    // Create user
    const user = await userRepository.create({
      email: data.email,
      password: hashedPassword,
      ...(data.name !== undefined && { name: data.name }),
      role: data.role,
    });

    // Return user without password
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async getUserById(id: string) {
    const user = await userRepository.findById(id);
    if (!user) {
      throw new Error('User not found');
    }

    // Return user without password
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async getAllUsers(query: SearchUsersInput) {
    const skip = (query.page - 1) * query.limit;
    const take = query.limit;

    const where: any = {};

    if (query.role) {
      where.role = query.role;
    }

    if (query.q) {
      where.OR = [
        { email: { contains: query.q, mode: 'insensitive' } },
        { name: { contains: query.q, mode: 'insensitive' } },
      ];
    }

    const { users, total } = await userRepository.findAll({
      skip,
      take,
      where: Object.keys(where).length > 0 ? where : undefined,
    });

    return {
      users: users.map((user) => ({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      })),
      pagination: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages: Math.ceil(total / query.limit),
      },
    };
  }

  async updateUser(id: string, data: UpdateUserInput) {
    // Check if user exists
    const existingUser = await userRepository.findById(id);
    if (!existingUser) {
      throw new Error('User not found');
    }

    // If email is being updated, check if it's already taken
    if (data.email && data.email !== existingUser.email) {
      const emailExists = await userRepository.exists(data.email);
      if (emailExists) {
        throw new Error('Email already in use');
      }
    }

    // Update user - filter out undefined values
    const updateData: Record<string, string> = {};
    if (data.email !== undefined) updateData.email = data.email;
    if (data.name !== undefined) updateData.name = data.name;
    if (data.role !== undefined) updateData.role = data.role;

    const user = await userRepository.update(id, updateData);

    // Return user without password
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async deleteUser(id: string) {
    // Check if user exists
    const existingUser = await userRepository.findById(id);
    if (!existingUser) {
      throw new Error('User not found');
    }

    await userRepository.delete(id);

    return { message: 'User deleted successfully' };
  }
}

export const userService = new UserService();
