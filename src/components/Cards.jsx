import React, { useEffect, useState } from "react";

const Cards = () => {
  const [pokemonCard, setPokemonCard] = useState([]);
  const [filerCard, setFilterCard] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const URL = "https://pokeapi.co/api/v2/pokemon?limit=100"; // Fixed URL

  const fetchCards = async () => {
    try {
      const response = await fetch(URL);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const PokemonCardData = await response.json();
      const CardUrls = PokemonCardData.results.map(async (data) => {
        const res = await fetch(data.url);
        const OneCardData = await res.json();
        return OneCardData;
      });

      const completePromise = await Promise.all(CardUrls);
      setPokemonCard(completePromise);
      setFilterCard(completePromise);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching Pokémon data:", error);
      setLoading(false);
      setError(error);
    }
  };

  useEffect(() => {
    fetchCards();
  }, []); // Fetch data only once when component mounts

  useEffect(() => {
    setFilterCard(
      pokemonCard.filter((card) =>
        card.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, pokemonCard]); // Filter cards when searchTerm or pokemonCard changes

  if (loading) {
    return (
      <div className="w-full h-screen flex justify-center items-center bg-gray-100">
        <div className="border-t-4 border-blue-500 border-solid rounded-full w-16 h-16 animate-spin loader"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-screen flex justify-center items-center bg-gray-100 text-center">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <p className="text-red-500 text-lg font-semibold">
            Error: {error.message}
          </p>
          <p>Something went wrong while retrieving the data.</p>
        </div>
      </div>
    );
  }

  //   if (filerCard.length === 0) {
  //     return (
  //       <div className="w-full h-screen flex justify-center items-center bg-gray-100 text-center">
  //         <div className="bg-white p-6 rounded-lg shadow-lg">
  //           <p className="text-gray-700 text-lg font-semibold">
  //             No Pokémon Data Found
  //           </p>
  //           <button
  //           onChange={()=> setSearchTerm('')}
  //            className="px-3 py-2 rounded-md bg-red-600 text-white">back to</button>
  //         </div>
  //       </div>
  //     );
  //   }

  return (
    <div className="w-full flex justify-center items-center flex-col bg-gray-50 p-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Pokémon Cards</h1>

      <div className="w-full max-w-md mb-5 mx-auto">
        <input
          value={searchTerm}
          type="search"
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search Pokémon..."
          className="w-full px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full max-w-6xl">
        {filerCard.length > 0 ? (
          filerCard.map((data) => (
            <div
              key={data.id}
              className="flex flex-col items-center bg-white shadow-lg rounded-lg overflow-hidden transform transition-transform hover:scale-105 p-4"
            >
              {data.sprites?.other?.dream_world?.front_default ? (
                <img
                  src={data.sprites.other.dream_world.front_default}
                  alt={data.name || "Pokémon"}
                  className="w-32 h-32 object-cover"
                />
              ) : (
                <div className="w-32 h-32 bg-gray-300 flex items-center justify-center">
                  <span className="text-gray-700">Image Unavailable</span>
                </div>
              )}
              <div className="mt-4 text-center">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                  {data.name
                    ? data.name.charAt(0).toUpperCase() + data.name.slice(1)
                    : "Loading..."}
                </h1>

                <h1 className="bg-green-500 font-semibold rounded-2xl px-2 py-1 text-white mb-3">
                  <span className="font-medium">
                    {" "}
                    {data.types
                    .slice(0,1)
                      .map(
                        (item) =>
                          item.type.name.charAt(0).toUpperCase() +
                          item.type.name.slice(1)
                      )
                      .join(", ")}
                  </span>
                </h1>
                <div className="grid grid-cols-1 gap-2">
                  <p className="text-gray-600 text-sm">
                    <span className="font-medium">Type:</span>{" "}
                    {data.types?.map((type) => type.type.name).join(", ")}
                  </p>
                  <p className="text-gray-600 text-sm">
                    <span className="font-medium">Weight:</span> {data.weight}{" "}
                    kg
                  </p>
                  <p className="text-gray-600 text-sm">
                    <span className="font-medium">Height:</span> {data.height} m
                  </p>
                  <p className="text-gray-600 text-sm">
                    <span className="font-medium">Base Exp:</span>{" "}
                    {data.base_experience}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center absolute top-1/2 left-0 right-0 ">
            <span className="text-gray-700">
              No Pokémon found matching the search criteria.
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cards;
