import { useState, useEffect } from "react";
import { supabase } from "./utils/supabase";
import Player from "./utils/player";

export default function Account({ session }) {
    const [loading, setLoading] = useState(true);
    const [tag, setTag] = useState(null);
    // const [website, setWebsite] = useState(null);
    // const [avatar_url, setAvatarUrl] = useState(null);


    useEffect(() => {
        let ignore = false;
        async function getProfile() {
            setLoading(true);

            const { user } = session;

            const { data, error } = await supabase
            .from('Player')
            .select('tag')
            .eq('internal_id', user.internal_id)
            .single()

            if (!ignore) {
                if (error) {
                    console.warn(error);

                } else if (data) {
                    setTag(data.tag);
                    
                }
            }
            setLoading(false);

        }

        getProfile();

        return () => {
            ignore = true;

        }
    }, [session]);

    async function updateProfile(event) {
        event.preventDefault();

        setLoading(true);
        const { user } = session;
        const playerEmail = user.player_email || '';

        const updates = {
            id: user.internal_id,
            tag,
            gamesPlayed: user.gamesPlayed, 
            updated_at: new Date(),
            player_email: playerEmail, 

        }

        const { error } = await supabase.from("Player").upsert(updates);

        if (error) {
            alert(error.message);

        } else {
            setTag(tag)

        }
        setLoading(false);

    }

    return (
        <form onSubmit={updateProfile} className="form-widget">
            <div>
                <label htmlFor="email"> Email </label>
                <input id="email" type="text" value={session.user.player_email} disabled />
            </div>
            <div>
                <label htmlFor="tag"> Tag </label>
                <input
                    id="tag"
                    type="text"
                    required
                    value={ tag || '' }
                    onChange={(e) => setTag(e.target.value)}

                />
                
            </div>      
            <div>
                <button className="button block primary" type="submit" disabled={loading}>
                    {loading ? 'Loading ...' : 'Update'}
                </button>
            </div>
            <div>
                <button className="button block" type="button" onClick={() => supabase.auth.signOut()}>
                    Sign Out
                </button>
            </div>
        </form>
    )
}