import React, { useState } from "react";
import { UserAuth } from "../context/AuthContext";
import {
  updateCachedPlayer,
  updatePlayerField,
} from "../utilities/playerUtils";

export const UpdatePlayerTag = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [tag, setTag] = useState(null);

  const { session, player, setPlayer } = UserAuth();

  const handleUpdatePlayer = async (e) => {
    e.preventDefault();

    if (!tag.trim()) {
      setError("Please enter a tag");
      return;
    }

    setLoading(true);
    setError("");

    const { data, error: updateError } = await updatePlayerField(
      session?.user?.id,
      "tag",
      tag.trim(),
      { verbose: false }
    );

    if (updateError) {
      setError(updateError.message || "Failed to update player tag");
      setTimeout(() => {
        setError("");
      }, 3000);
    } else if (data) {
      setPlayer(data);
      updateCachedPlayer(data, { verbose: false });
      setTag("");
    }

    setLoading(false);
    console.log(player, loading);
  };

  return (
    <>
      <form onSubmit={handleUpdatePlayer} className="flex flex-col">
        <h1> Update Player </h1>
        <input
          onChange={(e) => setTag(e.target.value)}
          placeholder="Your tag goes here"
          className="p-3 mt-2"
          type="text"
        />
        <button className="mt-6 w-full" type="submit">
          {loading ? "Updating" : "Update Player"}
        </button>
        {error && <p className="text-red-600 text-center pt-4"> {error} </p>}
      </form>
    </>
  );
};

export default UpdatePlayerTag;