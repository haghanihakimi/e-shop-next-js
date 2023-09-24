import bcrypt from 'bcrypt';

export default async function hashPass(unHashPass: string) {
    return await bcrypt.hash(unHashPass, 10).then((hashed: string) => {
        return hashed;
    })
}