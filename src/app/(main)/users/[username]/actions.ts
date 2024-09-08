"use server"

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { getUserDetails } from "@/lib/types";
import { UpdateUserProfileSchema, UpdateUserProfileValues } from "@/lib/validation";

export default async function UpdateUserProfile(values : UpdateUserProfileValues){
    const validateValues = UpdateUserProfileSchema.parse(values);

    const {user} = await validateRequest();

    if(!user){
        throw new Error("Unauthorized");
    }

    const updatedUser = prisma.user.update({
        where: {id: user.id},
        data: validateValues,
        select : getUserDetails(user.id)
    })

    return updatedUser

}