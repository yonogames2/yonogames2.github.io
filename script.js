console.log("script.js started");

// ==========================================
// SUPABASE SETTINGS
// ==========================================

const SUPABASE_URL =
    "https://srbvlfjthbkdixlwlcvz.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_-pF6ErKu9TUaxnrXodt0cg_HP9uEY9m";


// ==========================================
// VARIABLES
// ==========================================

let supabaseClient;
let allGames = [];
let currentCategory = "yono";


// ==========================================
// ELEMENTS
// ==========================================

const gameList = document.getElementById("game-list");
const searchInput = document.getElementById("search");
const yonoTab = document.getElementById("yono-tab");
const othersTab = document.getElementById("others-tab");


// ==========================================
// MESSAGE
// ==========================================

function showMessage(message) {
    if (gameList) {
        gameList.innerHTML = `
            <div class="message">
                ${message}
            </div>
        `;
    }
}


// ==========================================
// CHECK SUPABASE
// ==========================================

if (!window.supabase) {

    console.error("Supabase library load nahi hui.");

    showMessage(
        "Supabase library load nahi hui."
    );

} else {

    console.log("Supabase library loaded.");

    supabaseClient =
        window.supabase.createClient(
            SUPABASE_URL,
            SUPABASE_KEY
        );

    console.log("Supabase client created.");

    // Ab load hoga
    loadGames();
}


// ==========================================
// LOAD GAMES
// ==========================================

async function loadGames() {

    console.log("Loading games...");

    showMessage("Loading games...");

    try {

        const {
            data,
            error
        } = await supabaseClient
            .from("games")
            .select("*")
            .eq("is_visible", true)
            .order("id", {
                ascending: true
            });


        console.log("Supabase data:", data);
        console.log("Supabase error:", error);


        // Error
        if (error) {

            console.error(
                "Supabase Error:",
                error
            );

            showMessage(`
                Games load nahi ho rahe.<br><br>
                <b>Supabase Error:</b><br>
                ${escapeHTML(error.message)}
            `);

            return;
        }


        // Data mil gaya
        allGames = data || [];

        console.log(
            "Total games:",
            allGames.length
        );


        renderGames();

    } catch (err) {

        console.error(
            "Unexpected Error:",
            err
        );

        showMessage(`
            Games load nahi ho rahe.<br><br>
            <b>Error:</b><br>
            ${escapeHTML(err.message)}
        `);
    }
}


// ==========================================
// RENDER GAMES
// ==========================================

function renderGames() {

    if (!gameList) return;


    const searchText =
        searchInput
            ? searchInput.value
                .trim()
                .toLowerCase()
            : "";


    const filteredGames =
        allGames.filter(function(game) {

            const category =
                String(
                    game.category || ""
                )
                .trim()
                .toLowerCase();


            const name =
                String(
                    game.name || ""
                )
                .trim()
                .toLowerCase();


            return (
                category === currentCategory &&
                name.includes(searchText)
            );
        });


    console.log(
        "Category:",
        currentCategory
    );

    console.log(
        "Showing:",
        filteredGames
    );


    if (filteredGames.length === 0) {

        showMessage(
            searchText
                ? "Game nahi mila."
                : "Is category me koi game nahi hai."
        );

        return;
    }


    gameList.innerHTML =
        filteredGames
            .map(function(game) {
                return createGameCard(game);
            })
            .join("");
}


// ==========================================
// GAME CARD
// ==========================================

function createGameCard(game) {

    const name =
        escapeHTML(
            game.name || "Game"
        );


    const logoURL =
        String(
            game.logo_url || ""
        ).trim();


    const signupBonus =
        escapeHTML(
            game.signup_bonus || ""
        );


    const minimumWithdrawal =
        escapeHTML(
            game.minimum_withdrawal || ""
        );


    const rating =
        escapeHTML(
            game.rating ?? "0"
        );


    const size =
        escapeHTML(
            game.size_mb || ""
        );


    const gameLink =
        String(
            game.playstore_link || ""
        ).trim();


    let logoHTML = "🎮";


    if (logoURL) {

        logoHTML = `
            <img
                src="${escapeAttribute(logoURL)}"
                alt="${name}"
                class="game-logo"
                onerror="this.style.display='none';"
            >
        `;
    }


    return `
        <div class="game-card">

            <div class="game-logo-box">
                ${logoHTML}
            </div>


            <div class="game-info">

                <div class="game-name">
                    ${name}
                </div>

                <div class="signup-bonus">
                    Sign Up Bonus: ${signupBonus}
                </div>

                <div class="minimum-withdrawal">
                    Minimum Withdrawal:
                    ${minimumWithdrawal}
                </div>

            </div>


            <div class="game-action">

                <button
                    class="download-btn"
                    onclick="openGameLink(${JSON.stringify(gameLink)})"
                >
                    ⇩<br>
                    Download
                </button>


                <div class="game-meta">
                    ★ ${rating}
                    <span>|</span>
                    ${size}
                </div>

            </div>

        </div>
    `;
}


// ==========================================
// OPEN GAME LINK
// ==========================================

window.openGameLink = function(link) {

    let finalLink =
        String(link || "").trim();


    if (!finalLink) {

        alert(
            "Is game ka download link available nahi hai."
        );

        return;
    }


    if (
        !finalLink.startsWith("http://") &&
        !finalLink.startsWith("https://")
    ) {

        finalLink =
            "https://" + finalLink;
    }


    console.log(
        "Opening:",
        finalLink
    );


    window.location.href = finalLink;
};


// ==========================================
// YONO TAB
// ==========================================

if (yonoTab) {

    yonoTab.addEventListener(
        "click",
        function() {

            currentCategory = "yono";

            yonoTab.classList.add("active");

            if (othersTab) {
                othersTab.classList.remove("active");
            }

            renderGames();
        }
    );
}


// ==========================================
// OTHERS TAB
// ==========================================

if (othersTab) {

    othersTab.addEventListener(
        "click",
        function() {

            currentCategory = "others";

            othersTab.classList.add("active");

            if (yonoTab) {
                yonoTab.classList.remove("active");
            }

            renderGames();
        }
    );
}


// ==========================================
// SEARCH
// ==========================================

if (searchInput) {

    searchInput.addEventListener(
        "input",
        function() {
            renderGames();
        }
    );
}


// ==========================================
// SECURITY
// ==========================================

function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


function escapeAttribute(value) {

    return escapeHTML(value);
                    }
