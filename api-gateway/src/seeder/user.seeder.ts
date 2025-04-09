// src/seeder/user.seeder.ts

import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/modules/v1/users/users.service';

@Injectable()
export class UserSeeder {
  constructor(private readonly userService: UsersService) {}

  async seedAdmin() {
    const adminUser = await this.userService.findByRole('admin');

    if (!adminUser) {
      await this.userService.create({
        name: 'administrator',
        password: 'adminpassword',
        email: 'admin@gmail.com',
        role: 'admin',
      });

      console.log('✅ Admin user created successfully.');
    } else {
      console.log('ℹ️ Admin user already exists.');
    }
  }
}
