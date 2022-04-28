import * as env from 'env-var';
import './dotenv';

const config = {
    service: {
        port: env.get('PORT').required().asPortNumber(),
        useCors: env.get('USE_CORS').default('false').asBool(),
        fsServiceUrl: env.get('FILE_SERVICE_URL').required(),
        transferService: env.get('TRANSFER_SERVICE').required(),
    },
    transfers: {
        host: env.get('TRANSFERS_HOST').default('transfer-service').required(),
        port: env.get('TRANSFERS_PORT').default('8000').required(),
        idRegex: env.get('ID_REGEX').default('^[a-zA-Z0-9-_.!@#$%^&*()[\\]{}<>"\':\\\\\\/\t ]{1,100}$').asRegExp(),
        fileNameRegex: env
            .get('FILE_NAME_REGEX')
            .default('^[a-zA-Z0-9-_.!@#$%^&*()[\\]{}<>"\':\\\\\\/\t ]{1,100}$')
            .asRegExp(),
    },
    quotas: {
        defaultLimitInBytes: env.get('QUOTA_DEFAULT_LIMIT_IN_BYTES').default('10737418240').asInt(),
        maxLimitAllowedInBytes: env.get('QUOTA_MAX_LIMIT_ALLOWED_IN_BYTES').default('107374182400').asInt(),
        minLimitAllowedInBytes: env.get('QUOTA_MIN_LIMIT_ALLOWED_IN_BYTES').default('0').asInt(),
    },
    placeholder: {
        host: 'placeholder',
        port: 8000,
    },
};

export default config;
