import { useRef, useState, useEffect, useContext, createContext } from "react";
import { supabase } from "../supabaseClient";
import {
  fetchAndCachePlayer,
  getCachedPlayer,
  clearCachedPlayer,
  updateCachedPlayer,
} from "../utilities/playerUtils";
import { resolvePlayer } from "../utilities/resolvePlayer";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);
  const [player, setPlayer] = useState(null);
  const [notes, setNotes] = useState([]);
  const hasFetchedPlayer = useRef(false);

  const createPlayer = async (userId) => {
    await supabase
      .from("Player")
      .insert([{ internal_id: userId }])
      .single()
      .select();
  };

  const signUpNewUser = async (email, password) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return { success: false, error };

    const userId = data.user?.id;
    if (userId) await createPlayer(userId);

    return data;
  };

  const signInUser = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) return { success: false, error: error.message };
    return data;
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setPlayer(null);
    setNotes([]);
    clearCachedPlayer();
    hasFetchedPlayer.current = false;
    return { success: true };
  };

  const setLoadingState = (state) => {
    setLoading(state);
  };

  useEffect(() => {
    console.log("AuthContextProvider mounted");
    let mounted = true;

    const initAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;

      const currentSession = data.session;
      setSession(data.session);

      console.log("Attempting to pass SetSession: ");
      if (currentSession?.user?.id && !hasFetchedPlayer.current) {
        console.log("Session found: ", currentSession);
        const cachedPlayer = getCachedPlayer();

        console.log("Cached Player: ", cachedPlayer);
        if (!cachedPlayer || cachedPlayer === null) {
          console.log("No cached player found");
        } else {
          setPlayer(cachedPlayer);
          hasFetchedPlayer.current = true;
          setLoading(false);
          console.log("Returning, found cached player: ", cachedPlayer);
          return;
        }
        
        console.log("Somehow got past the cached player check: ", currentSession.user.id);
        let resolved = await resolvePlayer(currentSession.user.id, { debounce: true });

        if (!resolved) {
          await createPlayer(currentSession.user.id);
          resolved = await resolvePlayer(currentSession.user.id, { debounce: true });
        } 

        console.log("Resolve: ", resolved);
        if (resolved && typeof resolved.then !== "function") {
          setPlayer(resolved);
          updateCachedPlayer(resolved);
        } else {
          console.error("Failed to resolve player data, ", typeof(resolved));
          setPlayer(null);
          clearCachedPlayer();
        }
        
        hasFetchedPlayer.current = true;
      }

      setLoading(false);
    };

    initAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, newSession) => {
        if (!mounted) return;

        setSession(newSession);

        if (newSession?.user?.id) {
          const resolved = await resolvePlayer(newSession.user.id);
          if (resolved?.data) {
            setPlayer(resolved);
            updateCachedPlayer(resolved);
          }
        } else {
          setPlayer(null);
          clearCachedPlayer();
        }
        hasFetchedPlayer.current = true;
        setLoading(false);
      }
    );

    return () => {
      mounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!session?.user?.id) return;

    const playerSub = supabase
      .channel("realtime-player")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "Player",
          filter: `internal_id=eq.${session.user.id}`,
        },
        (payload) => {
          setPlayer(payload.new);
          updateCachedPlayer(payload.new);
        }
      )
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "Player",
          filter: `internal_id=eq.${session.user.id}`,
        },
        (payload) => {
          updateCachedPlayer(payload.new);
          setPlayer(payload.new);
        }
      )
      .subscribe();

    const notesSub = supabase
      .channel("realtime-notes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "Note",
          filter: `note_creator=eq.${session.user.id}`,
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setNotes((prevNotes) => [...prevNotes, payload.new]);
          } else if (payload.eventType === "UPDATE") {
            setNotes((prevNotes) =>
              prevNotes.map((note) =>
                note.note_id === payload.new.note_id ? payload.new : note
              )
            );
          } else if (payload.eventType === "DELETE") {
            setNotes((prevNotes) =>
              prevNotes.filter((note) => note.note_id !== payload.old.note_id)
            );
          }
        }
      )
      .subscribe();
      setLoading(false);

    return () => {
      playerSub.unsubscribe();
      notesSub.unsubscribe();
    };
  }, [session?.user?.id]);

  if (loading) return <div>Loading, please stand by</div>;

  return (
    <AuthContext.Provider
      value={{
        session,
        signUpNewUser,
        signInUser,
        signOut,
        player,
        setPlayer,
        loading,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const UserAuth = () => useContext(AuthContext);
