<!DOCTYPE html>
<html lang="en">

<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>YONO GAMES</title>

<style>

* {
    box-sizing: border-box;
}

html,
body {
    margin: 0;
    padding: 0;
    font-family: Arial, sans-serif;
    background:
        radial-gradient(circle at top, #08704b 0%, #03251a 45%, #01150e 100%);
    color: white;
    min-height: 100%;
}

body {
    padding-bottom: 30px;
}

/* HEADER */

.header {
    width: 100%;
    padding: 16px 14px;
    text-align: center;
    background: #063d2a;
    border-bottom: 1px solid #0d7650;
}

.header h1 {
    margin: 0;
    font-size: 27px;
    font-weight: 900;
    letter-spacing: 1px;
}

/* MENU */

.menu {
    display: flex;
    justify-content: center;
    gap: 10px;
    padding: 10px;
    background: #032c1e;
}

.menu button {
    border: none;
    border-radius: 8px;
    padding: 8px 13px;
    background: #0b543b;
    color: white;
    font-weight: bold;
    cursor: pointer;
}

/* SEARCH */

.search-box {
    padding: 12px;
}

.search-box input {
    width: 100%;
    padding: 13px 15px;
    border-radius: 10px;
    border: 1px solid #16865c;
    outline: none;
    background: #052f21;
    color: white;
    font-size: 15px;
}

.search-box input::placeholder {
    color: #9dbab0;
}

/* NEW LAUNCH */

.new-launch-section {
    padding: 5px 12px 12px;
}

.section-title {
    text-align: center;
    font-size: 19px;
    font-weight: 900;
    margin: 5px 0 10px;
}

.new-launch-card {
    width: 100%;
}

/* CATEGORY BUTTONS */

.category-buttons {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    padding: 0 12px 12px;
}

.category-buttons button {
    border: none;
    padding: 13px 8px;
    border-radius: 9px;
    background: #063d2a;
    color: white;
    font-size: 15px;
    font-weight: 900;
    border: 1px solid #0d7650;
    cursor: pointer;
}

.category-buttons button.active {
    background: #0b704d;
    box-shadow: 0 0 10px rgba(0, 255, 150, 0.25);
}

/* CATEGORY HEADING */

.category-heading {
    text-align: center;
    font-size: 18px;
    font-weight: 900;
    margin: 4px 12px 10px;
}

/* OTHERS EXTRA */

#others-extra {
    display: none;
}

/* BANNER */

.banner-section {
    width: calc(100% - 24px);
    margin: 0 12px 14px;
    aspect-ratio: 2.35 / 1;
    overflow: hidden;
    border-radius: 12px;
    position: relative;
    background: #021c13;
    border: 1px solid #0d7650;
}

.banner-slider {
    width: 100%;
    height: 100%;
    display: flex;
    transition: transform 0.7s ease-in-out;
}

.banner-slide {
    min-width: 100%;
    width: 100%;
    height: 100%;
    object-fit: cover;
    flex-shrink: 0;
}

/* TELEGRAM */

.telegram-section {
    text-align: center;
    padding: 5px 12px 15px;
}

.telegram-title {
    font-size: 18px;
    font-weight: 900;
    margin-bottom: 9px;
}

.telegram-button {
    display: inline-block;
    text-decoration: none;
    background: #0b704d;
    color: white;
    padding: 11px 22px;
    border-radius: 9px;
    font-weight: 900;
    border: 1px solid #159b69;
}

/* GAME LIST */

#game-list {
    padding: 0 12px;
}

/* GAME CARD */

.game-card {
    width: 100%;
    min-height: 145px;
    margin-bottom: 10px;
    padding: 10px;

    display: grid;
    grid-template-columns: 74px 1fr 82px;
    gap: 10px;
    align-items: center;

    background: linear-gradient(
        135deg,
        #0b543b,
        #063d2a
    );

    border: 1px solid #0d7650;
    border-radius: 12px;

    box-shadow: 0 4px 12px rgba(0,0,0,0.25);
}

/* LOGO */

.game-logo {
    width: 74px;
    height: 74px;
    border-radius: 14px;
    object-fit: cover;
    background: #022116;
}

/* GAME INFO */

.game-info {
    min-width: 0;
}

.game-name {
    font-size: 17px;
    font-weight: 900;
    margin-bottom: 8px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.signup-bonus {
    color: #ff4b4b;
    font-size: 14px;
    font-weight: 800;
    margin-bottom: 6px;
}

.minimum-withdrawal {
    color: white;
    font-size: 13px;
    font-weight: 700;
}

/* DOWNLOAD */

.download-area {
    text-align: center;
}

.download-button {
    display: inline-block;
    width: 82px;
    padding: 9px 4px;

    background: #0b704d;
    color: white;
    text-decoration: none;

    border-radius: 8px;
    border: 1px solid #159b69;

    font-size: 12px;
    font-weight: 900;
}

.rating {
    margin-top: 8px;
    font-size: 12px;
    font-weight: 800;
}

.size {
    margin-top: 4px;
    font-size: 11px;
    color: #c8ddd5;
}

/* MESSAGE */

.message {
    text-align: center;
    padding: 25px 10px;
    color: #c8ddd5;
    font-weight: bold;
}

/* OWNER */

.owner {
    text-align: center;
    margin-top: 20px;
    font-size: 12px;
    color: #91aaa1;
}

/* MOBILE */

@media (max-width: 380px) {

    .game-card {
        grid-template-columns: 65px 1fr 76px;
        gap: 7px;
        padding: 8px;
    }

    .game-logo {
        width: 65px;
        height: 65px;
    }

    .download-button {
        width: 76px;
    }

    .game-name {
        font-size: 15px;
    }
}

</style>
</head>

<body>

<!-- HEADER -->

<div class="header">
    <h1>YONO GAMES</h1>
</div>

<!-- MENU -->

<div class="menu">

    <button onclick="openMenu('home')">
        HOME
    </button>

    <button onclick="openMenu('telegram')">
        TELEGRAM
    </button>

    <button onclick="openMenu('contact')">
        CONTACT
    </button>

</div>

<!-- SEARCH -->

<div class="search-box">
    <input
        type="text"
        id="search-input"
        placeholder="Search games..."
        autocomplete="off"
    >
</div>

<!-- NEW LAUNCH
     SEARCH KE NICHE
     YONO / OTHERS KE UPAR -->

<section
    id="new-launch-section"
    class="new-launch-section"
>

    <div class="section-title">
        🆕 NEW LAUNCH
    </div>

    <div
        id="new-launch-card"
        class="new-launch-card"
    ></div>

</section>

<!-- YONO / OTHERS -->

<div class="category-buttons">

    <button
        id="yono-btn"
        class="active"
        onclick="showGames('yono')"
    >
        YONO GAMES
    </button>

    <button
        id="others-btn"
        onclick="showGames('others')"
    >
        OTHERS GAMES
    </button>

</div>


<!-- ========================= -->
<!-- OTHERS CONTENT -->
<!-- ========================= -->

<div id="others-extra">

    <div class="category-heading">
        OTHERS GAMES
    </div>

    <!-- AUTO SLIDER -->

    <div class="banner-section">

        <div
            id="banner-slider"
            class="banner-slider"
        >

            <img
                src="banner1.jpg"
                class="banner-slide"
                alt="Banner 1"
            >

            <img
                src="banner2.jpg"
                class="banner-slide"
                alt="Banner 2"
            >

            <img
                src="banner3.jpg"
                class="banner-slide"
                alt="Banner 3"
            >

            <img
                src="banner4.jpg"
                class="banner-slide"
                alt="Banner 4"
            >

            <img
                src="banner5.jpg"
                class="banner-slide"
                alt="Banner 5"
            >

        </div>

    </div>


    <!-- TELEGRAM -->

    <div class="telegram-section">

        <div class="telegram-title">
            JOIN TELEGRAM
        </div>

        <a
            href="#"
            class="telegram-button"
            id="telegram-button"
        >
            JOIN TELEGRAM
        </a>

    </div>


    <!-- OTHERS DOWNLOAD TITLE -->

    <div class="category-heading">
        DOWNLOAD NEW GAMES
    </div>

</div>


<!-- ========================= -->
<!-- YONO DOWNLOAD TITLE -->
<!-- ========================= -->

<div
    id="yono-download-title"
    class="category-heading"
>
    DOWNLOAD NEW YONO GAMES
</div>


<!-- GAME LIST -->

<div id="game-list">

    <div class="message">
        Loading games...
    </div>

</div>


<!-- OWNER -->

<div class="owner">
    © YONO GAMES
</div>


<!-- SUPABASE -->

<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

<!-- YOUR JS -->

<script src="script.js"></script>

</body>
</html>
