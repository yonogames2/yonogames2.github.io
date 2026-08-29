console.log("script.js started");

const gameList = document.getElementById("game-list");

function showMessage(message) {
    if (gameList) {
        gameList.innerHTML = `
            <div class="message">
                ${message}
            </div>
        `;
    }
}

if (!window.supabase) {

    console.error("Supabase library load nahi hui.");

    showMessage(
        "Supabase library load nahi hui. Internet check karo."
    );

} else {

    console.log("Supabase library OK");

    const SUPABASE_URL =
        "https://srbvlfjthbkdixlwlcvz.supabase.co";

    const SUPABASE_KEY =
        "sb_publishable_-pF6ErKu9TUaxnrXodt0cg_HP9uEY9m";

    const supabaseClient =
        window.supabase.createClient(
            SUPABASE_URL,
            SUPABASE_KEY
        );

    let allGames = [];
    let currentTab = "yono";
    let searchText = "";


    /* =========================
       LOAD GAMES
    ========================= */

    async function loadGames() {

        showMessage("Loading games...");

        try {

            const { data, error } =
                await supabaseClient
                    .from("games")
                    .select("*")
                    .eq("is_visible", true)
                    .order("id", {
                        ascending: true
                    });

            console.log("Supabase data:", data);
            console.log("Supabase error:", error);

            if (error) {

                showMessage(
                    "Supabase Error: " +
                    error.message
                );

                return;
            }

            allGames = data || [];

            renderGames();

        } catch (error) {

            console.error("Load error:", error);

            showMessage(
                "Connection Error: " +
                (error.message || error)
            );
        }
    }


    /* =========================
       RENDER GAMES
    ========================= */

    function renderGames() {

        if (!gameList) return;

        const filteredGames =
            allGames.filter(function(game) {

                const category =
                    String(game.category || "")
                        .trim()
                        .toLowerCase();

                let categoryMatch;

                if (currentTab === "yono") {

                    categoryMatch =
                        category === "yono";

                } else {

                    categoryMatch =
                        category !== "yono";

                }

                const name =
                    String(game.name || "")
                        .toLowerCase();

                const searchMatch =
                    name.includes(
                        searchText.toLowerCase()
                    );

                return (
                    categoryMatch &&
                    searchMatch
                );
            });


        if (filteredGames.length === 0) {

            gameList.innerHTML = `
                <div class="message">
                    Is category me koi game nahi mila.
                </div>
            `;

            return;
        }


        gameList.innerHTML = "";


        filteredGames.forEach(function(game) {

            const card =
                document.createElement("div");

            card.className = "game-card";


            /* =========================
               LOGO
            ========================= */

            const logo = game.logo_url
                ? `
                    <img
                        src="${escapeHTML(game.logo_url)}"
                        alt="${escapeHTML(
                            game.name || "Game"
                        )}"
                    >
                  `
                : "🎮";


            /* =========================
               GAME LINK
