import React, { useState, useContext } from "react";
import { Card, CardHeader, CardBody, Input, Button, Typography } from "@material-tailwind/react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, fireDb } from "../../../firebase/FirebaseConfig";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import myContext from "../../../context/data/myContext";

export default function AdminRegister() {
    const context = useContext(myContext);
    const { mode } = context;

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const navigate = useNavigate();

    const register = async () => {
        if (!email || !password || !name) {
            return toast.error("All fields are required!");
        }

        try {
            // Create user in Firebase Auth
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Store user details in Firestore
            await setDoc(doc(fireDb, "users", user.uid), {
                name,
                email,
                role: "admin", // Mark this user as an admin
                userId: user.uid, // Save the uid as userId for consistency
            });

            toast.success("Admin registered successfully!");
            navigate("/adminlogin");
        } catch (error) {
            console.error("Error during registration:", error);
            toast.error("Registration failed!");
        }
    };

    return (
        <div className="flex justify-center items-center h-screen">
            <Card
                className="w-full max-w-[24rem]"
                style={{
                    background: mode === "dark" ? "rgb(30, 41, 59)" : "rgb(226, 232, 240)",
                }}
            >
                <CardHeader
                    color="blue"
                    floated={false}
                    shadow={false}
                    className="m-0 grid place-items-center rounded-b-none py-8 px-4 text-center"
                    style={{
                        background: mode === "dark" ? "rgb(226, 232, 240)" : "rgb(30, 41, 59)",
                    }}
                >
                    <Typography
                        variant="h4"
                        style={{
                            color: mode === "dark" ? "rgb(30, 41, 59)" : "rgb(226, 232, 240)",
                        }}
                    >
                        Admin Register
                    </Typography>
                </CardHeader>

                <CardBody>
                    <form className="flex flex-col gap-4">
                        <Input
                            type="text"
                            label="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <Input
                            type="email"
                            label="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <Input
                            type="password"
                            label="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <Button
                            onClick={register}
                            style={{
                                background: mode === "dark" ? "rgb(226, 232, 240)" : "rgb(30, 41, 59)",
                                color: mode === "dark" ? "rgb(30, 41, 59)" : "rgb(226, 232, 240)",
                            }}
                        >
                            Register
                        </Button>
                    </form>
                </CardBody>
            </Card>
        </div>
    );
}
