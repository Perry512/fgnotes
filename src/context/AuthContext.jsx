import { useRef, useState, useEffect, useContext, createContext } from "react";
import { supabase } from "../supabaseClient";
import {
  fetchAndCachePlayer,
  getCachedPlayer,
  clearCachedPlayer,
  updateCachedPlayer,
} from "../utilities/playerUtils";
import {
  updateCachedPlayerNotes,
  clearCachedNotes,
} from "../utilities/noteUtils";
import { useResolvePlayer } from "../hooks/useResolvePlayer";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState("loading");
  const [session, setSession] = useState(null);
  const [player, setPlayer] = useState(null);
  const [notes, setNotes] = useState([]);
  const hasFetchedPlayer = useRef(false);

  useResolvePlayer({
    userId: session?.user?.id,
    accessToken: session?.access_token,
    setPlayer,
    setStatus,
  });

  const createPlayer = async (userId) => {
    setLoading(true);
    await supabase
      .from("Player")
      .insert([{ internal_id: userId }])
      .single()
      .select();
  };

  const signUpNewUser = async (email, password) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setLoading(false);
      return { success: false, error };
    }

    const userId = data.user?.id;
    if (userId) await createPlayer(userId);
    setLoading(false);
    return data;
  };

  const signInUser = async (email, password) => {
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setLoading(false);
      return { success: false, error: error.message };
    }
    setLoading(false)
      return data;
  };

  const signOut = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    setLoading(false);
    setSession(null);
    setPlayer(null);
    setNotes([]);
    clearCachedPlayer();
    clearCachedNotes();
    hasFetchedPlayer.current = false;
    return { success: true };
  };

  useEffect(() => {
    //console.log("AuthContextProvider mounted");
    let mounted = true;

    const initAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;

      //console.log("AuthContextProvider: initAuth: ", data);
      setSession(data.session ?? null);
      setLoading(false);
    }

    initAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, newSession) => {
        if (!mounted) return;
        setSession(newSession);
      }
    );

    return () => {
      mounted = false;
      authListener?.subscription?.unsubscribe();
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
          //console.log("Player created: ", payload.new);
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
          setNotes((prevNotes) => {
            let updatedNotes;
            if (payload.eventType === "INSERT") {
              updatedNotes = [...prevNotes, payload.new];
            } else if (payload.eventType === "UPDATE") {
              updatedNotes = prevNotes.map((note) =>
                note.note_id === payload.new.note_id ? payload.new : note
              );
            } else if (payload.eventType === "DELETE") {
              updatedNotes = prevNotes.filter(
                (note) => note.note_id !== payload.old.note_id
              );
            }
            updateCachedPlayerNotes(updatedNotes);
            return updatedNotes;
          });
        }
      )
      .subscribe();

    if (status === "fetched") { setLoading(false); }

    return () => {
      playerSub.unsubscribe();
      notesSub.unsubscribe();

    };
  }, [session?.user?.id]);

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
        error,
        status,
        setError,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const UserAuth = () => useContext(AuthContext);
