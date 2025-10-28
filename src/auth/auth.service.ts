// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(email: string, password: string, first_name?: string, last_name?: string) {
    const existingUser = await this.userRepo.findOne({ where: { email } });
    if (existingUser) throw new Error('Email already exists');

    const user = this.userRepo.create({ email, password_hash: password, first_name, last_name });
    await this.userRepo.save(user);
    return { message: 'Registration successful' };
  }

  async validateUser(email: string, password: string) {
    const user = await this.userRepo.findOne({
      where: { email },
      relations: ['roles', 'roles.role'], // 级联加载 UserRole 和 Role
    });

    if (!user) return null;

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return null;

    return user;
  }


  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('用户名或密码错误');
    }
    
    // 提取角色名称（如 ["admin", "user"]）
    const roleNames = user.roles.map(ur => ur.role.name);
    console.log(roleNames)

    const payload = {
      email: user.email,
      sub: user.id,
      roles: roleNames,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

}
