console.log("SCRIPT START");

const SUPABASE_URL =
    "https://srbvlfjthbkdixlwlcvz.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_-pF6ErKu9TUaxnrXodt0cg_HP9uEY9m";

const gameList = document.getElementById("game-list");

function message(text) {
    gameList.innerHTML = `
        <div class="message">
            ${text}
        </div>
    `;
}

if (!window.supabase) {

    message("❌ Supabase library load nahi hui.");

} else {

    console.log("Supabase library OK");

    const db = window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );

    message("Connecting to database...");

    loadGames(db);
}


async function loadGames(db) {

    try {

        console.log("Request started");

        const request = db
            .from("Games")
            .select("*");

        const timeout = new Promise((_, reject) => {
            setTimeout(() => {
                reject(
                    new Error(
                        "Database response 10 seconds se nahi aaya."
                    )
                );
            }, 10000);
        });

        const result =
            await Promise.race([
                request,
                timeout
            ]);

        console.log("RESULT:", result);

        if (result.error) {

            message(`
                ❌ Supabase Error
                <br><br>
                ${result.error.message}
            `);

            return;
        }

        const games = result.data || [];

        console.log("GAMES:", games);

        if (games.length === 0) {

            message(`
                ⚠️ Database connected,
                lekin koi row return nahi hui.
            `);

            return;
        }

        showGames(games);

    } catch (error) {

        console.error("ERROR:", error);

        message(`
            ❌ Database connection failed
            <br><br>
            ${error.message}
        `);
    }
}


function showGames(games) {

    gameList.innerHTML = "";

    games.forEach(game => {

        const card = document.createElement("div");

        card.className = "game-card";

        card.innerHTML = `
            <div class="game-logo-box">
                ${
                    game.logo_url
                    ? `<img
                        src="${game.logo_url}"
                        class="game-logo"
                      >`
                    : "🎮"
                }
            </div>

            <div class="game-info">

                <div class="game-name">
                    ${game.name || "Game"}
                </div>

                <div class="signup-bonus">
                    Sign Up Bonus:
                    ${game.signup_bonus || ""}
                </div>

                <div class="minimum-withdrawal">
                    Minimum Withdrawal:
                    ${game.minimum_withdrawal || ""}
                </div>

            </div>

            <div class="game-action">

                <button
                    class="download-btn"
                    onclick="openGame('${game.playstore_link || ""}')"
                >
                    ⇩<br>
                    Download
                </button>

                <div class="game-meta">
                    ★ ${game.rating || ""}
                    |
                    ${game.size_mb || ""}
                </div>

            </div>
        `;

        gameList.appendChild(card);
    });
}


function openGame(link) {

    if (!link) {

        alert("Download link available nahi hai.");

        return;
    }

    if (
        !link.startsWith("http://") &&
        !link.startsWith("https://")
    ) {
        link = "https://" + link;
    }

    window.location.href = link;
    }
