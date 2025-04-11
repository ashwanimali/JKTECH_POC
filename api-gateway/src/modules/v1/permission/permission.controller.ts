import { Controller, Get, Post, Body, Param, Patch, Delete, Req, UseGuards } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { PermissionService } from './permission.service';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';


@Controller({path : 'permissions' , version:"1"})
@UseGuards(AuthGuard)
export class PermissionController {
    constructor(private readonly permissionService: PermissionService) { }

    @ApiBearerAuth()
    @ApiResponse({
        status: 201,
        description: "Permission created",
        example: {
            id: 1,
            userId: "userId",
            method: "method",
            role: "role",
            url: "url",
            createdBy: {
                id: 1,
                name: "name",
                email: "email",
                role: "role",
            }

        },
    })
    @ApiResponse({
        status: 500,
        description: "Internal Server Error",
    })
    @Post()
    create(@Body() dto: CreatePermissionDto, @Req() req: any
    ) {
        return this.permissionService.create(dto, req.user);
    }

    @ApiBearerAuth()
    @ApiResponse({
        status: 201,
        description: "Permission get",
        example: {
            id: 1,
            userId: "userId",
            method: "method",
            role: "role",
            url: "url",
            createdBy: {
                id: 1,
                name: "name",
                email: "email",
                role: "role",
            }
        },
    })
    @ApiResponse({
        status: 500,
        description: "Internal Server Error",
    })
    @Get()
    findAll() {
        return this.permissionService.findAll();
    }

    @ApiBearerAuth()
    @ApiResponse({
        status: 201,
        description: "Permission get",
        example: {
            id: 1,
            userId: "userId",
            method: "method",
            role: "role",
            url: "url",
            createdBy: {
                id: 1,
                name: "name",
                email: "email",
                role: "role",
            }
        },
    })
    @ApiResponse({
        status: 500,
        description: "Internal Server Error",
    })
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.permissionService.findOne(id);
    }


    @ApiBearerAuth()
    @ApiResponse({
        status: 201,
        description: "Permission updated",
        example: {
            id: 1,
            userId: "userId",
            method: "method",
            role: "role",
            url: "url",
            createdBy: {
                id: 1,
                name: "name",
                email: "email",
                role: "role",
            }
        },
    })
    @ApiResponse({
        status: 500,
        description: "Internal Server Error",
    })
    @Patch(':id')
    update(@Param('id') id: string, @Body() dto: UpdatePermissionDto, @Req() req: any) {
        return this.permissionService.update(id, dto, req.user);
    }

    @ApiBearerAuth()
    @ApiResponse({
        status: 201,
        description: "Permission delted",
        example: {},
    })
    @ApiResponse({
        status: 500,
        description: "Internal Server Error",
    })
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.permissionService.remove(id);
    }
}
