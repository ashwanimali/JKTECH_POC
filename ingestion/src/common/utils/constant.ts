export enum IngestionStatusEnum {
    ACTIVE = 'ACTIVE',
    SUCCESS = 'SUCCESS',
    FAILED = 'FAILED',
}

export const sleep = async (ms: number) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
}