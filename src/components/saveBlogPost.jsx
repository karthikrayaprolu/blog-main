import { fireDb, auth } from './firebase'; // Import Firebase configuration
import { collection, addDoc } from "firebase/firestore";

// Function to save a blog post with userId
const saveBlogPost = async (blogData) => {
    try {
        // Get the current user from Firebase Authentication
        const user = auth.currentUser;

        // If no user is logged in, alert the user or return an error
        if (!user) {
            alert("You need to be logged in to create a blog!");
            return;
        }

        // Add userId to the blog data
        const blogWithUserId = {
            ...blogData,
            userId: user.uid,  // Add userId from Firebase Auth
        };

        // Save the blog post to Firestore
        await addDoc(collection(fireDb, "blogPost"), blogWithUserId);

        console.log("Blog post created successfully!");
    } catch (error) {
        console.error("Error creating blog post:", error);
    }
};

export default saveBlogPost;
