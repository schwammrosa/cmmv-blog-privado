import * as url from 'url';

import {
    Service, Hook, HooksType,
    Config, Resolver
} from "@cmmv/core";

import {
    Repository, In
} from "@cmmv/repository";

interface WhitelabelPayload {
    id: string;
    name: string;
    apiUrl: string;
    faviconUrl: string;
    domain: string;
    root: boolean;
}

@Service('whitelabel')
export class WhitelabelService {

    constructor(){}

    @Hook(HooksType.onInitialize)
    async beforeFind() {
        const WhitelabelEntity = Repository.getEntity('WhitelabelEntity');
        const whitelabelRoot = await Repository.findOne(WhitelabelEntity, {
            root: true
        });

        if(!whitelabelRoot){
            const title = Config.get('blog.title');
            const favicon = Config.get('blog.favicon');
            const domain = Config.get('blog.url');

            if(domain){
                const parsedDomain = url.parse(domain);

                Repository.insert(WhitelabelEntity, {
                    root: true,
                    name: title,
                    apiUrl: (parsedDomain.hostname === 'localhost') ? `http://localhost:${parseInt(parsedDomain.port as string)-1}` : `${parsedDomain.hostname}/api`,
                    faviconUrl: `${parsedDomain.protocol}//${(parsedDomain.hostname === 'localhost') ? `localhost:${parsedDomain.port}` : parsedDomain.hostname}/favicon.ico`,
                    domain: (parsedDomain.hostname === 'localhost') ? `localhost:${parsedDomain.port}` : parsedDomain.hostname
                });
            }
        }
    }

    /**
     * Get all whitelabels
     * @param queries
     * @returns
     */
    async getWhitelabel(queries: any) {
        const WhitelabelEntity = Repository.getEntity('WhitelabelEntity');
        const whitelabelRoot = await Repository.findAll(WhitelabelEntity, queries);
        return whitelabelRoot;
    }

    /**
     * Get all whitelabels for admin
     * @returns
     */
    async getWhitelabelAdmin(){
        const WhitelabelEntity = Repository.getEntity('WhitelabelEntity');
        const whitelabelRoot = await Repository.findAll(WhitelabelEntity, {
            limit: 1000
        }, [], {
            select: ['id', 'apiUrl']
        });
        return whitelabelRoot;
    }

    /**
     * Get whitelabel access by user
     * @param user
     * @returns
     */
    async getWhitelabelAccessByUser(user: any) {
        const WhitelabelEntity = Repository.getEntity('WhitelabelEntity');

        if(user.root){
            const whitelabels = await Repository.findAll(WhitelabelEntity, {});
            return whitelabels;
        }
        else {
            const WhitelabelAccessEntity = Repository.getEntity('WhitelabelAccessEntity');
            const whitelabelAccess = await Repository.findAll(WhitelabelAccessEntity, { user: user.id });
            const whitelabelIds = whitelabelAccess?.data?.map((access: any) => access.whitelabel);
            const whitelabelsByUser = await Repository.findAll(WhitelabelEntity, {
                id: In(whitelabelIds)
            });

            return (whitelabelsByUser) ? whitelabelsByUser : { data: [], count: 0 };
        }
    }

    /**
     * Insert a whitelabel
     * @param whitelabel
     * @returns
     */
    async insetWhitelabel(whitelabel: WhitelabelPayload) {
        const WhitelabelEntity = Repository.getEntity('WhitelabelEntity');
        return Repository.insert(WhitelabelEntity, whitelabel);
    }

    /**
     * Update a whitelabel
     * @param id
     * @param whitelabel
     * @returns
     */
    async updateWhitelabel(id: string, whitelabel: WhitelabelPayload) {
        const WhitelabelEntity = Repository.getEntity('WhitelabelEntity');
        return await Repository.updateOne(WhitelabelEntity, Repository.queryBuilder({ id: id }), whitelabel);
    }

    //Resolvers
    @Resolver('whitelabel-whitelabel')
    public static async resolveWhitelabel(payload: any) {
        const WhitelabelEntity = Repository.getEntity('WhitelabelEntity');
        const whitelabel = await Repository.findOne(WhitelabelEntity, Repository.queryBuilder({ id: payload.whitelabel }));
        return { ...payload, whitelabel: whitelabel };
    }

    @Resolver('whitelabel-user')
    public static async resolveUser(payload: any) {
        const UserEntity = Repository.getEntity('UserEntity');
        const ProfilesEntity = Repository.getEntity('ProfilesEntity');
        const user = await Repository.findOne(UserEntity, Repository.queryBuilder({ id: payload.user }));
        const profile = await Repository.findOne(ProfilesEntity, Repository.queryBuilder({ user: payload.user }));
        return { ...payload, user: { ...user, profile: profile } };
    }
}
