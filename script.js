console.log("script.js started");

// ==========================================
// SUPABASE
// ==========================================

const SUPABASE_URL =
"https://srbvlfjthbkdixlwlcvz.supabase.co";

// ⚠️ IMPORTANT:
// sb_publishable_-pF6ErKu9TUaxnrXodt0cg_HP9uEY9m

const SUPABASE_KEY =
"sb_publishable_-pF6ErKu9TUaxnrXodt0cg_HP9uEY9m";

let supabaseClient = null;

// ==========================================
// CHECK SUPABASE
// ==========================================

if (!window.supabase) {

console.error("Supabase library load nahi hui.");

showMessage(
    "Supabase library load nahi hui."
);

} else {

supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );

console.log("Supabase connected.");

loadGames();

}

// ==========================================
// ELEMENTS
// ==========================================

const gameList =
document.getElementById("game-list");

const searchInput =
document.getElementById("search");

const yonoTab =
document.getElementById("yono-tab");

const othersTab =
document.getElementById("others-tab");

let allGames = [];

let currentCategory = "yono";

// ==========================================
// MESSAGE
// ==========================================

function showMessage(message) {

if (!gameList) return;

gameList.innerHTML = `
    <div class="message">
        ${message}
    </div>
`;

}

// ==========================================
// LOAD GAMES FROM SUPABASE
// ==========================================

async function loadGames() {

console.log("Loading games from Supabase...");

showMessage("Loading games...");


try {

    const result =
        await supabaseClient
            .from("games")
            .select(
                "id, created_at, name, logo_url, signup_bonus, minimum_withdrawal, rating, size_mb, playstore_link, is_visible, category"
            )
            .eq("is_visible", true)
            .order("id", {
                ascending: true
            });


    const data = result.data;
    const error = result.error;


    if (error) {

        console.error(
            "Supabase Error:",
            error
        );

        showMessage(
            "Games load nahi ho rahe.<br><br>" +
            "Supabase Error:<br>" +
            error.message
        );

        return;
    }


    console.log(
        "Games successfully loaded:",
        data
    );


    allGames = Array.isArray(data)
        ? data
        : [];


    renderGames();


} catch (error) {

    console.error(
        "Unexpected Error:",
        error
    );

    showMessage(
        "Games load nahi ho rahe.<br><br>" +
        "Error: " +
        error.message
    );
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


        const categoryMatch =
            category === currentCategory;


        const searchMatch =
            name.includes(searchText);


        return (
            categoryMatch &&
            searchMatch
        );
    });


console.log(
    "Current category:",
    currentCategory
);

console.log(
    "Games to display:",
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
        .map(createGameCard)
        .join("");

}

// ==========================================
// CREATE GAME CARD
// ==========================================

function createGameCard(game) {

const id =
    game.id;


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


// ======================================
// IMPORTANT:
// Link database ke playstore_link
// column se directly liya jayega.
// ======================================

const gameLink =
    String(
        game.playstore_link || ""
    ).trim();


let logoHTML;


if (logoURL) {

    logoHTML = `
        <img
            src="${escapeAttribute(logoURL)}"
            alt="${name}"
            class="game-logo"
            onerror="this.style.display='none'; this.parentElement.innerHTML='🎮';"
        >
    `;

} else {

    logoHTML = "🎮";
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

window.openGameLink =
function(link) {

    let finalLink =
        String(link || "").trim();


    console.log(
        "Game link:",
        finalLink
    );


    if (!finalLink) {

        alert(
            "Is game ka download link available nahi hai."
        );

        return;
    }


    // https:// missing ho to add karo

    if (
        !finalLink.startsWith("http://") &&
        !finalLink.startsWith("https://")
    ) {

        finalLink =
            "https://" + finalLink;
    }


    // EXACT DATABASE LINK OPEN

    window.location.assign(
        finalLink
    );
};

// ==========================================
// YONO TAB
// ==========================================

if (yonoTab) {

yonoTab.addEventListener(
    "click",
    function() {

        currentCategory =
            "yono";


        yonoTab.classList.add(
            "active"
        );


        if (othersTab) {

            othersTab.classList.remove(
                "active"
            );
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

        currentCategory =
            "others";


        othersTab.classList.add(
            "active"
        );


        if (yonoTab) {

            yonoTab.classList.remove(
                "active"
            );
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
// HTML SECURITY
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
