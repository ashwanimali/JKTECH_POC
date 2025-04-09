import * as bcrypt from 'bcrypt';

export class HashUtil {
    static async hashPassword(password: string): Promise<string> {
        try {
            const saltRounds = 10;
            const salt = await bcrypt.genSalt(saltRounds);
            const hash = await bcrypt.hash(password, salt);
            return hash
        } catch (error) {
            throw error
        }

    }

    static async comparePasswords(
        plainPassword: string,
        hashedPassword: string,
    ): Promise<boolean> {
        try {
            return bcrypt.compare(plainPassword, hashedPassword);

        } catch (error) {
            throw error
        }
    }
}
