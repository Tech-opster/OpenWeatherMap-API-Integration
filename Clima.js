document.querySelector('.search').addEventListener('submit', async (event) => {
    event.preventDefault();

    let input = document.querySelector('.searchInput').value;

    if(input !== '') {
        showWarning('Carregando...');

        let url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURI(input)},${encodeURI(input)}&appid=90e79c334be66ba7b94564b6411acdef&units=metric&lang=pt_br`

        let results = await fetch(url);
        let json = await results.json();

        if(json.cod === 200) {
            showInfo({
                name: json.name,
                country: json.sys.country,
                timezone: json.timezone,
                todayIcon: json.weather[0].icon,
                todayTemp: json.main.temp,
                todayMaxTemp: json.main.temp_max,
                todayMinTemp: json.main.temp_min,
                todayFeels: json.main.feels_like,
                todayClime: json.weather[0].description,
                sunrise: json.sys.sunrise,
                sunset: json.sys.sunset,
                windSpeed: json.wind.speed,
                windDeg: json.wind.deg,
                humidity: json.main.humidity,
                pressure: json.main.pressure
            });
        } else {
            clearInfo();
            document.querySelector('.cloud').classList.add('cloudError');
            document.querySelector('.lightning img').style.animationName = 'lightning';
            showWarning('Ops, não foi possível localizar a cidade.');
        } 
    }
});

function showInfo(json) {
    showWarning('');

    document.querySelector('.city').innerHTML = `${json.name}, ${json.country}`;
    document.querySelector('.date').innerHTML = `${json.timezone}`;
    document.querySelector('.icon').setAttribute('src', `https://openweathermap.org/img/wn/${json.todayIcon}@2x.png`);
    document.querySelector('.temp').innerHTML = `${json.todayTemp.toFixed(1)}ºC`;
    document.querySelector('.minMax strong').innerHTML = `${json.todayMaxTemp.toFixed(1)}º`;
    document.querySelector('.minMax span').innerHTML = `${json.todayMinTemp.toFixed(1)}º`;
    document.querySelector('.feels strong').innerHTML = `${json.todayFeels.toFixed(1)}º`;
    document.querySelector('.clime').innerHTML = `${json.todayClime}`;
    document.querySelector('.sunrise').innerHTML = `${json.sunrise}`;
    document.querySelector('.sunset').innerHTML = `${json.sunset}`;
    document.querySelector('.windSpeed').innerHTML = `${json.windSpeed} Km/h`;
    document.querySelector('.windPointer').style.transform = `rotate(${json.windDeg - 90}deg)`;
    document.querySelector('.humidity').innerHTML = `${json.humidity}%`;
    document.querySelector('.pressure').innerHTML = `${json.pressure} mb`;
    
    document.querySelector('.loading').style.display = 'none';
    document.querySelector('.container').style.opacity = '0';

    document.querySelector('.searchResults').style.display = 'flex';
    document.querySelector('.nextDaysTitle').style.display = 'flex';
    document.querySelector('.weatherNextDays').style.display = 'flex';

    setTimeout (() => {
        document.querySelector('.container').style.transition = 'all ease 1s';
        document.querySelector('.container').style.opacity = '1';

        setTimeout(() => {
            document.querySelector('.container').style.transition = '';
        }, 1001);
    }, 1)
    
    showNextDays();
};

function showNextDays () {
    const nextDaysElements = document.querySelectorAll('.days');
    nextDaysElements.forEach(days => {
        days.style.opacity = '0';
    });

    let wait = 0;

    for (let i = 0; i < nextDaysElements.length; i++) {
        setTimeout(() => {
            nextDaysElements[i].style.transition = 'all ease 1s';
            nextDaysElements[i].style.opacity = '1';
        }, wait);

        wait += 250;
    }
};

function showWarning(msg) {
    document.querySelector('.warning').innerHTML = msg;
};

function clearInfo() {
    document.querySelector('.loading').style.opacity = '0';

    setTimeout (() => {
        document.querySelector('.container').style.transition = 'all ease 0.1s';
        document.querySelector('.container').style.opacity = '0';
        
        setTimeout (() => {
            document.querySelector('.searchResults').style.display = 'none';
            document.querySelector('.nextDaysTitle').style.display = 'none';
            document.querySelector('.weatherNextDays').style.display = 'none';

            document.querySelector('.container').style.opacity = '1';

            document.querySelector('.loading').style.display = 'flex';
            document.querySelector('.loading').style.transition = 'all ease 0.1s';
            document.querySelector('.loading').style.opacity = '1';

            setTimeout(() => {
                document.querySelector('.container').style.transition = '';
            }, 101);
        }, 100)
    }, 1)
};