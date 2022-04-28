import * as env from 'env-var';
import './dotenv';

const config = {
    service: {
        port: env.get('PORT').required().asPortNumber(),
        useCors: env.get('USE_CORS').default('false').asBool(),
        fsServiceUrl: env.get('FILE_SERVICE_URL').required().asString(),
        transfersUrl: env.get('TRANSFER_SERVICE_URL').required().asString(),
    },
    transfers: {
        idRegex: env.get('ID_REGEX').default('^[a-zA-Z0-9-_.!@#$%^&*()[\\]{}<>"\':\\\\\\/\t ]{1,100}$').asRegExp(),
        fileNameRegex: env
            .get('FILE_NAME_REGEX')
            .default('^[a-zA-Z0-9-_.!@#$%^&*()[\\]{}<>"\':\\\\\\/\t ]{1,100}$')
            .asRegExp(),
    },
    fs: {
        maxHierarchySearchDepth: env.get('FS_MAX_HIERARCHY_SEARCH_DEPTH').default('5').asInt(),
        maxFileSizeInBytes: env.get('FS_MAX_FILE_SIZE_IN_BYTES').default('107374182400').asInt(),
        minFileSizeInBytes: env.get('FS_MIN_FILE_SIZE_IN_BYTES').default('1').asInt(),
        nameRegex: env.get('FS_OBJECT_NAME_REGEX').default('^[a-zA-Z0-9s._-]{1,100}$').asRegExp(),
        fileKeyRegex: env.get('FS_FILE_KEY_REGEX').default('^[a-zA-Z0-9s._-]{1,100}$').asRegExp(),
        fileBucketRegex: env.get('FS_FILE_BUCKET_REGEX').default('^[a-zA-Z0-9s._-]{1,100}$').asRegExp(),
    },
    quotas: {
        defaultLimitInBytes: env.get('QUOTA_DEFAULT_LIMIT_IN_BYTES').default('10737418240').asInt(),
        maxLimitAllowedInBytes: env.get('QUOTA_MAX_LIMIT_ALLOWED_IN_BYTES').default('107374182400').asInt(),
        minLimitAllowedInBytes: env.get('QUOTA_MIN_LIMIT_ALLOWED_IN_BYTES').default('0').asInt(),
    },
    // api/config placeholder
    placeholder: {
        host: 'placeholder',
        port: 8000,
    },
    constants: {
        fsObjectTypes: ['file', 'folder', 'shortcut'] as const,
        apps: ['dropbox', 'drive', 'falcon'] as const,
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
};

export default config;
