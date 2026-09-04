console.log("script.js started");

const gameList = document.getElementById("game-list");

const newLaunchSection =
    document.getElementById("new-launch-section");

const newLaunchCard =
    document.getElementById("new-launch-card");

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

    showMessage("Supabase library load nahi hui.");

} else {


    const SUPABASE_URL =
        "https://srbvlfjthbkdixlwlcvz.supabase.co";

    const SUPABASE_KEY =
        "sb_publishable_-pF6ErKu9TUaxnrXodt0cg_HP9uEY9m";


    const supabaseClient =
        window.supabase.createClient(
            SUPABASE_URL,
            SUPABASE_KEY
        );


    /* CREATE GAME CARD */

    function createGameCard(game) {

        const gameName =
            String(game.name || "Game");

        const logo =
            String(game.logo_url || "");

        const signupBonus =
            String(game.signup_bonus || "");

        const minimumWithdrawal =
            String(game.minimum_withdrawal || "");

        const rating =
            String(game.rating ?? "");

        const size =
            String(game.size_mb || "");

        let gameLink =
            String(game.playstore_link || "").trim();


        if (!gameLink) {
            gameLink = "#";
        }


        const card =
            document.createElement("div");

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

                    <span>
                        <span class="star">★</span>
                        ${rating}
                    </span>

                    <span class="separator">
                        |
                    </span>

                    <span>
                        ${size}
                    </span>

                </div>

            </div>

        `;


        return card;
    }


    /* NEW LAUNCH */

    function showNewLaunch() {

        if (!newLaunchSection || !newLaunchCard) {
            return;
        }


        const newLaunchGame =
            allGames.find(game => {

                return game.is_new_launch === true;

            });


        newLaunchCard.innerHTML = "";


        if (!newLaunchGame) {

            newLaunchSection.style.display = "none";

            return;

        }


        newLaunchSection.style.display = "block";


        const card =
            createGameCard(newLaunchGame);


        newLaunchCard.appendChild(card);

    }


    /* LOAD GAMES */

    async function loadGames() {

        showMessage("Loading games...");


        const { data, error } =
            await supabaseClient

                .from("Games")

                .select("*")

                .eq("is_visible", true)

                .order("id", {
                    ascending: true
                });


        if (error) {

            console.error(
                "Supabase Error:",
                error
            );

            showMessage(
                "Games load nahi ho rahe."
            );

            return;

        }


        allGames = data || [];


        /* SHOW NEW LAUNCH */

        showNewLaunch();


        /* SHOW NORMAL GAMES */

        showGames(currentCategory);

    }


    /* SHOW NORMAL GAMES */

    function showGames(category) {

        currentCategory = category;


        const yonoButton =
            document.getElementById("yono-btn");

        const othersButton =
            document.getElementById("others-btn");


        if (yonoButton && othersButton) {

            yonoButton.classList.remove("active");

            othersButton.classList.remove("active");


            if (category === "yono") {

                yonoButton.classList.add("active");

            }


            if (category === "others") {

                othersButton.classList.add("active");

            }

        }


        const games =
            allGames.filter(game => {

                const gameCategory =
                    String(game.category || "")
                        .trim()
                        .toLowerCase();


                return gameCategory === category;

            });


        if (games.length === 0) {

            showMessage(
                "Is category me abhi koi game nahi hai."
            );

            return;

        }


        gameList.innerHTML = "";


        games.forEach(game => {

            const card =
                createGameCard(game);

            gameList.appendChild(card);

        });

    }


    /* YONO BUTTON */

    const yonoButton =
        document.getElementById("yono-btn");


    if (yonoButton) {

        yonoButton.addEventListener(
            "click",
            () => {

                showGames("yono");

            }
        );

    }


    /* OTHERS BUTTON */

    const othersButton =
        document.getElementById("others-btn");


    if (othersButton) {

        othersButton.addEventListener(
            "click",
            () => {

                showGames("others");

            }
        );

    }


    /* SEARCH */

    const searchInput =
        document.getElementById("search");


    if (searchInput) {

        searchInput.addEventListener(
            "input",
            () => {

                const searchText =
                    searchInput.value
                        .trim()
                        .toLowerCase();


                const games =
                    allGames.filter(game => {

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

                    showMessage(
                        "Game nahi mila."
                    );

                    return;

                }


                gameList.innerHTML = "";


                games.forEach(game => {

                    const card =
                        createGameCard(game);

                    gameList.appendChild(card);

                });

            }
        );

    }


    /* LOAD */

    loadGames();

}


/* 3 DOT MENU */

const menuBtn =
    document.getElementById("menu-btn");

const menuBox =
    document.getElementById("menu-box");


if (menuBtn && menuBox) {

    menuBtn.addEventListener(
        "click",
        () => {

            menuBox.classList.toggle("show");

        }
    );

}
