import bcrypt from 'bcrypt';

export default async function isSamePass(unHashPass: string, hashedPass: any) {
    return await bcrypt.compare(unHashPass, hashedPass).then((result: boolean) => {
        return result;
    })
}