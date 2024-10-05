
const bcrypt = require('bcrypt')
const Userdb = require('../model/schema')
const jwt = require('jsonwebtoken')

// controller for registerUser
exports.registerUser = async (req,res)=>{
    try {

        // validate request
        if(!req.body){
            res.status(406).json({ err : "You have to fill the registration form!"})
            return
        }
        let {email,password,passwordCheck,username, avatar,avatarID,account_type, ...otherFields} = req.body
        // validation
        if(!email || !password || !passwordCheck) return res.status(406).json({ err : "Not all fields have been entered!"})
        if(password.length < 8) return res.status(406).json({err: "Password must be 8 characters above!"})
        if(password !== passwordCheck) return res.status(406).json({err: "Password does not match!"})

        const user = await Userdb.findOne({email})
        if(user) return res.status(406).json({err:"Email already exist!"})
        
        // hashing password
        const hash = await bcrypt.hashSync(password, 10)

        username = username ? username : email
        account_type = account_type ? account_type : "user"

        // Determine the user creating the product. If req.user is not available, use the system user.
        let created_by;

        if (req.user) {
            const userWithFields = await Userdb.findById(req.user._id)
                        .populate('_id', '_id fullname email phone_number address') 
            created_by = userWithFields; // Assuming req.user contains the user's _id.
        } else {
            // Set created_by to the user_id of the system user.
            const systemUser = await Userdb.findOne({ username: "system_user" }) // Replace with your system user's identifier (e.g., username).
                                .populate('_id', '_id fullname email phone_number address') 
            created_by = systemUser;
        }

        // Create the current date
        const currentDate = new Date();
        var created_on = currentDate.toLocaleString();

        // using document structure
        const newUser = new Userdb({
            email,
            password:hash,
            username,
            avatar,
            avatarID,
            account_type,

            created_on,
            created_by,
            // avatar: avatar || null,
            ...otherFields, // Spread other fields
        })
        newUser
            .save(newUser)
            .then(register=>{
                res.json(register)
            })
            .catch(error=>{
                res.status(406).json({err : error.message || "Something went wrong while registration"})
            })


        //res.json({email,hash,passwordCheck,username})
    } catch (error) {
        res.status(500).json({err: error.message || "Error while registration"})
    }
}

// controller for login
exports.login = async (req,res)=>{

    try {

    // validate request
    if(!req.body){
        res.status(406).json({ err : "You have to fill email and password!"})
        return
    }
    
    // get user data
    const {email, password} = req.body

    // validation
    if(!email || !password) return res.status(406).json({ err : "Not all fields have been entered!"})
    
    const user = await Userdb.findOne({email})
    if(!user) return res.status(406).json({err:"No account with this email"})

    // compare the password
    const isMatch = await bcrypt.compare(password, user.password)
    if(!isMatch) return res.status(406).json({err:"Password is incorrect"})

    // create jwt token
    const token = jwt.sign({ id:user._id},process.env.JWT_SECRET)

    res.json({token, username: user.username, email: user.email})

    } catch (error) {
        res.status(500).json({err: error.message || "Error while login"})
    }

}

// controller for delete
exports.delete = async (req,res)=>{
    try {
        await Userdb.findByIdAndDelete(req.params.id)
        res.json({msg: "User Deleted Successfully"})
    } catch (error) {
        res.status(500).json({err:error.message || "Error while deleting user"})
    }
}

// controller for load_users
exports.users = async (req,res)=>{
    const query = req.query.new;
    try {
      const users = query
        ? await Userdb.find().sort({ _id: -1 }).limit(5)
        : await Userdb.find();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json("Find Error");
    }
}

// controller for single load_user
exports.user = async (req, res) => {
    try {
      const user = await Userdb.findById(req.params.id)
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json(error);
    }
}


// controller for updateUser
exports.updateUser = async (req,res)=>{
    try {
        const { id } = req.params;
        const { avatar, ...updatedFields } = req.body; // Exclude avatar field from updatedFields
    
        if (avatar) {
            updatedFields.avatar = avatar; // Update avatar field if it is provided in the request
        }

        // Determine the user creating the product. If req.user is not available, use the system user.
        let updated_by;

        if (req.user) {
            const userWithFields = await Userdb.findById(req.user._id)
                        .populate('_id', '_id fullname email phone_number address') 
            updated_by = userWithFields; // Assuming req.user contains the user's _id.
        } else {
            // Set updated_by to the user_id of the system user.
            const systemUser = await Userdb.findOne({ username: "system_user" }) // Replace with your system user's identifier (e.g., username).
                                .populate('_id', '_id fullname email phone_number address') 
            updated_by = systemUser;
        }

        // Create the current date
        const currentDate = new Date();
        var updated_on = currentDate.toLocaleString();

        // Add `updated_by` and `updated_on` to req.body
        updatedFields.updated_by = updated_by;
        updatedFields.updated_on = updated_on;
    
        const updatedUser = await Userdb.findByIdAndUpdate(
          id,
          updatedFields, // Pass the updatedFields object
          { new: true }
        );

        res.status(200).json(updatedUser);
      } catch (error) {
        res.status(500).json(error);
      }
}

exports.loadUserByFilter = async (req,res)=>{
    const query = req.query;
    try {
        let filter = {}
        for (const key in query) {
            if (key) {
                filter[key] = query[key]
            } 
        }
        let user;
        if (query) {
            user = await Userdb.find(filter).sort({ _id: -1 }).limit(10);
        }
            res.status(200).json(user);
        } catch (error) {
            res.status(500).json("Find Error");
        }
}


exports.googlelogin = async (req, res) => {
    try {
        // validate request
        if (!req.body) {
            res.status(406).json({ err: "You have to fill email and password!" });
            return;
        }

        // get user data
        const { email, name, picture } = req.body;

        // validation
        if (!email) return res.status(406).json({ err: "Not all fields have been entered!" });  
        const user = await Userdb.findOne({ email });

        // If user doesn't exist, register and then attempt login again
        if (!user) {
             // hashing password
            const hash = await bcrypt.hashSync("admin123", 10)

            // using document structure
            const newUser = new Userdb({
                email,
                fullname: name,
                username: email,
                password: hash,
                avatar: picture,
                isAdmin: false

            })
            newUser
                .save(newUser)
                .then(response=>{
                    const newtoken = jwt.sign({ id: response._id }, process.env.JWT_SECRET);
                    res.json({ token: newtoken, email: response.email });
                })
                .catch(error=>{
                    res.status(406).json({err : error.message || "Something went wrong while registration"})
                })
        } else {
            // create jwt token using existing user
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

            // Send the response with the token and email from existing user
            res.json({ token, email: user.email });
        }
    } catch (error) {
        res.status(500).json({ err: error.message || "Error while login" });
    }
};





