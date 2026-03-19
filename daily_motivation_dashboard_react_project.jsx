import { useEffect, useState } from "react";

export default function App() {
  const [quote, setQuote] = useState("");
  const [author, setAuthor] = useState("");
  const [loading, setLoading] = useState(false);
  const [likedQuotes, setLikedQuotes] = useState(() => {
    // Load from localStorage on first render
    const saved = localStorage.getItem("likedQuotes");
    return saved ? JSON.parse(saved) : [];
  });

  const fetchQuote = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://api.quotable.io/random");
      const data = await res.json();
      setQuote(data.content);
      setAuthor(data.author);
    } catch (error) {
      console.error("Error fetching quote:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchQuote();
  }, []);

  // Save to localStorage whenever likedQuotes changes
  useEffect(() => {
    localStorage.setItem("likedQuotes", JSON.stringify(likedQuotes));
  }, [likedQuotes]);

  const handleLike = () => {
    const exists = likedQuotes.find((q) => q.quote === quote);

    if (exists) {
      setLikedQuotes(likedQuotes.filter((q) => q.quote !== quote));
    } else {
      setLikedQuotes([...likedQuotes, { quote, author }]);
    }
  };

  const isLiked = likedQuotes.some((q) => q.quote === quote);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-6 rounded-2xl shadow-md w-full max-w-md text-center">
        <h1 className="text-2xl font-bold mb-4">Daily Motivation 🌞</h1>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <p className="text-lg italic mb-2">\"{quote}\"</p>
            <p className="text-sm text-gray-600 mb-4">- {author}</p>
          </>
        )}

        <div className="flex gap-3 justify-center">
          <button
            onClick={fetchQuote}
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600"
          >
            New Quote
          </button>

          <button
            onClick={handleLike}
            className={`px-4 py-2 rounded-xl text-white ${
              isLiked ? "bg-red-500" : "bg-gray-400"
            }`}
          >
            {isLiked ? "Liked ❤️" : "Like 🤍"}
          </button>
        </div>

        <p className="mt-4 text-sm">Total Liked: {likedQuotes.length}</p>
      </div>

      {likedQuotes.length > 0 && (
        <div className="mt-6 w-full max-w-md">
          <h2 className="text-lg font-semibold mb-2">Liked Quotes</h2>
          <ul className="space-y-2">
            {likedQuotes.map((q, index) => (
              <li key={index} className="bg-white p-3 rounded-xl shadow">
                <p className="text-sm">\"{q.quote}\"</p>
                <p className="text-xs text-gray-500">- {q.author}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
