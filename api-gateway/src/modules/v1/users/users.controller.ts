import { Controller, Get, Post, Patch, Body, Param, UseGuards, Delete, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';

@Controller({ path: 'users', version: "1" })
@UseGuards(AuthGuard)
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @ApiBearerAuth()
    @ApiResponse({
        status: 201,
        description: "User created",
        example: {
            message: "User Created",
            user: {
                id: 1,
                name: "name",
                email: "email",
                role: "role",
            },
        },
    })
    @ApiResponse({
        status: 500,
        description: "Internal Server Error",
    })
    @Post()
    async create(@Body() createUserDto: CreateUserDto, @Req() req: any) {
        try {
            return this.usersService.create(createUserDto, req);
        } catch (error) {
            throw error
        }
    }

    @ApiBearerAuth()
    @ApiResponse({
        status: 201,
        description: "User Fetched Successfully",
        example: {
            message: "User Fetched Successfully",
            user: [{
                id: 1,
                name: "name",
                email: "email",
                role: "role",
            }],
        },
    })
    @ApiResponse({
        status: 500,
        description: "Internal Server Error",
    })
    @Get()
    async findAll() {
        return this.usersService.findAll();
    }

    @ApiBearerAuth()
    @ApiResponse({
        status: 201,
        description: "User Updated Successfully",
        example: {
            message: "User Updated Successfully",
            user: {
                id: 1,
                name: "name",
                email: "email",
                role: "role",
            },
        },
    })
    @ApiResponse({
        status: 500,
        description: "Internal Server Error",
    })
    @Patch(':id')
    async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @Req() req: any) {
        return this.usersService.update(id, updateUserDto, req);
    }

    @ApiBearerAuth()
    @ApiResponse({
        status: 201,
        description: "User with ID 1234 successfully deleted",
        example: {
            message: "User with ID 1234 successfully deleted",
        },
    })
    @ApiResponse({
        status: 500,
        description: "Internal Server Error",
    })
    @Delete(':id')
    async delete(@Param('id') id: string) {
        return this.usersService.delete(id);
    }
}
