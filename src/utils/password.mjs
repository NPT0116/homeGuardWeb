import bcrypt from 'bcryptjs';

const saltRound = 10;

export const hashedPassword = (password) => {
    const salt = bcrypt.genSaltSync(saltRound);
    const hashed = bcrypt.hashSync(password, salt);

    return hashedPassword;
};

export const comparePasswordd = (plainPassword, hashedPassword) => {
    return bcrypt.compareSync(plainPassword, hashedPassword);
};
