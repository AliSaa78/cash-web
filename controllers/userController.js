import {} from 'dotenv/config';
import jwt from "jsonwebtoken";
import User from '../model/userModel.js';
import bcrypt from "bcrypt";
const secretKey = process.env.SECRET_TOKEN;
const userController={
signup:async(req,res)=>{
    try{
    const {name , email , password}=req.body;
    //console.log(req.body);
    if(!name || !email || !password){
        return res.status(400).send('all fields must be filled');
    }
    const userAccess= await User.findOne({email});
    console.log(userAccess)
    if(userAccess){
        return res.status(400).send('user already registerd');
    };
   const hashedPassword = await bcrypt.hash(password,10);
   const newUser = await User.create({
    name,
    email,
    password:hashedPassword
   });
   const token = jwt.sign(
    {id:newUser._id},
    secretKey,
    {expiresIn:'8h'}
   )
   
   res.status(201).json(token);

}
catch(err){
    res.status(404).send(err);
}
},
login: async (req, res) => {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(401).json({ message: "Invalid username or password" });
            }
            
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).send('Invalid email or password');
            }
            const token = jwt.sign({ id: user._id}, secretKey, { expiresIn: '8h' });
            res.status(200).json({ token });
        } catch (err) {
            console.log(err);
            res.status(500).send('Server error');
        }
    },
me:async (req, res) => {
        try {
            const authHeader = req.headers.authorization || req.headers.Authorization;
            if (!authHeader) {
                return res.status(403).json({ message: "Token is not provided" });
            }
            const token = authHeader.split(' ')[1];
            const payload = jwt.decode(token);
            const user = await User.findById(payload.id);
            if(!user){
                return res.status(404).json({message:"user not found"});
            }
            res.status(200).json({
                id: user._id,
                username: user.name,
                email: user.email,
                balance:user.balance
            });

        } catch (error) {
            console.log(err);
            res.status(500).send('Server error');
        }
    },


};


export default userController;