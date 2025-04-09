export function validateFile(file: any, maxSize: number) {
    if (file.size > maxSize) {
        throw new Error('File exceeds maximum allowed size');
    }
    return true;
}
