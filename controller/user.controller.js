import User from "../model/User.model.js";

export const createUser = async (req, res) => {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !role) {
        return res.status(400).json({ message: "All fields are required" });
    }
    if (await User.findOne({ email })) {
        return res.status(400).json({ message: "User already exists" })
    }
    const user = await User.create({ name, email, password, role });
    res.status(201).json({
        success: true,
        message: "User created successfully",
        data: user
    });
};  


export const getAllUsers = async (req, res) => {
    try{
        const users = await User.find();
        res.status(200).json({
            success: true,
            message: "Users fetched successfully",
            data: users
        });
    }
    catch(error){
        res.status(500).json({ message: error.message });
    }
};


export const getUser = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ message: "User ID is required" });
    }
    try{
        const user = await User.findById(id);
        res.status(200).json({
            success: true,
            message: "User fetched successfully",
            data: user
        });
    }
    catch(error){
        res.status(500).json({ message: error.message });
    }
   
};