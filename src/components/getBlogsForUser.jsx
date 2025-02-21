import { fireDb, auth } from './firebase';
import { collection, query, where, getDocs } from "firebase/firestore";

const getBlogsForUser = async () => {
    try {
        const user = auth.currentUser;

        if (!user) {
            console.error("No user is logged in!");
            return [];
        }

        console.log("User UID: ", user.uid);  // Log user UID for debugging

        // Query to fetch blogs for the logged-in user
        const blogRef = collection(fireDb, "blogPosts");
        const q = query(blogRef, where("userId", "==", user.uid));

        // Execute the query
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            console.log("No blogs found for this user.");
            return [];
        }

        // Map through the documents to extract blog data
        const blogs = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        console.log("Fetched blogs: ", blogs);
        return blogs;
    } catch (error) {
        console.error("Error fetching blogs:", error);
        return [];
    }
};

export default getBlogsForUser;
