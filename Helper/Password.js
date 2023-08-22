import bcrypt from 'bcrypt';

const hashedPassword = async(password)=>{
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password,salt);
    return hashedPassword;
}
export {hashedPassword};

const comparePassword = async(password,hashedPassword)=>{
    const result = await bcrypt.compare(password,hashedPassword);
    return result;
}
export {comparePassword};