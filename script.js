console.log("================================");
console.log("script.js STARTED");
console.log("================================");


const SUPABASE_URL =
    "https://srbvlfjthbkdixlwlcvz.supabase.co";


const SUPABASE_KEY =
    "sb_publishable_-pF6ErKu9TUaxnrXodt0cg_HP9uEY9m";


let supabaseClient = null;
let allGames = [];
let currentCategory = "yono";


const gameList =
    document.getElementById("game-list");

const searchInput =
    document.getElementById("search");

const yonoTab =
    document.getElementById("yono-tab");

const othersTab =
    document.getElementById("others-tab");


function showMessage(text) {

    if (!gameList) return;

    gameList.innerHTML = `
        <div class="message">
            ${text}
        </div>
    `;
}


/* ======================================
   CHECK SUPABASE
====================================== */

if (!window.supabase) {

    console.error(
        "Supabase library missing!"
    );

    showMessage(
        "Supabase library load nahi hui."
    );

} else {

    console.log(
        "Supabase library OK"
    );


    supabaseClient =
        window.supabase.createClient(
            SUPABASE_URL,
            SUPABASE_KEY
        );


    console.log(
        "Supabase client OK"
    );


    loadGames();
}


/* ======================================
   LOAD GAMES
====================================== */

async function loadGames() {

    console.log(
        "Requesting games..."
    );


    showMessage(
        "Loading games..."
    );


    try {

        const result =
            await supabaseClient
                .from("games")
                .select("*")
                .eq("is_visible", true);


        console.log(
            "Supabase result:",
            result
        );


        if (result.error) {

            console.error(
                "SUPABASE ERROR:",
                result.error
            );


            showMessage(
                "❌ Games load nahi ho rahe.<br><br>" +
                result.error.message
            );


            return;
        }


        allGames =
            result.data || [];


        console.log(
            "Games found:",
            allGames.length
        );


        if (allGames.length === 0) {

            showMessage(
                "Database se koi visible game nahi mila."
            );

            return;
        }


        renderGames();

    } catch (error) {

        console.error(
            "FETCH ERROR:",
            error
        );


        showMessage(
            "❌ Error:<br>" +
            error.message
        );
    }
}


/* ======================================
   RENDER
====================================== */

function renderGames() {

    const search =
        searchInput
            ? searchInput.value
                .trim()
                .toLowerCase()
            : "";


    const games =
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
                .toLowerCase();


            return (
                category === currentCategory &&
                name.includes(search)
            );

        });


    console.log(
        "Current category:",
        currentCategory
    );


    console.log(
        "Displaying:",
        games.length
    );


    if (games.length === 0) {

        showMessage(
            "Is category me koi game nahi hai."
        );

        return;
    }


    gameList.innerHTML =
        games.map(createCard).join("");
}


/* ======================================
   GAME CARD
====================================== */

function createCard(game) {

    const name =
        escapeHTML(
            game.name || "Game"
        );


    const bonus =
        escapeHTML(
            game.signup_bonus || ""
        );


    const withdrawal =
        escapeHTML(
            game.minimum_withdrawal || ""
        );


    const rating =
        escapeHTML(
            game.rating ?? ""
        );


    const size =
        escapeHTML(
            game.size_mb || ""
        );


    const logo =
        String(
            game.logo_url || ""
        ).trim();


    const link =
        String(
            game.playstore_link || ""
        ).trim();


    let logoHTML = "🎮";


    if (logo) {

        logoHTML = `
            <img
                src="${escapeAttribute(logo)}"
                class="game-logo"
                alt="${name}"
            >
        `;
    }


    return `
        <div class="game-card">

            <div class="game-logo-box">
                ${logoHTML}
            </div>


            <div>

                <div class="game-name">
                    ${name}
                </div>

                <div class="signup-bonus">
                    Sign Up Bonus: ${bonus}
                </div>

                <div class="minimum-withdrawal">
                    Minimum Withdrawal:
                    ${withdrawal}
                </div>

            </div>


            <div class="game-action">

                <button
                    class="download-btn"
                    onclick="openGame('${escapeJS(link)}')"
                >
                    ⇩<br>
                    Download
                </button>


                <div class="game-meta">
                    ★ ${rating}
                    |
                    ${size}
                </div>

            </div>

        </div>
    `;
}


/* ======================================
   OPEN LINK
====================================== */

window.openGame =
    function(link) {

        link =
            String(link || "").trim();


        if (!link) {

            alert(
                "Download link available nahi hai."
            );

            return;
        }


        if (
            !link.startsWith("http://") &&
            !link.startsWith("https://")
        ) {

            link =
                "https://" + link;
        }


        window.location.href =
            link;
    };


/* ======================================
   YONO
====================================== */

if (yonoTab) {

    yonoTab.onclick =
        function() {

            currentCategory =
                "yono";


            yonoTab.classList.add(
                "active"
            );


            othersTab.classList.remove(
                "active"
            );


            renderGames();
        };
}


/* ======================================
   OTHERS
====================================== */

if (othersTab) {

    othersTab.onclick =
        function() {

            currentCategory =
                "others";


            othersTab.classList.add(
                "active"
            );


            yonoTab.classList.remove(
                "active"
            );


            renderGames();
        };
}


/* ======================================
   SEARCH
====================================== */

if (searchInput) {

    searchInput.oninput =
        function() {

            renderGames();
        };
}


/* ======================================
   SECURITY
====================================== */

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


function escapeJS(value) {

    return String(value)
        .replace(/\\/g, "\\\\")
        .replace(/'/g, "\\'")
        .replace(/\n/g, "\\n")
        .replace(/\r/g, "\\r");
}
