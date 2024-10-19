let pokemonData = [];
let filteredPokemon = []; // State untuk Pokémon yang difilter
let selectedPokemon = null;
let isModalOpen = false;
let itemsPerPage = 20; // Set jumlah item per halaman
let currentPage = 1; // Halaman yang sedang aktif
let searchQuery = ""; // State untuk menyimpan query pencarian
const logo = "assets/pokemon.svg";
const sun = "assets/sun.svg";
const moon = "assets/moon.svg";

// State untuk mode (gelap/terang)
let isDarkMode = false;

const statImages = {
  hp: "assets/hp.png",
  attack: "assets/attack.png",
  defense: "assets/defense.png",
  speed: "assets/speed.png",
  "special-attack": "assets/special-Attack.png",
  "special-defense": "assets/special-Defense.png",
};

// Function untuk mengganti mode
function toggleDarkMode() {
  isDarkMode = !isDarkMode; // Toggle mode
  renderApp(); // Render ulang untuk memperbarui tampilan
}

// Fetch data from mock server
async function fetchPokemon() {
  try {
    const response = await fetch("http://localhost:3000/pokemon");
    if (!response.ok) {
      throw new Error("http call failed");
    }
    const data = await response.json();
    pokemonData = data;
    filteredPokemon = data; // Set filteredPokemon awal dengan semua data
    renderApp();
  } catch (error) {
    console.error("Failed to fetch Pokemon data:", error);
    renderApp();
  }
}

// Function to handle search
function handleSearch(event) {
  searchQuery = event.target.value.toLowerCase(); // Simpan query pencarian dalam lowercase
  filteredPokemon = pokemonData.filter(
    (pokemon) => pokemon.name.toLowerCase().includes(searchQuery) // Filter Pokémon berdasarkan nama
  );
  currentPage = 1; // Reset halaman ke 1 setelah pencarian
  renderApp(); // Render ulang
}

// ParticleJS component
function ParticleBackground() {
  tsParticles.load("tsparticles", {
    background: {
      color: {
        value: `${isDarkMode ? "#243642" : "#FFFFFF"}`,
      },
    },
    fpsLimit: 120,
    interactivity: {
      events: {
        onClick: {
          enable: true,
          mode: "push",
        },
        onHover: {
          enable: true,
          mode: "repulse",
        },
      },
      modes: {
        push: {
          quantity: 4,
        },
        repulse: {
          distance: 200,
          duration: 0.5,
        },
      },
    },
    particles: {
      color: {
        value: `${isDarkMode ? "#FFFFFF" : "#000000"}`,
      },
      links: {
        color: `${isDarkMode ? "#FFFFFF" : "#000000"}`,
        distance: 150,
        enable: true,
        opacity: 0.5,
        width: 1,
      },
      move: {
        direction: "none",
        enable: true,
        outModes: {
          default: "bounce",
        },
        random: false,
        speed: 3,
        straight: false,
      },
      number: {
        density: {
          enable: true,
        },
        value: 80,
      },
      opacity: {
        value: 0.5,
      },
      shape: {
        type: "circle",
      },
      size: {
        value: { min: 1, max: 5 },
      },
    },
    detectRetina: true,
  });

  return React.createElement("div", {
    id: "tsparticles",
    className: "absolute inset-0 z-0", // Ensure the background is behind everything else
  });
}

// Card component
function PokemonCard(props) {
  const handleClick = () => {
    selectedPokemon = {
      id: props.id,
      name: props.name,
      image: props.image,
      type: props.type,
      species: props.species,
      moves: props.moves,
      abilities: props.abilities,
      stats: props.stats,
    };
    isModalOpen = true;
    renderApp(); // Render ulang untuk menampilkan modal
  };
  return React.createElement(
    "div",
    {
      className:
        "text-center p-4  border-2 border-[#000000] m-2 backdrop-blur-sm bg-white/30 rounded-md shadow-lg cursor-pointer",
      onClick: handleClick,
    }, // Menambahkan class text-center untuk mengatur teks agar berada di tengah
    React.createElement("img", {
      src: props.image,
      alt: props.name,
      className: "mx-auto w-40 h-30",
    }), // Menambahkan class mx-auto untuk membuat gambar berada di tengah
    React.createElement(
      "div",
      { className: "flex gap-x-2 justify-center items-center" },
      React.createElement(
        "h2",
        { className: " font-bold" },
        props.name.toUpperCase()
      ),
      React.createElement("img", {
        src: props.gifImg,
        alt: props.name,
        className: "w-10 h-10",
      }) // Menambahkan margin-top dan font-bold untuk jarak dan style teks
    )
  );
}

// Function to handle load more
function loadMore() {
  currentPage += 1; // Tambah halaman
  renderApp(); // Render ulang
}

function PokemonList() {
  const displayedPokemon = filteredPokemon.slice(0, itemsPerPage * currentPage);
  if (displayedPokemon.length === 0) {
    return React.createElement(
      "p",
      { className: "text-center" },
      "No Pokémon found."
    );
  }
  return React.createElement(
    "div",
    null,
    React.createElement(
      "div",
      { className: "grid grid-cols-2 lg:grid-cols-5 justify-center mt-4" },
      displayedPokemon.map((pokemon) =>
        React.createElement(PokemonCard, {
          key: pokemon.id,
          id: pokemon.id,
          name: pokemon.name,
          image: pokemon.image,
          gifImg: pokemon.gifImg,
          type: pokemon.type,
          species: pokemon.species,
          moves: pokemon.moves,
          abilities: pokemon.abilities,
          stats: pokemon.stats,
        })
      )
    ),
    displayedPokemon.length < filteredPokemon.length &&
      React.createElement(
        "button",
        {
          onClick: loadMore,
          className: `mt-4 bg-${
            isDarkMode ? "red" : "blue"
          }-500 text-white px-4 py-2 rounded mx-auto block`,
        },
        "Load More"
      )
  );
}

const getStatImage = (statName) => {
  return statImages[statName] || "path/to/default/image.png"; // Ganti dengan path default jika tidak ditemukan
};

// Fungsi untuk memformat nama stat
function formatStatName(statName) {
  // Ganti tanda hubung dengan spasi dan ubah huruf pertama menjadi kapital
  return statName
    .replace(/-/g, " ") // Ganti '-' dengan spasi
    .split(" ") // Pisahkan menjadi array kata
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Ubah huruf pertama jadi kapital
    .join(" "); // Gabungkan kembali menjadi string
}

// Modal component
function PokemonModal({ isOpen, onClose, pokemon }) {
  if (!isOpen || !pokemon) return null; // Pastikan pokemon ada

  return React.createElement(
    "div",
    {
      className: `fixed inset-0 bg-[${
        isDarkMode ? "#243642" : "#FFFFFF"
      }] bg-opacity-50 flex justify-center items-center`,
    },
    React.createElement(
      "div",
      {
        className:
          "border-2 border-[#000000] m-2 backdrop-blur-md bg-white/40 rounded-md grid grid-cols-7 p-2 gap-10 lg:w-[30%] lg:mx-auto mx-4",
      },
      React.createElement(
        "div",
        { className: "flex flex-col col-span-3" }, // Kolom untuk gambar dan nama
        React.createElement("img", {
          src: pokemon.image,
          alt: pokemon.name,
          className: "w-48 h-48",
        }),
        React.createElement(
          "h2",
          {
            className:
              "text-xs sm:text-sm md:text-base lg:text-md font-semibold mb-1",
          },
          `NAME : ${pokemon.name.toUpperCase()} `
        ),
        React.createElement(
          "h2",
          {
            className:
              "text-xs sm:text-sm md:text-base lg:text-md font-semibold mb-1",
          },
          `SPECIES : ${pokemon.species.toUpperCase()} `
        ),
        React.createElement(
          "h2",
          {
            className:
              "text-xs sm:text-sm md:text-base lg:text-md font-semibold mb-3",
          },
          `TYPE : ${pokemon.type.toUpperCase()}`
        ),

        React.createElement(
          "div",
          {
            className:
              "flex flex-col gap-y-1 text-xs lg:text-md font-base mb-3",
          },
          pokemon.moves.slice(0, 4).map((move, index) =>
            React.createElement(
              "p",
              {
                key: index,
                className: "border border-black px-1 rounded-md",
              },
              move
            )
          )
        )
      ),
      React.createElement(
        "div",
        { className: "flex flex-col col-span-4 gap-y-3 mt-10" }, // Kolom untuk detail

        pokemon.stats.map((stat, index) =>
          React.createElement(
            "div",
            { key: index, className: "flex flex-col" }, // Kontainer untuk setiap stat
            React.createElement(
              "div",
              { className: "flex items-center mb-1" }, // Baris untuk teks dan gambar
              React.createElement("img", {
                src: getStatImage(stat.stat.name), // Ambil gambar berdasarkan nama stat
                alt: stat.stat.name,
                className: "w-5 h-5 mr-2", // Mengatur ukuran gambar dan margin
              }),
              React.createElement(
                "span",
                null,
                `${formatStatName(stat.stat.name)}: ${stat.base_stat}%`
              ) // Tampilkan nama dan base_stat
            ),
            // Indikator untuk stat
            React.createElement(
              "div",
              {
                className: "w-full bg-gray-300 rounded-full h-2", // Gaya untuk bar latar belakang
              },
              React.createElement("div", {
                className: `bg-[${
                  isDarkMode ? "#243642" : "#37AFE1"
                }] h-full rounded-full`,
                style: { width: `${stat.base_stat}%` }, // Mengatur lebar indikator sesuai base_stat
              })
            )
          )
        )
      ),
      React.createElement(
        "span",
        {
          onClick: onClose,
          className: "absolute top-1 right-2 text-xl cursor-pointer text-black",
        },
        "✖" // Simbol X
      )
    )
  );
}

// App component wrap header and list
function App() {
  return React.createElement(
    "div",
    { className: "relative min-h-screen p-4 lg:px-20" },
    React.createElement(ParticleBackground, null),
    React.createElement(
      "header",
      {
        className: "relative z-20 ",
      },
      React.createElement(
        "div",
        {
          className: "lg:flex justify-between items-center mx-2",
        },
        React.createElement(
          "div",
          {
            className: "flex w-full  gap-4 items-center mx-2",
          },
          React.createElement(
            "div",
            {
              className:
                "my-2 flex items-center border-2 border-[#000000] backdrop-blur-sm bg-white/30 w-[50%] lg:w-[30%] lg:h-16 h-[65px]  rounded-lg",
            },
            React.createElement("img", {
              src: logo, // Ganti dengan path yang sesuai jika diperlukan
              alt: "Pokedex Logo", // Alt text untuk gambar
              className: "mx-auto w-36", // Sesuaikan ukuran gambar sesuai kebutuhan
            })
          ),
          React.createElement(
            "div",
            {
              onClick: toggleDarkMode,
              className: `bg-${
                isDarkMode ? "white" : "black"
              } p-3 transition rounded-full hover:cursor-pointer`,
            },
            isDarkMode
              ? React.createElement("img", {
                  src: sun,
                  alt: "Light Mode",
                  className: "w-5 h-5",
                })
              : React.createElement("img", {
                  src: moon,
                  alt: "Dark Mode",
                  className: "w-5 h-5 color-red-500",
                })
          )
        ),

        React.createElement(
          "div", // Kontainer untuk input pencarian
          { className: "relative z-20 lg:w-[40%]  mt-2" }, // Ganti w-[50%] dengan w-full
          React.createElement("input", {
            type: "text",
            placeholder: "Search Pokémon...",
            value: searchQuery,
            onInput: handleSearch,

            className: `w-full border-2 border-[#000000]  backdrop-blur-sm bg-white/30  text-${
              isDarkMode ? "white" : "black"
            } rounded-lg p-1 outline-none`, // Full width
          })
        )
      )
    ),

    React.createElement(
      "div",
      { className: "relative z-10" },
      React.createElement(PokemonList, null),
      React.createElement(PokemonModal, {
        isOpen: isModalOpen,
        onClose: () => {
          isModalOpen = false;
          renderApp();
        },
        pokemon: selectedPokemon,
      })
    )
  );
}

// Function to render the app
function renderApp() {
  ReactDOM.render(React.createElement(App), document.getElementById("root"));
}

// Initial render
renderApp();

// Fetch and display the Pokemon data
fetchPokemon();
