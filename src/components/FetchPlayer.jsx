import React, { useState, useEffect } from "react";
import { getPlayerTag } from "../utilities/getPlayerTag";
import { UserAuth } from "../context/AuthContext";

const FetchPlayerTag = () => {
    const { session } = UserAuth();
    const [playerTag, setPlayerTag] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        const fetchTag = async () => {
            if(!session) {
                setError("No session found");
                setLoading(false);
                return;
            }

            try {
                const tag = await getPlayerTag(session);
                setPlayerTag(tag);
            } catch (err) {
                setError("Failed to fetch tag");
            } finally {
                setLoading(false);
            }
        };

        fetchTag();
    }, [session]);

    if (loading) return <h2>Loading...</h2>;
    if (error) return <h2 className="text-red-500">{error}</h2>;

    return <h2>Welcome, {playerTag || session?.user?.email}</h2>;
}

export default FetchPlayerTag;