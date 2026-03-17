import User from "../model/User.model.js";
import bcrypt from 'bcrypt'

export const createUser = async (req, res) => {
    const { name, email, password, role } = req.body;
    
    if (!name || !email || !password || !role) {
        return res.status(400).json({ message: "All fields are required" });
    }
    if (await User.findOne({ email })) {
        return res.status(400).json({ message: "User already exists" })
    }
    // Hash password with bcrypt
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    // Create new user with hashed password
    const user = await User.create({ name, email, password: hashedPassword, role });
    res.status(201).json({
        success: true,
        message: "User created successfully",
        data: user
    });
};  



export const login = async(req, res) => {
    const {email, password} = req.body
    try {
        const user = await User.findOne({email});
        if (!email || !password){
            res.status(400).json({message: 'Email and Password is required'})
        }
        if (!user){
            res.status(400).json({message: 'Incorrect email or password'})
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch){
            res.status(400).json({message: 'Incorrect email or password'})
        }
        else{
            res.status(200).json({message: "Login successful", status: 'success', data: user})
        }
      
    } catch (error) {
        res.status(500).json({message: 'Something went wrong'})
    }
}