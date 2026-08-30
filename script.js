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

// Supabase check
if (!window.supabase) {
    console.error("Supabase library load nahi hui.");
    showMessage("Supabase library load nahi hui.");
} else {

    const SUPABASE_URL = "https://srbvlfjthbkdixlwlcvz.supabase.co";

    const SUPABASE_KEY = "APNI_PUBLISHABLE_KEY_YAHAN_LAGAO";

    const supabaseClient = window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );

    let allGames = [];

    // Games load
    async function loadGames() {

        showMessage("Loading games...");

        const { data, error } = await supabaseClient
            .from("games")
            .select("*")
            .eq("is_visible", true)
            .order("id", { ascending: true });

        if (error) {
            console.error("Supabase Error:", error);
            showMessage("Games load nahi ho rahe.");
            return;
        }

        allGames = data || [];

        displayGames(allGames);
    }


    // Games display
    function displayGames(games) {

        if (!gameList) return;

        if (!games.length) {
            gameList.innerHTML = `
                <div class="message">
                    No games found.
                </div>
            `;
            return;
        }

        gameList.innerHTML = games.map(game => {

            // IMPORTANT:
            // Supabase ke playstore_link column ka EXACT URL use hoga.
            const gameLink = String(
                game.playstore_link || ""
            ).trim();

            return `
                <div class="game-card">

                    <div class="game-logo">
                        ${
                            game.logo_url
                            ? `<img src="${game.logo_url}" alt="${game.name || "Game"}">`
                            : `🎮`
                        }
                    </div>

                    <div class="game-info">

                        <div class="game-name">
                            ${game.name || "Game"}
                        </div>

                        <div class="signup-bonus">
                            Sign Up Bonus: ${game.signup_bonus || "-"}
                        </div>

                        <div class="minimum-withdrawal">
                            Minimum Withdrawal:
                            ${game.minimum_withdrawal || "-"}
                        </div>

                    </div>

                    <div class="game-action">

                        ${
                            gameLink
                            ? `
                                <button
                                    class="download-btn"
                                    data-link="${gameLink}"
                                >
                                    ⇩<br>
                                    Download
                                </button>
                            `
                            : `
                                <button
                                    class="download-btn"
                                    disabled
                                >
                                    ⇩<br>
                                    No Link
                                </button>
                            `
                        }

                        <div class="game-rating">
                            ★ ${game.rating || "-"}
                        </div>

                        <div class="game-size">
                            ${game.size_mb || "-"}
                        </div>

                    </div>

                </div>
            `;
        }).join("");

        // Download buttons
        document.querySelectorAll(".download-btn").forEach(button => {

            button.addEventListener("click", function () {

                const link = this.getAttribute("data-link");

                if (!link) {
                    return;
                }

                // URL ko exactly use karega
                window.location.href = link;

            });

        });
    }


    // Search
    const searchInput = document.getElementById("search");

    if (searchInput) {

        searchInput.addEventListener("input", function () {

            const searchText = this.value.toLowerCase().trim();

            const filteredGames = allGames.filter(game =>
                String(game.name || "")
                    .toLowerCase()
                    .includes(searchText)
            );

            displayGames(filteredGames);
        });
    }


    // Category tabs
    const yonoTab = document.getElementById("yono-tab");
    const othersTab = document.getElementById("others-tab");

    if (yonoTab) {

        yonoTab.addEventListener("click", function () {

            yonoTab.classList.add("active");

            if (othersTab) {
                othersTab.classList.remove("active");
            }

            const yonoGames = allGames.filter(game =>
                String(game.category || "").toLowerCase() === "yono"
            );

            displayGames(yonoGames);
        });
    }


    if (othersTab) {

        othersTab.addEventListener("click", function () {

            othersTab.classList.add("active");

            if (yonoTab) {
                yonoTab.classList.remove("active");
            }

            const otherGames = allGames.filter(game =>
                String(game.category || "").toLowerCase() === "others"
            );

            displayGames(otherGames);
        });
    }


    // Start
    loadGames();
                                                                  }
