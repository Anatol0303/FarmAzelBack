export function encodeBase64(password:string):string{
    if (!password) throw new Error('Password must be provided');
    return Buffer.from(password).toString('base64');
}

export function decodeBase64(encodePassword:string):string{
    return Buffer.from(encodePassword, 'base64').toString('utf-8');
}