//@ts-ignore
import { useApi } from '@cmmv/blog/admin/api';

export const useAccessControlClient = () => {
    const api = useApi();

    const users = {
        get: () => api.authRootRequest('user-blog', 'GET'),
        getById: (id: string) => api.authRootRequest(`user-blog/${id}`, 'GET'),
        create: (data: any) => api.authRootRequest('user-blog', 'POST', data),
        update: (id: string, data: any) => api.authRootRequest(`user-blog/${id}`, 'PUT', data),
        delete: (id: string) => api.authRootRequest(`user-blog/${id}`, 'DELETE'),
        block: (id: string) => api.authRootRequest(`user-block/${id}`, 'PUT'),
        unblock: (id: string) => api.authRootRequest(`user-unblock/${id}`, 'PUT'),
        assignGroups: (id: string, data: any) => api.authRootRequest(`user-assign-to-groups/${id}`, 'PUT', data),
        removeGroups: (id: string, data: any) => api.authRootRequest(`user-remove-groups/${id}`, 'DELETE', data),
    };

    const groups = {
        get: () => api.authRootRequest('groups', 'GET'),
        getById: (id: string) => api.authRootRequest(`groups/${id}`, 'GET'),
        create: (data: any) => api.authRootRequest('groups', 'POST', data),
        update: (id: string, data: any) => api.authRootRequest(`groups/${id}`, 'PUT', data),
        delete: (id: string) => api.authRootRequest(`groups/${id}`, 'DELETE'),
        assignRoles: (id: string, data: any) => api.authRootRequest(`auth/group-assign-roles/${id}`, 'PUT', data),
        removeRoles: (id: string, data: any) => api.authRootRequest(`auth/group-remove-roles/${id}`, 'DELETE', data),
    };

    const roles = {
        get: () => api.authRootRequest('auth/roles', 'GET'),
        getById: (id: string) => api.authRootRequest(`auth/roles/${id}`, 'GET'),
        create: (data: any) => api.authRootRequest('auth/roles', 'POST', data),
        update: (id: string, data: any) => api.authRootRequest(`auth/roles/${id}`, 'PUT', data),
        delete: (id: string) => api.authRootRequest(`auth/roles/${id}`, 'DELETE'),
    };

    return {
        users,
        groups,
        roles
    };
};
