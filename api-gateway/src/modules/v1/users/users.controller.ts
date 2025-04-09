import { Controller, Get, Post, Patch, Body, Param, UseGuards, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';

@Controller('users')
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
    async create(@Body() createUserDto: CreateUserDto) {
        try {
            return this.usersService.create(createUserDto);
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
    async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        return this.usersService.update(id, updateUserDto);
    }

    @ApiBearerAuth()
    @ApiResponse({
        status: 201,
        description: "User Deleted Successfully",
        example: {
            message: "User Deleted Successfully",
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
    @Delete(':id')
    async delete(@Param('id') id: string) {
        return this.usersService.delete(id);
    }
}
