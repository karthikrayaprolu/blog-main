import React, { useContext, useState } from "react";
import {
    Card,
    CardHeader,
    CardBody,
    Input,
    Button,
    Typography,
} from "@material-tailwind/react";
import myContext from "../../../context/data/myContext";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../firebase/FirebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { fireDb } from "../../../firebase/FirebaseConfig";
import { getBlogsForUser } from "../../../utils/BlogService";

export default function AdminLogin() {
    const context = useContext(myContext);
    const { mode } = context;

    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false); // Add loading state to prevent multiple clicks

    //* Login Function
    const login = async () => {
        if (!email || !password) {
            return toast.error("Please fill all required fields");
        }

        setLoading(true); // Start loading

        try {
            // Sign in user with Firebase Authentication
            const result = await signInWithEmailAndPassword(auth, email, password);

            // Fetch user data from Firestore
            const userDoc = await getDoc(doc(fireDb, "users", result.user.uid));

            if (userDoc.exists()) {
                const userData = userDoc.data();

                // Store the user data in localStorage
                localStorage.setItem("user", JSON.stringify(userData));

                // Fetch blogs for the logged-in user
                const userBlogs = await getBlogsForUser(result.user.uid);
                localStorage.setItem("userBlogs", JSON.stringify(userBlogs));

                toast.success("Login Successful");

                // Navigate to the user's personalized dashboard
                navigate(`/dashboard/${result.user.uid}`);
            } else {
                toast.error("User data not found in Firestore");
            }
        } catch (error) {
            toast.error("Login Failed: Incorrect email or password");
            console.log(error);
        } finally {
            setLoading(false); // Stop loading
        }
    };

    //* Navigate to Register Page
    const handleRegister = () => {
        navigate("/admin-register");
    };

    return (
        <div className="flex justify-center items-center h-screen">
            {/* Card  */}
            <Card
                className="w-full max-w-[24rem]"
                style={{
                    background: mode === "dark" ? "rgb(30, 41, 59)" : "rgb(226, 232, 240)",
                }}
            >
                {/* CardHeader */}
                <CardHeader
                    color="blue"
                    floated={false}
                    shadow={false}
                    className="m-0 grid place-items-center rounded-b-none py-8 px-4 text-center"
                    style={{
                        background: mode === "dark" ? "rgb(226, 232, 240)" : "rgb(30, 41, 59)",
                    }}
                >
                    <div className="mb-4 rounded-full border border-white/10 bg-white/10 p-2 text-white">
                        <div className="flex justify-center">
                            {/* Image */}
                            <img
                                src="https://cdn-icons-png.flaticon.com/128/727/727399.png"
                                className="h-20 w-20"
                                alt="Admin Icon"
                            />
                        </div>
                    </div>

                    {/* Top Heading */}
                    <Typography
                        variant="h4"
                        style={{
                            color: mode === "dark" ? "rgb(30, 41, 59)" : "rgb(226, 232, 240)",
                        }}
                    >
                        Admin Login
                    </Typography>
                </CardHeader>

                {/* CardBody */}
                <CardBody>
                    <form className="flex flex-col gap-4">
                        {/* Email Input */}
                        <div>
                            <Input
                                type="email"
                                label="Email"
                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        {/* Password Input */}
                        <div>
                            <Input
                                type="password"
                                label="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        {/* Login Button */}
                        <Button
                            onClick={login}
                            disabled={loading} // Disable button during loading
                            style={{
                                background: mode === "dark" ? "rgb(226, 232, 240)" : "rgb(30, 41, 59)",
                                color: mode === "dark" ? "rgb(30, 41, 59)" : "rgb(226, 232, 240)",
                            }}
                        >
                            {loading ? "Logging in..." : "Login"} {/* Show loading text */}
                        </Button>
                    </form>

                    {/* Register Button */}
                    <div className="mt-4 text-center">
                        <Typography
                            style={{
                                color: mode === "dark" ? "rgb(226, 232, 240)" : "rgb(30, 41, 59)",
                            }}
                        >
                            Don't have an account?{" "}
                            <span
                                onClick={handleRegister}
                                className="cursor-pointer font-bold underline"
                                style={{
                                    color: mode === "dark" ? "rgb(56, 178, 172)" : "rgb(59, 130, 246)",
                                }}
                            >
                                Register here
                            </span>
                        </Typography>
                    </div>
                </CardBody>
            </Card>
        </div>
    );
}
