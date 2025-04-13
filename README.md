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

example logs 

2025-04-13T10:57:56.512Z - [POST] /v1/auth/login | User: anonymous - 269ms
  Request: {}
  Response: {
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMDA4YjZkZi0xMzAzLTQ2YzYtODgxYy1mZTAzY2QwMDRiNDkiLCJyb2xlIjoic3VwZXJhZG1pbiIsImlhdCI6MTc0NDU0MTg3NiwiZXhwIjoxNzQ0NTQ1NDc2fQ.RAat50ZTxF9fgGBTumYVPiOg97cofWirpc6nrexhNNg"
}

2025-04-13T10:58:22.411Z - [POST] /v1/users | User: anonymous
  Request: {
  "name": "John Doe",
  "email": "john@example1.com",
  "password": "securePass123",
  "role": "editor"
}

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

2025-04-13T11:06:48.476Z - [POST] /v1/users | User: anonymous
  Request: {
  "name": "John Doe",
  "email": "john@example5.com",
  "password": "securePass123",
  "role": "editor"
}
  Response: {}
2025-04-13T11:06:53.517Z - [POST] /v1/users | User: anonymous - 183ms
  Request: {}
  Response: {
  "id": "edb2b336-8bd6-430f-bb95-2fd198dbe640",
  "name": "John Doe",
  "email": "john@example5.com",
  "password": "$2b$10$GCzuodMt6jGpok39fyvQyOJrSc8NHZtA.iSjREkps6k31gVDcPqkO",
  "role": "editor",
  "createdById": "1008b6df-1303-46c6-881c-fe03cd004b49",
  "updatedById": null
}

2025-04-13T11:08:40.802Z - [2025-04-13T11:08:40.801Z | POST] /v1/users | User: anonymous | Error: Invalid/Expired token | Status : 401
  Request: {
  "name": "John Doe",
  "email": "john@example5.com",
  "password": "securePass123",
  "role": "editor"
}
  Response: {} 