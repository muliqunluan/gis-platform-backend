# NeoMap 地理空间数据服务 API 文档

## 概述

NeoMap 是一个基于 NestJS 构建的地理信息服务平台，提供地图管理、用户认证、权限控制等功能。

## 基础信息

- **基础URL**: `http://localhost:7050/api`
- **认证方式**: JWT Bearer Token
- **数据格式**: JSON

## 认证接口

### 用户注册

**POST** `/auth/register`

注册新用户并返回访问令牌。

**请求体**:
```json
{
  "email": "user@example.com",
  "password": "password123",
  "first_name": "张",
  "last_name": "三"
}
```

**响应**:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 用户登录

**POST** `/auth/login`

用户登录并返回访问令牌。

**请求体**:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**响应**:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 获取当前用户信息

**GET** `/auth/me`

获取当前登录用户的详细信息。

**请求头**:
```
Authorization: Bearer <access_token>
```

**响应**:
```json
{
  "id": 1,
  "email": "user@example.com",
  "first_name": "张",
  "last_name": "三",
  "is_active": true,
  "roles": [
    {
      "id": 1,
      "name": "viewer"
    }
  ]
}
```

## 用户管理接口

### 获取用户角色

**GET** `/users/{email}/roles`

获取指定用户的角色列表。

**权限要求**: 需要用户读取权限

**响应**:
```json
["admin", "editor"]
```

### 更新用户角色

**PATCH** `/users/{email}/roles`

更新指定用户的角色。

**权限要求**: 需要用户更新权限

**请求体**:
```json
{
  "roles": ["admin", "editor"]
}
```

**响应**:
```json
{
  "success": true,
  "user": {
    "id": 1,
    "email": "user@example.com",
    "roles": ["admin", "editor"]
  }
}
```

## 地图管理接口

### 创建地图

**POST** `/maps`

创建新地图。

**权限要求**: 需要地图创建权限

**请求头**:
```
Authorization: Bearer <access_token>
```

**请求体**:
```json
{
  "name": "我的地图",
  "type": "openlayers_gaode",
  "bounds": {
    "minLng": 116.0,
    "minLat": 39.0,
    "maxLng": 117.0,
    "maxLat": 40.0
  },
  "zoomRange": [5, 18],
  "isPublic": false
}
```

**响应**:
```json
{
  "id": 1,
  "name": "我的地图",
  "type": "openlayers_gaode",
  "bounds": {
    "minLng": 116.0,
    "minLat": 39.0,
    "maxLng": 117.0,
    "maxLat": 40.0
  },
  "zoomRange": [5, 18],
  "isPublic": false,
  "owner": {
    "id": 1,
    "email": "user@example.com"
  },
  "createdAt": "2023-12-01T10:00:00.000Z"
}
```

### 获取公开地图

**GET** `/maps/public`

获取所有公开的地图列表。

**响应**:
```json
[
  {
    "id": 1,
    "name": "公开地图",
    "type": "openlayers_gaode",
    "isPublic": true,
    "owner": {
      "id": 1,
      "email": "creator@example.com"
    },
    "createdAt": "2023-12-01T10:00:00.000Z"
  }
]
```

### 获取我的地图

**GET** `/maps/my`

获取当前用户创建的地图列表。

**权限要求**: 需要地图读取权限

**请求头**:
```
Authorization: Bearer <access_token>
```

**响应**:
```json
[
  {
    "id": 1,
    "name": "我的地图",
    "type": "openlayers_gaode",
    "isPublic": false,
    "createdAt": "2023-12-01T10:00:00.000Z"
  }
]
```

### 获取地图详情

**GET** `/maps/{id}`

获取指定地图的详细信息。

**权限要求**: 需要地图读取权限

**响应**:
```json
{
  "id": 1,
  "name": "我的地图",
  "type": "openlayers_gaode",
  "bounds": {
    "minLng": 116.0,
    "minLat": 39.0,
    "maxLng": 117.0,
    "maxLat": 40.0
  },
  "zoomRange": [5, 18],
  "isPublic": false,
  "owner": {
    "id": 1,
    "email": "user@example.com"
  },
  "layers": [
    {
      "id": 1,
      "name": "基础图层",
      "type": "vector",
      "url": "https://example.com/layer.json",
      "visible": true,
      "zIndex": 1
    }
  ],
  "createdAt": "2023-12-01T10:00:00.000Z"
}
```

### 删除地图

**DELETE** `/maps/{id}`

删除指定的地图。

**权限要求**: 需要地图删除权限

**请求头**:
```
Authorization: Bearer <access_token>
```

**响应**:
```json
{
  "success": true,
  "message": "地图删除成功"
}
```

## 角色管理接口

### 获取所有角色

**GET** `/roles`

获取系统中所有可用的角色。

**权限要求**: 需要角色读取权限

**响应**:
```json
["admin", "editor", "viewer"]
```

## 用户资料接口

### 获取用户资料

**GET** `/user-profile/{id}`

获取指定用户的详细资料。

**响应**:
```json
{
  "id": 1,
  "email": "user@example.com",
  "first_name": "张",
  "last_name": "三",
  "is_active": true,
  "createdAt": "2023-12-01T10:00:00.000Z"
}
```

## 错误响应

所有API在出错时都会返回统一的错误格式：

```json
{
  "statusCode": 400,
  "message": "错误描述",
  "error": "Bad Request"
}
```

常见错误码：
- `400`: 请求参数错误
- `401`: 未授权访问
- `403`: 权限不足
- `404`: 资源不存在
- `500`: 服务器内部错误

## 权限系统

系统使用基于角色的访问控制(RBAC)，包含以下角色：

- **admin**: 管理员，拥有所有权限
- **editor**: 编辑者，可以创建、编辑地图和图层
- **viewer**: 查看者，只能查看公开的地图

权限包括：
- **create**: 创建资源
- **read**: 读取资源
- **update**: 更新资源
- **delete**: 删除资源
- **manage**: 管理资源

支持的资源类型：
- **Map**: 地图
- **Layer**: 图层
- **Group**: 群组
- **User**: 用户
- **Role**: 角色