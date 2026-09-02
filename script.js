console.log("SCRIPT START");

const SUPABASE_URL =
    "https://srbvlfjthbkdixlwlcvz.supabase.co";

const SUPABASE_KEY =
    "APNI_WALI_PUBLISHABLE_KEY_YAHAN_RAKHO";

const gameList = document.getElementById("game-list");

function message(text) {
    if (gameList) {
        gameList.innerHTML = `
            <div class="message">
                ${text}
            </div>
        `;
    }
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

        const { data, error } = await db
            .from("games")
            .select("*")
            .eq("is_visible", true);

        console.log("DATA:", data);
        console.log("ERROR:", error);

        if (error) {

            message(`
                ❌ Supabase Error
                <br><br>
                ${error.message}
            `);

            return;
        }

        if (!data || data.length === 0) {

            message(`
                ⚠️ Database connected,
                <br><br>
                lekin koi visible game nahi mila.
            `);

            return;
        }

        showGames(data);

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
                    ? `<img src="${game.logo_url}" class="game-logo">`
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
                    onclick="openGame(${JSON.stringify(game.playstore_link || "")})"
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
