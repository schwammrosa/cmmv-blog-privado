
export interface ISettings {
    group: string;
    key: string;
    value: string;
    type: string;
    flags: string[];
}

export interface ISetup {
    admin: {
        email: string;
        password: string;
    },
    blog: {
        title: string;
        description: string;
        url: string;
        adminUrl: string;
    },
    settings: {
        postsPerPage: number;
        enableComments: boolean;
        moderateComments: boolean;
        language: string;
        timezone: string;
        allowedHosts: string[];
        apiUrl: string;
        frontendApiUrl: string;
        websiteUrl: string;
        basePort: number;
    }
}
