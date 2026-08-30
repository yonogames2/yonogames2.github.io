console.log("script.js started");

// ===============================
// SUPABASE SETTINGS
// ===============================

const SUPABASE_URL = "https://srbvlfjthbkdixlwlcvz.supabase.co";

// YAHAN APNA SUPABASE PUBLISHABLE KEY PASTE KARO
const SUPABASE_KEY = "sb_publishable_-pF6ErKu9TUaxnrXodt0cg_HP9uEY9m";


// ===============================
// SUPABASE CONNECT
// ===============================

if (!window.supabase) {
    console.error("Supabase library load nahi hui.");
} else {

    const supabaseClient =
        window.supabase.createClient(
            SUPABASE_URL,
            SUPABASE_KEY
        );


    // ===============================
    // ELEMENTS
    // ===============================

    const gameList = document.getElementById("game-list");
    const searchInput = document.getElementById("search");

    const yonoTab = document.getElementById("yono-tab");
    const othersTab = document.getElementById("others-tab");

    let allGames = [];
    let currentCategory = "yono";


    // ===============================
    // MESSAGE
    // ===============================

    function showMessage(message) {

        if (gameList) {
            gameList.innerHTML = `
                <div class="message">
                    ${message}
                </div>
            `;
        }

    }


    // ===============================
    // LOAD GAMES
    // ===============================

    async function loadGames() {

        console.log("Loading games...");

        showMessage("Loading games...");

        try {

            const { data, error } =
                await supabaseClient
                    .from("games")
                    .select("*")
                    .eq("is_visible", true)
                    .order("id", { ascending: true });


            if (error) {

                console.error("Supabase Error:", error);

                showMessage(
                    "Games load nahi ho rahe.<br><br>" +
                    "Error: " + error.message
                );

                return;
            }


            console.log("Games received:", data);

            allGames = data || [];

            renderGames();

        } catch (err) {

            console.error("Loading Error:", err);

            showMessage(
                "Games load karte waqt error aa gaya."
            );

        }

    }


    // ===============================
    // RENDER GAMES
    // ===============================

    function renderGames() {

        if (!gameList) return;


        const searchText =
            searchInput
                ? searchInput.value.toLowerCase().trim()
                : "";


        const filteredGames =
            allGames.filter(game => {

                const category =
                    String(game.category || "")
                        .toLowerCase()
                        .trim();


                const name =
                    String(game.name || "")
                        .toLowerCase();


                const categoryMatch =
                    category === currentCategory;


                const searchMatch =
                    name.includes(searchText);


                return categoryMatch && searchMatch;

            });


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
                .map(game => createGameCard(game))
                .join("");

    }


    // ===============================
    // GAME CARD
    // ===============================

    function createGameCard(game) {

        const name =
            String(game.name || "Game");


        const logo =
            String(game.logo_url || "").trim();


        const signupBonus =
            String(game.signup_bonus || "");


        const minimumWithdrawal =
            String(game.minimum_withdrawal || "");


        const rating =
            String(game.rating || "0");


        const size =
            String(game.size_mb || "");


        // IMPORTANT:
        // Database ke playstore_link column se
        // DIRECT link liya ja raha hai.

        const gameLink =
            String(game.playstore_link || "").trim();


        const logoHTML =
            logo
                ? `<img src="${logo}" alt="${name}" class="game-logo">`
                : `<div class="game-logo">🎮</div>`;


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
                        Minimum Withdrawal: ${minimumWithdrawal}
                    </div>

                </div>


                <div class="game-action">

                    <button
                        class="download-btn"
                        onclick="openGameLink('${escapeJS(gameLink)}')"
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


    // ===============================
    // OPEN GAME LINK
    // ===============================

    window.openGameLink = function(link) {

        link = String(link || "").trim();

        console.log("Opening game link:", link);


        if (!link) {

            alert("Is game ka download link available nahi hai.");

            return;
        }


        // Agar https:// nahi hai to add karo

        if (
            !link.startsWith("http://") &&
            !link.startsWith("https://")
        ) {

            link = "https://" + link;

        }


        // DIRECT LINK OPEN

        window.location.href = link;

    };


    // ===============================
    // ESCAPE LINK
    // ===============================

    function escapeJS(text) {

        return String(text)
            .replace(/\\/g, "\\\\")
            .replace(/'/g, "\\'")
            .replace(/"/g, '\\"')
            .replace(/\n/g, "\\n")
            .replace(/\r/g, "\\r");

    }


    // ===============================
    // YONO TAB
    // ===============================

    if (yonoTab) {

        yonoTab.addEventListener("click", function() {

            currentCategory = "yono";

            yonoTab.classList.add("active");

            if (othersTab) {
                othersTab.classList.remove("active");
            }

            renderGames();

        });

    }


    // ===============================
    // OTHERS TAB
    // ===============================

    if (othersTab) {

        othersTab.addEventListener("click", function() {

            currentCategory = "others";

            othersTab.classList.add("active");

            if (yonoTab) {
                yonoTab.classList.remove("active");
            }

            renderGames();

        });

    }


    // ===============================
    // SEARCH
    // ===============================

    if (searchInput) {

        searchInput.addEventListener("input", function() {

            renderGames();

        });

    }


    // ===============================
    // START
    // ===============================

    loadGames();

        }
