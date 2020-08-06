import { User } from '../entity/User';

export const userListAsync = async () => {
    return await User.find();
}

export const findUserByIdAsync = async (id: number): Promise<User | undefined> => {
    return await User.findOne({ id: id});
}

export const findUserByEmailAsync = async (email: string): Promise<User | undefined> => {
    return await User.findOne({ where: { email }});
}

export const addUserAsync = async (email : string, hashedPassword: string): Promise<Boolean> => {
    try {
        await User.insert({
            email,
            password: hashedPassword
        });    
    } catch (error) {
        console.log(error);
        return false;
    }

    return true;
}