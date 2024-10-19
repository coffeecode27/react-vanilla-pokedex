const fs = require("fs");
const axios = require("axios");

async function generateJsonDB() {
  const pokemonApiURL = "https://pokeapi.co/api/v2/pokemon/";
  const limit = 200; // Jumlah data yang ingin diambil

  try {
    // Fetch data dari PokeAPI
    const response = await axios.get(`${pokemonApiURL}?limit=${limit}`);
    const pokemonList = response.data.results;

    // Buat array untuk menampung data yang telah diparsing
    const parsedData = [];

    // Loop untuk mengambil detail tiap Pokemon
    for (const pokemon of pokemonList) {
      const pokemonDetails = await axios.get(pokemon.url);
      const { id, name, sprites, moves, abilities, stats, species, types } =
        pokemonDetails.data;

      // Parsing data yang diperlukan
      parsedData.push({
        id,
        name,
        image: sprites.other["official-artwork"]?.front_default, // Gambar Pokemon
        gifImg: sprites.other.showdown.front_default,
        abilities: abilities.map((ability) => ability.ability.name),
        moves: moves.map((move) => move.move.name),
        stats: stats,
        species: species.name,
        type: types[0].type.name,
      });
    }

    // Tulis hasil parsing ke dalam db.json, dengan properti pokemon
    const db = { pokemon: parsedData };
    fs.writeFileSync("db.json", JSON.stringify(db, null, 2));
    console.log("Data berhasil di-generate dan disimpan ke db.json");
  } catch (error) {
    console.error("Error fetching data from PokeAPI:", error);
  }
}

generateJsonDB();
