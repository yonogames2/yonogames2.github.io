console.log("LINK TEST VERSION LOADED");

const gameList = document.getElementById("game-list");

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

        console.log("DATABASE DATA:", data);
        console.log("DATABASE ERROR:", error);

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

        console.error(error);

        showMessage(
            "Connection Error: " +
            error.message
        );
    }
}


/* =================================
   RENDER
================================= */

function renderGames() {

    if (!gameList) return;

    const filteredGames =
        allGames.filter(function(game) {

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


    if (filteredGames.length === 0) {

        showMessage(
            "Is category me koi game nahi mila."
        );

        return;
    }


    gameList.innerHTML = "";


    filteredGames.forEach(function(game) {

        const card =
            document.createElement("div");

        card.className =
            "game-card";


        /* =================================
           LOGO
        ================================= */

        const logo =
            document.createElement("div");

        logo.className = "logo";


        if (game.logo_url) {

            const img =
                document.createElement("img");

            img.src =
                String(game.logo_url).trim();

            img.alt =
                game.name || "Game";

            img.onerror =
                function() {

                    logo.innerHTML = "🎮";

                };

            logo.appendChild(img);

        } else {

            logo.textContent = "🎮";

        }


        /* =================================
           DETAILS
        ================================= */

        const details =
            document.createElement("div");

        details.className = "details";


        const name =
            document.createElement("div");

        name.className = "game-name";

        name.textContent =
            game.name || "Game";


        const bonus =
            document.createElement("div");

        bonus.className =
            "signup-bonus";

        bonus.textContent =
            "Sign Up Bonus: " +
            (game.signup_bonus || "N/A");


        const withdrawal =
            document.createElement("div");

        withdrawal.className =
            "minimum-withdrawal";

        withdrawal.textContent =
            "Minimum Withdrawal: " +
            (game.minimum_withdrawal || "N/A");


        details.appendChild(name);
        details.appendChild(bonus);
        details.appendChild(withdrawal);


        /* =================================
           RIGHT SIDE
        ================================= */

        const right =
            document.createElement("div");

        right.className =
            "right-side";


        /* =================================
           DATABASE LINK
        ================================= */

        let gameLink =
            String(
                game.playstore_link || ""
            ).trim();


        console.log(
            "GAME NAME:",
            game.name
        );

        console.log(
            "PLAYSTORE_LINK VALUE:",
            game.playstore_link
        );

        console.log(
            "FINAL GAME LINK:",
            gameLink
        );


        /* =================================
           DOWNLOAD BUTTON
        ================================= */

        const download =
            document.createElement("a");

        download.className =
            "download";


        if (gameLink) {

            download.href =
                gameLink;

            download.target =
                "_blank";

            download.rel =
                "noopener noreferrer";

            download.textContent =
                "⇩  Download";

        } else {

            download.href = "#";

            download.textContent =
                "⇩  Link Not Available";

            download.style.opacity =
                "0.5";

            download.addEventListener(
                "click",
                function(event) {

                    event.preventDefault();

                }
            );
        }


        /* =================================
           SHOW DATABASE LINK
        ================================= */

        const linkDisplay =
            document.createElement("div");

        linkDisplay.style.cssText = `
            margin-top: 6px;
            font-size: 11px;
            color: #ffffff;
            word-break: break-all;
            text-align: center;
            opacity: 0.9;
        `;


        linkDisplay.textContent =
            "Database Link: " +
            (
                gameLink ||
                "EMPTY"
            );


        /* =================================
           RATING + SIZE
        ================================= */

        const info =
            document.createElement("div");

        info.className =
            "basic-info";


        const rating =
            document.createElement("span");

        rating.className =
            "rating";

        rating.innerHTML =
            `
            <span class="star">★</span>
            ${game.rating ?? "N/A"}
            `;


        const separator =
            document.createElement("span");

        separator.className =
            "separator";

        separator.textContent = "|";


        const size =
            document.createElement("span");

        size.className = "size";

        size.textContent =
            game.size_mb ?? "N/A";


        info.appendChild(rating);
        info.appendChild(separator);
        info.appendChild(size);


        /* =================================
           BUILD
        ================================= */

        right.appendChild(download);

        right.appendChild(linkDisplay);

        right.appendChild(info);


        card.appendChild(logo);

        card.appendChild(details);

        card.appendChild(right);


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

            currentTab = "yono";

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

            currentTab = "others";

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
