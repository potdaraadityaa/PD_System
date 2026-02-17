import { z } from 'zod';

export const loginSchema = z.object({
    username: z.string().min(3),
    password: z.string().min(6),
});

export const createUserSchema = z.object({
    username: z.string().min(3).regex(/^[a-z0-9_]+$/, 'Username must be lowercase alphanumeric'),
    role: z.enum(['admin', 'editor', 'viewer', 'guest']),
});

export const createPolicySchema = z.object({
    name: z.string().min(3),
    description: z.string().optional(),
    effect: z.enum(['ALLOW', 'DENY']),
    action_pattern: z.string().min(1),
    resource_pattern: z.string().min(1),
});
