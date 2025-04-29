import * as crypto from "crypto";

import {
    Service
} from "@cmmv/core";

import {
    Repository, In
} from "@cmmv/repository";

@Service('blog_user')
export class UserBlogService {
    /**
     * Get all users
     * @param queries - Queries
     * @returns - Users
     */
    async getAll(queries?: any) {
        const UserEntity = Repository.getEntity("UserEntity");

        const users = await Repository.findAll(UserEntity, queries, [], {
            select: [
                'id', 'username', 'email', 'password', 'root', 'validated'
            ]
        });

        return users;
    }

    /**
     * Create an user
     * @param data - User data
     * @returns - User
     */
    async createUser(data: any) {
        const ProfilesEntity = Repository.getEntity("ProfilesEntity");
        const UserEntity = Repository.getEntity("UserEntity");

        const user = await Repository.findOne(UserEntity, { email: data.email });

        if(user)
            throw new Error("User already exists");

        const usernameHashed = crypto
            .createHash('sha1')
            .update(data.email)
            .digest('hex');

        const passwordHashed = crypto
            .createHash('sha256')
            .update(data.password)
            .digest('hex');

        const userData = {
            username: usernameHashed,
            email: data.email,
            password: passwordHashed,
            root: true,
            validated: true
        };

        const newUser = await Repository.insert(UserEntity, userData);

        if(!newUser)
            throw new Error("User not created");

        const authorData = {
            user: newUser.data.id,
            name: data.name
        };

        const author = await Repository.insert(ProfilesEntity, authorData);

        return author;
    }

    /**
     * Update an user
     * @param id - User id
     * @param data - User data
     * @returns - User
     */
    async updateUser(id: string, data: any) {
        const UserEntity = Repository.getEntity("UserEntity");
        const user = await Repository.update(UserEntity, id, data);
        return user;
    }
}

