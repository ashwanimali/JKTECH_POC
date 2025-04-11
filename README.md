# Steps to Execute

```sh
  # to start bulding the services
  docker-compose up --build 
```

Use this curl to get access to the application as an admin

```
curl --location 'http://localhost:3000/v1/user/login' \
--header 'Content-Type: application/json' \
--data-raw '{
    email: 'superadmin@gmail.com',
    password: 'superadminpassword'       
}'
```

## User Authentication 

This application uses JWT-based authentication implementation with Passport.js, Have custom AuthGuard to protect all routes that require authenticated access.JWT token are issued on successfull login and are required in the Authorization header (Bearer token is required).

## User Permissions 

This application implements role-based and permission-based access control for flexibility. Permissions are stored in the database, and also have crud operations for the permission DB; So the superadmin and the user who have permission to crud the permissions will change the permission as well 
in this we can update the permission of any type of user .

- `gateway/src/guards/auth.guard.ts`

- `gateway/src/factories/permission.factory.ts`

- `gateway/src/guards/permission.guard.ts`

- `gateway/src/modules/v1/auth/jwt.strategy.ts`

const matched = allPermissions.find(permission =>
  url.includes(permission.url) && permission.method === method,
);

so in any req we will check permission from permission table .

Type of user 
1. Admin
  For admin role user we will give permission to him for manage users, permissions,documents and ingestions .
2. Editor
  For editor role user we will give permissions to CRUD the documents and create and view to ingestion .
3. Viewer
  For viewer role user we will give permission to Read the documents and ingestion .

In the User, Document, permission and ingestion we also storing createdBy and updatedBy 

## NOTE

The swagger document can be accessible under `http://localhost:3000/docs`.

- `gateway/src/factories/swagger.factory.ts`

## mocked Ingestion Service

The ingestion service is another Nestjs microservice that run along with gateway. Have apis to add and get details of the ingestion as `@MessagePattern` with linked to their command.

## user seeder

In this i seed superadmin user to user database.

- `gateway/src/seeder/user.seeder.ts`

## db 

In this i created factory pattern for database using typeorm. 

- `gateway/src/seeder/typeorm.factory.ts`

## logger 

In this i created logger service and have logs for request, response and errors.