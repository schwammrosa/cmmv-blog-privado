import { getAuth } from "firebase-admin/auth";
import * as admin from "firebase-admin";

import {
    Service, Config,
    Application
} from '@cmmv/core';

import {
    Repository
} from "@cmmv/repository";

import {
    AuthAutorizationService
} from "@cmmv/auth";

interface FirebaseLoginResult {
    token: string;
    provider: string;
    user: FirebaseProviderProfile;
}

interface FirebaseProviderProfile {
    accessToken?: string;
    displayName?: string;
    email?: string;
    photoURL?: string;
    providerId?: string;
    uid?: string;
}

const firebaseProjectId = Config.get('blog.firebaseProjectId', "");
const firebaseClientEmail = Config.get('blog.firebaseClientEmail', "");
const firebasePrivateKey = Config.get('blog.firebasePrivateKey', "");

admin.initializeApp({
    credential: admin.credential.cert({
        projectId: firebaseProjectId,
        clientEmail: firebaseClientEmail,
        privateKey: firebasePrivateKey.replace(/\\n/g, '\n'),
    }),
});

@Service("accounts")
export class AccountsService {
    /**
     * Login with Firebase
     * @param payload
     * @returns
     */
    async firebaseLogin(payload: FirebaseLoginResult, req: any, res: any){
        const UserEntity = Repository.getEntity("UserEntity");
        const { token } = payload;

        const decodedToken = await getAuth().verifyIdToken(token);

        if(decodedToken){
            let account = await Repository.findOne(UserEntity, {
                email: decodedToken.email
            });

            const authAutorizationService = Application.resolveProvider(AuthAutorizationService);
            const result = await authAutorizationService.autorizeUser(account, req, res, null);

            if(result)
                return result.token;
        }

        return { success: false, message: "Invalid token" };
    }
}