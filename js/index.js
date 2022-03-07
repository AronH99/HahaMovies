const apiKey = "4ab6d68d0efde78e9ac01b6d79371221";
const baseUrl = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&page=1`;
const baseImgUrl = "https://image.tmdb.org/t/p/original";
const baseGenreUrl = `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=en-US`;

const movieTemplate = document.querySelector("[data-movies]").innerHTML;
const injectingMovies = document.querySelector(".columns");
const input = document.querySelector(".input");
const form = document.querySelector("form");
const h2 = document.querySelector("h2");
/* const omschrijving = document.querySelector(".omschrijving");
const kaart = document.querySelectorAll(".card"); */

const main = async () => {
  const response = await fetch(baseUrl);
  const data = await response.json();
  const movies = data.results;

  const response3 = await fetch(baseGenreUrl);
  const data3 = await response3.json();
  const movies3 = data3.genres;

  //console.log(movies3.map((x) => (x.id = x.name)));

  render(movies);

  function render(movie, str = "") {
    const reg = new RegExp(str, "gi");
    injectingMovies.innerHTML = movie
      .filter(
        ({ original_title, overview }) =>
          original_title.match(reg) || overview.match(reg)
      )
      .map(
        ({
          original_title,
          overview,
          vote_average,
          backdrop_path,
          genre_ids,
        }) =>
          movieTemplate
            .replaceAll("%title%", original_title)
            .replaceAll("%description%", overview)
            .replaceAll("%image%", baseImgUrl + backdrop_path)
            .replaceAll("%rating%", vote_average)
            .replaceAll(
              "%genre%",
              genre_ids
                .map((x) => movies3.filter((y) => y.id === x)[0].name)
                .join("/")
            )
      )
      .join("");
  }

  input.oninput = (e) => {
    if (e.target.value.length >= 3) {
      render(movies, e.target.value);
      h2.innerText = `Searchresults for your search “${e.target.value}” `;
    } else {
      render(movies);
    }
  };
  form.onsubmit = async function (event) {
    event.preventDefault();
    const baseSearchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=en-US&query=${input.value}`;
    const response2 = await fetch(baseSearchUrl);
    const data2 = await response2.json();
    const movies2 = data2.results;
    render(movies2, input.value);
    input.value = "";
  };
};

main();
