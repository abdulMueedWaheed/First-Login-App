import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.js";
import supabase from "../lib/supabase_connect.js";

export const signUp = async(req, res) => {
	const { fullName, email, password } = req.body;

	try {
		if (!fullName || !email || !password) {
			return res.status(400).json({
				message: "All fields are required!"
			});
		}

		if (password.length < 8) {
			return res.status(400).json({
				message: "Password Length must be atleast 8 characters!"
			});
		}

		// Check if user already exists
		const { data: existingUser } = await supabase
			.from('users')
			.select('*')
			.eq('email', email)
			.single();

		if (existingUser) {
			return res.status(400).json({
				message: "This email is already in use!"
			});
		}

		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		// Insert new user into Supabase
		const { data: newUser, error } = await supabase
			.from('users')
			.insert([
				{
					full_name: fullName,
					email: email,
					password: hashedPassword,
					profile_pic: null
				}
			])
			.select()
			.single();

		if (error) {
			console.error("Supabase error:", error);
			return res.status(400).json({
				message: "Failed to create user"
			});
		}

		if (newUser) {
			generateToken(newUser.id, res);

			res.status(201).json({
				_id: newUser.id,
				fullName: newUser.full_name,
				email: newUser.email,
				profilePic: newUser.profile_pic
			});
		} else {
			res.status(400).json({
				message: "Invalid User Data"
			});
		}
	}
	
	catch (error) {
		console.log("Error in signup controller", error.message);
		res.status(500).json({ message: "Internal Server Error" });
	}
}

export const login = async(req, res) => {
	const {email, password} = req.body;

	try {
		// Get user from Supabase
		const { data: user, error } = await supabase
			.from('users')
			.select('*')
			.eq('email', email)
			.single();

		if (error || !user) {
			return res.status(400).json({
				message: "User Not Found!"
			});
		}

		const isPasswordCorrect = await bcrypt.compare(password, user.password);
		if (!isPasswordCorrect) {
			return res.status(400).json({
				message: "Invalid Password"
			});
		}

		generateToken(user.id, res);

		res.status(200).json({
			_id: user.id,
			fullName: user.full_name,
			email: user.email,
			profilePic: user.profile_pic
		});
	}
	
	catch (error) {
		console.log("Error in login controller", error.message);
		res.status(500).json({ message: "Internal Server Error" });
	}
}

export const logout = async (req, res) => {
	try {
		// Clear the JWT cookie
		res.cookie("jwt", "", { maxAge: 0 });
		
		// Note: If you're using Supabase Authentication in the future
		// you might want to invalidate the session on Supabase side as well
		// const { error } = await supabase.auth.signOut();
		
		res.status(200).json({ message: "Logged out successfully" });
	}
  
	catch (error) {
		console.log("Error in logout controller", error.message);
		res.status(500).json({ message: "Internal Server Error" });
	}
};