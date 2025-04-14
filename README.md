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

## Modules

1. Auth Module 

In this module we have a login route and in this we have to send username and password.
and then we will get access_token of JWT sign of userId and role.

2. Permission Module

In this module we have CRUD operations for Creating , Updating , Reading and Deleting permissions.
in this we have user based permissions.
"userId, role, method, url" we can create permission with this keys and 
in PermissionFactory we have get permission data for the url , role and method
- `gateway/src/factories/permission.factory.ts`

and in PermissionGuard we get the userid and call factory method for checking the permission 
- `gateway/src/common/guards/permission.guard.ts`

3. Documents Module

In this module we have CRUD operation for uploading file in Documents , Updating , Reading and Deleting documents.
in this we have multer factory for uploading files
- `gateway/src/factories/multer.factory.ts`

4. User Module 
In this module we have CRUD operation for Creating, Updating, Reading and Deleting the user data 
and in this user we will save the user with role and also we have createdBy so we can have trace for creator and we have updatedBy.

5. Ingestion Module
In this module we have route for create and get the ingestion to the microservice and we can send data via 
send method from instance of ClientProxy from @nestjs/microservices and in the other hand of microservice 
we will catch this message via @MessagePattern so we can catch any event fired from api-gateway and get message pattern data.

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

## Swagger Documentation 

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

## Cron Service

In this we have a cron service for making zip of 2 days old logs file 
- `gateway/src/common/service/logCron.service.ts`
- `ingestion/src/common/service/logCron.service.ts`

## logger 

In this i created logger service and have logs for request, response and errors.

## Request Type Logs
2025-04-13T10:58:22.411Z - [POST] /v1/users | User: anonymous
  Request: {
  "name": "John Doe",
  "email": "john@example1.com",
  "password": "securePass123",
  "role": "editor"
}

## Response Type Logs
2025-04-13T10:58:22.579Z - [POST] /v1/users | User: anonymous - 171ms
  Request: {}
  Response: {
  "id": "5d07603a-ae41-4097-b27a-517474f4a19b",
  "name": "John Doe",
  "email": "john@example1.com",
  "password": "$2b$10$VmNukOP0B8lmM.TPNerluu0hm.BXEnNLyvG/X0NC96yEMnE3PwULO",
  "role": "editor",
  "createdById": null
}

## Error Type Logs
2025-04-14T18:20:04.458Z - [2025-04-14T18:20:04.457Z | POST] /v1/users | User: anonymous | Error: Invalid/Expired token | Status : 401
  Request: {
  "name": "John Doe",
  "email": "john@example5.com",
  "password": "securePass123",
  "role": "editor"
}
  Response: {}