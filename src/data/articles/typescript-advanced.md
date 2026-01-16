---
title: "TypeScript 高级类型技巧"
excerpt: "掌握 TypeScript 的高级类型系统，编写更安全、更灵活的代码"
author: "Billy Zhou"
category: "前端开发"
tags: ["TypeScript", "类型系统", "进阶技巧"]
publishedAt: "2025-01-10"
---

# TypeScript 高级类型技巧

TypeScript 的类型系统非常强大，掌握高级类型技巧可以让我们编写出更安全、更灵活的代码。

## 条件类型 (Conditional Types)

条件类型允许我们根据条件选择类型：

```typescript
type NonNullable<T> = T extends null | undefined ? never : T;

type Response<T> = T extends string ? string : number;

function process<T>(value: T): Response<T> {
  if (typeof value === 'string') {
    return value.toUpperCase() as Response<T>;
  }
  return (value as number) * 2 as Response<T>;
}
```

## 映射类型 (Mapped Types)

映射类型允许我们基于现有类型创建新类型：

```typescript
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

type Partial<T> = {
  [P in keyof T]?: T[P];
};

interface User {
  id: number;
  name: string;
  email: string;
}

type ReadonlyUser = Readonly<User>;
type PartialUser = Partial<User>;
```

## 模板字面量类型 (Template Literal Types)

TypeScript 4.1 引入了模板字面量类型：

```typescript
type EventName<T extends string> = `on${Capitalize<T>}`;

type ButtonEvents = EventName<'click' | 'hover'>;
// "onClick" | "onHover"

type AllEvents = EventName<string>;
// 匹配所有以 "on" 开头的字符串
```

## infer 关键字

`infer` 关键字用于在条件类型中推断类型：

```typescript
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

type First<T extends any[]> = T extends [infer F, ...any[]] ? F : never;

type Unpacked<T> =
  T extends (infer U)[] ? U :
  T extends (...args: any[]) => infer U ? U :
  T extends Promise<infer U> ? U :
  T;

type T1 = Unpacked<string[]>; // string
type T2 = Unpacked<() => number>; // number
type T3 = Unpacked<Promise<boolean>>; // boolean
```

## 类型守卫 (Type Guards)

类型守卫帮助我们在运行时确定类型：

```typescript
function isString(value: unknown): value is string {
  return typeof value === 'string';
}

function process(value: unknown) {
  if (isString(value)) {
    // TypeScript 知道 value 是 string
    console.log(value.toUpperCase());
  }
}

function isError(error: unknown): error is Error {
  return error instanceof Error;
}

try {
  // 一些可能抛出错误的操作
} catch (error) {
  if (isError(error)) {
    console.error(error.message);
  }
}
```

## 工具类型 (Utility Types)

TypeScript 提供了许多实用的工具类型：

```typescript
// Pick - 选择特定属性
type UserPreview = Pick<User, 'name' | 'email'>;

// Omit - 排除特定属性
type CreateUser = Omit<User, 'id'>;

// Record - 创建对象类型
type UserRole = 'admin' | 'user' | 'guest';
type RolePermissions = Record<UserRole, string[]>;

// Extract - 提取联合类型的部分
type StringOrNumber = string | number;
type OnlyString = Extract<StringOrNumber, string>;

// Exclude - 排除联合类型的部分
type OnlyNumber = Exclude<StringOrNumber, string>;
```

## 泛型约束 (Generic Constraints)

限制泛型类型参数的范围：

```typescript
interface Lengthwise {
  length: number;
}

function logLength<T extends Lengthwise>(arg: T): T {
  console.log(arg.length);
  return arg;
}

// keyof 操作符
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}
```

## 实用示例

### 1. 深度只读

```typescript
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object 
    ? DeepReadonly<T[P]> 
    : T[P];
};

interface Config {
  api: {
    endpoint: string;
    timeout: number;
  };
}

type ReadonlyConfig = DeepReadonly<Config>;
```

### 2. 函数重载

```typescript
function greet(name: string): string;
function greet(name: string, age: number): string;
function greet(name: string, age?: number): string {
  if (age !== undefined) {
    return `Hello ${name}, you are ${age} years old`;
  }
  return `Hello ${name}`;
}
```

### 3. 联合类型去重

```typescript
type UnionToIntersection<U> =
  (U extends any ? (k: U) => void : never) extends (k: infer I) => void
    ? I
    : never;
```

## 总结

TypeScript 的高级类型系统虽然复杂，但掌握这些技巧可以让我们编写出更安全、更灵活的代码。持续学习和实践，你会逐渐感受到类型系统的强大。
