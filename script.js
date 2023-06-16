const wrapper = document.querySelector(".wrapper");
const infoTxt = document.querySelector(".input-part .info-txt");
const inputField = document.querySelector(".input-part input");
const locationBtn = document.querySelector(".input-part button");

inputField.addEventListener("keyup", handleKeyUp);

function handleKeyUp(e) {
    const city = e.target.value;
    if (e.key === "Enter" && city !== "") {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=776aa84c1e95dacbaeefcaeed77a028b&units=metric&lang=de`
        fetchData(url);
    }
}

locationBtn.addEventListener("click", () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(handlePositionSuccess, handlePositionError);
    } else {
        alert("Dein Browser unterstützt die Geolocation API nicht.");
    }
});

function handlePositionSuccess(position) {
    const { latitude, longitude } = position.coords;
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=776aa84c1e95dacbaeefcaeed77a028b`
    fetchData(url);
}

function handlePositionError(err) {
    const infoTxt = document.querySelector(".info-txt");
    infoTxt.innerText = `Fehler: ${err.message}`;
    infoTxt.classList.add("error");
}

function fetchData(url) {
    infoTxt.innerText = "Getting weather details...";
    infoTxt.classList.add("pending");

    fetch(url)
        .then((res) => res.json())
        .then((result) => weatherDetails(result))
        .catch(() => {
            infoTxt.innerText = "Something went wrong";
            infoTxt.classList.replace("pending", "error");
        });
}

function weatherDetails(info) {
    if (info.cod == "404") {
        infoTxt.classList.replace("pending", "error");
        infoTxt.innerText = `${inputField.value} wurde nicht gefunden`;
    } else {
        wrapper.querySelector(".weather-part").innerHTML = `
        <img src="http://openweathermap.org/img/wn/${info.weather[0].icon}.png" alt="Wetter Icon" />
            <div class="temp">
                <span class="numb">${Math.floor(info.main.temp)}</span>
                <span class="deg">°</span>C
            </div>
        <div class="weather">${info.weather[0].description}</div>
        <div class="location">
            <i class="bx bx-map"></i>
            <span>${info.name}, ${info.sys.country}</span>
        </div>
        <div class="bottom-details">
            <div class="column feels">
                <i class="bx bxs-thermometer"></i>
                <div class="details">
                    <div class="temp">
                        <span class="numb-2">${Math.floor(info.main.feels_like)}</span>
                        <span class="deg">°</span>C
                    </div>
                    <p>Gefühlt</p>
                </div>
            </div>
            <div class="column humidity">
                <i class="bx bxs-droplet-half"></i>
                <div class="details">
                    <span>${info.main.humidity}%</span>
                    <p>Luftfeuchtigkeit</p>
                </div>
            </div>
        </div>`;

        infoTxt.classList.remove("pending", "error");
        infoTxt.innerText = "";
        inputField.value = "";
        wrapper.classList.add("active");
    }
}
