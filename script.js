console.log("SCRIPT.JS VERSION 9 LOADED");


/* =================================
   GAME LIST
================================= */

const gameList = document.getElementById("game-list");


/* =================================
   SUPABASE
================================= */

const SUPABASE_URL =
    "https://srbvlfjthbkdixlwlcvz.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_-pF6ErKu9TUaxnrXodt0cg_HP9uEY9m";

const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );


/* =================================
   VARIABLES
================================= */

let allGames = [];

let currentTab = "yono";

let searchText = "";


/* =================================
   MESSAGE
================================= */

function showMessage(message) {

    if (!gameList) return;

    gameList.innerHTML = `
        <div class="message">
            ${message}
        </div>
    `;
}


/* =================================
   ESCAPE HTML
================================= */

function escapeHTML(value) {

    if (
        value === null ||
        value === undefined
    ) {
        return "";
    }

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/* =================================
   LOAD GAMES
================================= */

async function loadGames() {

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


        console.log("SUPABASE DATA:", data);

        console.log("SUPABASE ERROR:", error);


        if (error) {

            console.error(error);

            showMessage(
                "Supabase Error: " +
                error.message
            );

            return;
        }


        allGames = data || [];


        renderGames();


    } catch (error) {

        console.error(error);

        showMessage(
            "Connection Error: " +
            error.message
        );
    }
}


/* =================================
   RENDER GAMES
================================= */

function renderGames() {

    if (!gameList) return;


    const filteredGames =
        allGames.filter(function(game) {


            /* CATEGORY */

            const category =
                String(
                    game.category || ""
                )
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


            /* SEARCH */

            const name =
                String(
                    game.name || ""
                )
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


    /* NO GAME */

    if (filteredGames.length === 0) {

        showMessage(
            "Is category me koi game nahi mila."
        );

        return;
    }


    gameList.innerHTML = "";


    /* CREATE CARDS */

    filteredGames.forEach(function(game) {


        const card =
            document.createElement("div");


        card.className =
            "game-card";


        /* =================================
           LOGO
        ================================= */

        const logoBox =
            document.createElement("div");

        logoBox.className = "logo";


        if (game.logo_url) {

            const img =
                document.createElement("img");

            img.src =
                String(game.logo_url).trim();

            img.alt =
                String(game.name || "Game");

            img.onerror =
                function() {

                    logoBox.innerHTML = "🎮";

                };

            logoBox.appendChild(img);

        } else {

            logoBox.textContent = "🎮";

        }


        /* =================================
           DETAILS
        ================================= */

        const details =
            document.createElement("div");

        details.className = "details";


        const gameName =
            document.createElement("div");

        gameName.className = "game-name";

        gameName.textContent =
            game.name || "Game";


        const signupBonus =
            document.createElement("div");

        signupBonus.className =
            "signup-bonus";

        signupBonus.textContent =
            "Sign Up Bonus: " +
            (game.signup_bonus || "N/A");


        const minimumWithdrawal =
            document.createElement("div");

        minimumWithdrawal.className =
            "minimum-withdrawal";

        minimumWithdrawal.textContent =
            "Minimum Withdrawal: " +
            (game.minimum_withdrawal || "N/A");


        details.appendChild(gameName);

        details.appendChild(signupBonus);

        details.appendChild(minimumWithdrawal);


        /* =================================
           RIGHT SIDE
        ================================= */

        const rightSide =
            document.createElement("div");

        rightSide.className =
            "right-side";


        /* =================================
           DOWNLOAD LINK
        ================================= */

        let gameLink =
            String(
                game.playstore_link || ""
            ).trim();


        console.log(
            "GAME:",
            game.name,
            "DATABASE LINK:",
            gameLink
        );


        /* Add HTTPS if missing */

        if (
            gameLink &&
            !gameLink.startsWith("http://") &&
            !gameLink.startsWith("https://")
        ) {

            gameLink =
                "https://" + gameLink;
        }


        /* =================================
           CREATE DOWNLOAD BUTTON
        ================================= */

        const downloadButton =
            document.createElement("a");


        downloadButton.className =
            "download";


        downloadButton.textContent =
            "⇩  Download";


        /*
           IMPORTANT:
           Link is assigned directly
           from Supabase.
        */

        if (gameLink) {

            downloadButton.href =
                gameLink;

        } else {

            downloadButton.href =
                "#";

            downloadButton.style.opacity =
                "0.5";

            downloadButton.style.cursor =
                "not-allowed";

            downloadButton.textContent =
                "⇩  Link Not Available";

            downloadButton.addEventListener(
                "click",
                function(event) {

                    event.preventDefault();

                }
            );
        }


        downloadButton.target =
            "_blank";


        downloadButton.rel =
            "noopener noreferrer";


        /* =================================
           RATING + SIZE
        ================================= */

        const basicInfo =
            document.createElement("div");

        basicInfo.className =
            "basic-info";


        const rating =
            document.createElement("span");

        rating.className =
            "rating";

        rating.innerHTML =
            `
            <span class="star">★</span>
            ${escapeHTML(
                game.rating ?? "N/A"
            )}
            `;


        const separator =
            document.createElement("span");

        separator.className =
            "separator";

        separator.textContent =
            "|";


        const size =
            document.createElement("span");

        size.className =
            "size";

        size.textContent =
            game.size_mb ?? "N/A";


        basicInfo.appendChild(rating);

        basicInfo.appendChild(separator);

        basicInfo.appendChild(size);


        /* =================================
           BUILD RIGHT SIDE
        ================================= */

        rightSide.appendChild(
            downloadButton
        );

        rightSide.appendChild(
            basicInfo
        );


        /* =================================
           BUILD CARD
        ================================= */

        card.appendChild(logoBox);

        card.appendChild(details);

        card.appendChild(rightSide);


        gameList.appendChild(card);

    });
}


/* =================================
   SEARCH
================================= */

const search =
    document.getElementById("search");


if (search) {

    search.addEventListener(
        "input",
        function(event) {

            searchText =
                event.target.value.trim();

            renderGames();

        }
    );
}


/* =================================
   YONO TAB
================================= */

const yonoTab =
    document.getElementById("yonoTab");


const otherTab =
    document.getElementById("otherTab");


if (yonoTab) {

    yonoTab.addEventListener(
        "click",
        function() {

            currentTab =
                "yono";

            yonoTab.classList.add(
                "active"
            );

            if (otherTab) {

                otherTab.classList.remove(
                    "active"
                );
            }

            renderGames();

        }
    );
}


/* =================================
   OTHERS TAB
================================= */

if (otherTab) {

    otherTab.addEventListener(
        "click",
        function() {

            currentTab =
                "others";

            otherTab.classList.add(
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


/* =================================
   START
================================= */

loadGames();
