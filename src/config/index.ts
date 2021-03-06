import * as env from 'env-var';
import './dotenv';

const config = {
    service: {
        port: env.get('PORT').required().asPortNumber(),
        useCors: env.get('USE_CORS').default('false').asBool(),
        kartoffelUrl: env.get('KARTOFFEL_URL').asString(),
        linkSecret: env.get('LINK_SECRET').required().asString(),
        spikeClientsApiScope: env.get('SPIKE_CLIENTS_API_SCOPE').required().asString(),
    },
    fsCrud: {
        url: env.get('FS_CRUD_URL').asString(),
        timeout: env.get('FS_CRUD_TIMEOUT').default('10000').asInt(),
        maxContentLength: env.get('FS_CRUD_MAX_CONTENT_LENGTH').default('1000000000000').asInt(),
        maxBodyLength: env.get('FS_CRUD_MAX_CONTENT_LENGTH').default('1000000000000').asInt(),
    },
    storageService: {
        url: env.get('STORAGE_SERVICE_URL').asString(),
        timeout: env.get('STORAGE_SERVICE_TIMEOUT').default('10000').asInt(),
        maxContentLength: env.get('FS_CRUD_MAX_CONTENT_LENGTH').default('1000000000').asInt(),
        maxBodyLength: env.get('FS_CRUD_MAX_CONTENT_LENGTH').default('1000000000').asInt(),
    },
    validations: {
        userIdRegex: env.get('USER_ID_REGEX').default('^[a-zA-Z0-9s._@-]{1,100}$').asRegExp(),
        maxFileSizeInBytes: env.get('FS_MAX_FILE_SIZE_IN_BYTES').default('107374182400').asInt(),
        minFileSizeInBytes: env.get('FS_MIN_FILE_SIZE_IN_BYTES').default('0').asInt(),
        fsObjectNameRegex: env
            .get('FS_OBJECT_NAME_REGEX')
            .default(
                "^(?!.{256,})(?!(aux|clock\\$|con|nul|prn|com[1-9]|lpt[1-9])(?:$|\\.))[^ ][ \\.א-ת\\w-$()+=[\\];#@~,&amp;']+[^\\. ]$",
            )
            .asRegExp(),
        fileBucketRegex: env.get('FS_FILE_BUCKET_REGEX').default('^[a-zA-Z0-9s._@-]{1,100}$').asRegExp(),
    },
    constants: {
        fsObjectTypes: ['file', 'folder', 'shortcut'] as const,
        permissions: ['read', 'write', 'owner'] as const,
        permissionPriority: {
            read: 0,
            write: 1,
            owner: 2,
        } as const,
        statesSortFields: ['stateCreatedAt', 'stateUpdatedAt'] as const,
        fsObjectsSortFields: ['size', 'public', 'name', 'type', 'fsObjectCreatedAt', 'fsObjectUpdatedAt'] as const,
        sortOrders: ['asc', 'desc'] as const,
    },
    spike: {
        enabled: env.get('SPIKE_ENABLED').required().asBool(),
        audience: env.get('SPIKE_AUDIENCE').required().asString(),
        publicKey: {
            path: env.get('SPIKE_PUBLIC_KEY_PATH').default('./certificate/publicKey.pem').asString(),
            downloadUri: env.get('SPIKE_PUBLIC_KEY_DOWNLOAD_URI').required().asUrlString(),
            renewalIntervalMs: env.get('SPIKE_PUBLIC_KEY_RENEWAL_INTERVAL_MS').default('0').asInt(),
        },
    },
    shraga: {
        enabled: env.get('SHRAGA_ENABLED').required().asBool(),
        url: env.get('SHRAGA_URL').required().asString(),
        secret: env.get('SHRAGA_SECRET').default('secret').asString(),
        callbackUrl: env.get('SHRAGA_CALLBACK_URL').required().asString(),
    },
};

export default config;
