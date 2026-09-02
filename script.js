console.log("script.js started");

const gameList = document.getElementById("game-list");

let allGames = [];
let currentCategory = "yono";

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
    showMessage("sb_publishable_-pF6ErKu9TUaxnrXodt0cg_HP9uEY9m,");
} else {

    const SUPABASE_URL = "YOUR_SUPABASE_URL";
    const SUPABASE_KEY = "YOUR_SUPABASE_ANON_KEY";

    const supabaseClient =
        window.supabase.createClient(
            SUPABASE_URL,
            SUPABASE_KEY
        );

    async function loadGames() {

        showMessage("Loading games...");

        const { data, error } = await supabaseClient
            .from("Games")
            .select("*")
            .eq("is_visible", true)
            .order("id", { ascending: true });

        if (error) {
            console.error("Supabase Error:", error);
            showMessage("Games load nahi ho rahe.");
            return;
        }

        allGames = data || [];

        showGames(currentCategory);
    }

    function showGames(category) {

        currentCategory = category;

        const games = allGames.filter(game => {

            const gameCategory =
                String(game.category || "")
                    .trim()
                    .toLowerCase();

            return gameCategory === category;
        });

        if (games.length === 0) {
            showMessage("Is category me abhi koi game nahi hai.");
            return;
        }

        gameList.innerHTML = "";

        games.forEach(game => {

            const gameName =
                String(game.name || "Game");

            const logo =
                String(game.logo_url || "");

            const signupBonus =
                String(game.signup_bonus || "");

            const minimumWithdrawal =
                String(game.minimum_withdrawal || "");

            const rating =
                String(game.rating || "");

            const size =
                String(game.size_mb || "");

            let gameLink =
                String(game.playstore_link || "").trim();

            if (!gameLink) {
                gameLink = "#";
            }

            const card = document.createElement("div");

            card.className = "game-card";

            card.innerHTML = `
                <div class="game-logo">
                    ${
                        logo
                        ? `<img src="${logo}" alt="${gameName}">`
                        : "🎮"
                    }
                </div>

                <div class="game-info">

                    <div class="game-name">
                        ${gameName}
                    </div>

                    <div class="signup">
                        Sign Up Bonus: ${signupBonus}
                    </div>

                    <div class="withdraw">
                        Minimum Withdrawal: ${minimumWithdrawal}
                    </div>

                </div>

                <div class="game-action">

                    <a
                        class="download-btn"
                        href="${gameLink}"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Download
                    </a>

                    <div class="game-meta">
                        ★ ${rating} &nbsp; | &nbsp; ${size}
                    </div>

                </div>
            `;

            gameList.appendChild(card);
        });
    }

    // YONO GAMES button
    const yonoButton =
        document.getElementById("yono-btn");

    if (yonoButton) {
        yonoButton.addEventListener("click", () => {
            showGames("yono");
        });
    }

    // OTHERS GAMES button
    const othersButton =
        document.getElementById("others-btn");

    if (othersButton) {
        othersButton.addEventListener("click", () => {
            showGames("others");
        });
    }

    // Search
    const searchInput =
        document.getElementById("search");

    if (searchInput) {

        searchInput.addEventListener("input", () => {

            const searchText =
                searchInput.value
                    .trim()
                    .toLowerCase();

            const games = allGames.filter(game => {

                const category =
                    String(game.category || "")
                        .trim()
                        .toLowerCase();

                const name =
                    String(game.name || "")
                        .toLowerCase();

                return (
                    category === currentCategory &&
                    name.includes(searchText)
                );
            });

            if (games.length === 0) {
                showMessage("Game nahi mila.");
                return;
            }

            gameList.innerHTML = "";

            games.forEach(game => {

                const gameName =
                    String(game.name || "Game");

                const logo =
                    String(game.logo_url || "");

                const signupBonus =
                    String(game.signup_bonus || "");

                const minimumWithdrawal =
                    String(game.minimum_withdrawal || "");

                const rating =
                    String(game.rating || "");

                const size =
                    String(game.size_mb || "");

                let gameLink =
                    String(game.playstore_link || "").trim();

                if (!gameLink) {
                    gameLink = "#";
                }

                gameList.innerHTML += `
                    <div class="game-card">

                        <div class="game-logo">
                            ${
                                logo
                                ? `<img src="${logo}" alt="${gameName}">`
                                : "🎮"
                            }
                        </div>

                        <div class="game-info">

                            <div class="game-name">
                                ${gameName}
                            </div>

                            <div class="signup">
                                Sign Up Bonus: ${signupBonus}
                            </div>

                            <div class="withdraw">
                                Minimum Withdrawal:
                                ${minimumWithdrawal}
                            </div>

                        </div>

                        <div class="game-action">

                            <a
                                class="download-btn"
                                href="${gameLink}"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Download
                            </a>

                            <div class="game-meta">
                                ★ ${rating}
                                &nbsp; | &nbsp;
                                ${size}
                            </div>

                        </div>

                    </div>
                `;
            });
        });
    }

    // Load games
    loadGames();
               }
