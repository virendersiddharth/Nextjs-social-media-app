import {z} from 'zod';

const requiredString = z.string().trim().min(1, "Required");

export const signUpSchema = z.object({
    email : requiredString.email("Invalid email address"),
    username : requiredString.regex(
        // /^[a-zA-Z0-9_-]$/,
        /([A-Za-z0-9\-\_]+)$/,
        "Username must contain only alphanumeric characters, underscores, and dashes."
    ),
    password : requiredString.min(8, "Password must be at least 8 characters long"),
})

export type SignUpValues = z.infer<typeof signUpSchema>

export const loginSchema = z.object({
    username : requiredString,
    password : requiredString
})

export type LoginValues = z.infer<typeof loginSchema>

export const createPostSchema = z.object({
    content : requiredString,
})

export const UpdateUserProfileSchema = z.object({
    displayName : requiredString,
    bio : z.string().max(300, "Atmost 300 characters are allowed")
})

export type UpdateUserProfileValues = z.infer<typeof UpdateUserProfileSchema>