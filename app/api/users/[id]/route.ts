import joi from 'joi';
import { cookies } from 'next/headers';
import { apiHandler } from '_helpers/server/api';
import { usersRepo } from '_helpers/server';
import { NextRequest, NextResponse } from 'next/server';

// Define the request handler with API methods
export const GET = apiHandler({
    GET: getById,
    PUT: update,
    DELETE: _delete
});

async function getById(req: NextRequest, { params: { id } }: { params: { id: string } }) {
    // Fetch the user by ID, including subUsers
    const user = await usersRepo.getById(id);
    return NextResponse.json(user);
}

async function update(req: NextRequest, { params: { id } }: { params: { id: string } }) {
    const body = await req.json();

    // Validate the request body including the subUser schema
    const { error } = update.schema.validate(body);
    if (error) {
        return NextResponse.json({ error: error.details[0].message }, { status: 400 });
    }

    // Update the user, including handling subUsers if provided
    await usersRepo.update(id, body);
    return NextResponse.json({ message: 'User updated successfully' });
}

update.schema = joi.object({
    firstName: joi.string(),
    lastName: joi.string(),
    username: joi.string(),
    password: joi.string().min(6).allow(''),
    // SubUser validation (array of objects with unique username, firstName, and lastName)
    subUsers: joi.array().items(
        joi.object({
            username: joi.string().required(),
            firstName: joi.string().required(),
            lastName: joi.string().required(),
        })
    )
});

async function _delete(req: NextRequest, { params: { id } }: { params: { id: string } }) {
    await usersRepo.delete(id);

    // Auto logout if the user deleted themselves
    if (id === req.headers.get('userId')) {
        cookies().delete('authorization');
        return NextResponse.json({ deletedSelf: true });
    }

    return NextResponse.json({ message: 'User deleted successfully' });
}
