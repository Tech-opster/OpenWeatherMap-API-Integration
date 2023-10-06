document.querySelector('.search').addEventListener('submit', async (event) => {
    event.preventDefault();

    let input = document.querySelector('.searchInput').value;
    let currentData;

    if(input !== '') {
        showWarning('Carregando...');

        const currentURL = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURI(input)}&appid=90e79c334be66ba7b94564b6411acdef&units=metric&lang=pt_br`;
        const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURI(input)}&appid=90e79c334be66ba7b94564b6411acdef&units=metric&lang=pt_br`;

        try {
            const [currentURLResponse, forecastURLResponse] = await Promise.all([
                fetch(currentURL),
                fetch(forecastURL)
            ]);

            currentData = await currentURLResponse.json();
            const forecastData = await forecastURLResponse.json();

            const dtList = forecastData.list;
            let dtDate = [];

            for (i = 0; i < dtList.length; i++) {
                dtDate.push(dtList[i]);
            }

            function groupForecastsByDay(dtDate) {
                const forecastsByDay = {};
                
                for (const forecast of dtDate) {
                    const date = new Date(forecast.dt * 1000);
                    const day = date.toISOString().split('T')[0];
                
                    if (!forecastsByDay[day]) {
                        forecastsByDay[day] = [];
                    }
                
                    forecastsByDay[day].push(forecast);
                }
                
                return forecastsByDay;
                }
                
            const forecastsByDay = groupForecastsByDay(dtDate);
            const indexDays = Object.values(forecastsByDay);
            console.log(indexDays)

            for (i = 1; i < 5; i++) {
                const date = new Date(indexDays[i][1].dt * 1000);
                
                const weekday = new Intl.DateTimeFormat('pt-br', {weekday: 'short'}).format(date);
                const day = new Intl.DateTimeFormat('pt-br', {day: 'numeric'}).format(date);
                
                const dateFormat = `${weekday} ${day}`;

                document.querySelector(".day"+(i)+"date").innerHTML = dateFormat.charAt(0).toUpperCase() + dateFormat.slice(1);
                document.querySelector(".day"+(i)+"img").setAttribute('src', `https://openweathermap.org/img/wn/${indexDays[i][0].weather[0].icon.slice(0, 2)}d@2x.png`);
                document.querySelector(".day"+(i)+"max").innerHTML = `${Number(indexDays[i][0].main.temp_max).toFixed(1)}º`;
                document.querySelector(".day"+(i)+"min").innerHTML = `${Number(indexDays[i][0].main.temp_min).toFixed(1)}º`;
                document.querySelector(".day"+(i)+"desc").innerHTML = `${indexDays[i][0].weather[0].description.charAt(0).toUpperCase() + indexDays[i][0].weather[0].description.slice(1)}`;
            }
        } catch(error) {
            console.error("Ops, algo deu errado:", error);
        }

        if(currentData.cod === 200) {
            showInfo({
                name: currentData.name,
                country: currentData.sys.country,
                dt: currentData.dt,
                timezone: currentData.timezone,
                todayIcon: currentData.weather[0].icon,
                todayTemp: currentData.main.temp,
                todayMaxTemp: currentData.main.temp_max,
                todayMinTemp: currentData.main.temp_min,
                todayFeels: currentData.main.feels_like,
                todayClime: currentData.weather[0].description,
                sunrise: currentData.sys.sunrise,
                sunset: currentData.sys.sunset,
                windSpeed: currentData.wind.speed,
                windDeg: currentData.wind.deg,
                humidity: currentData.main.humidity,
                pressure: currentData.main.pressure
            });
        } else {
            clearInfo();
            document.querySelector('.cloud').classList.add('cloudError');
            document.querySelector('.lightning img').style.animationName = 'lightning';
            showWarning('Ops, não foi possível localizar a cidade.');
        }
    }
});

function showInfo(currentData) {
    showWarning('');

    let myLocalDate = new Date();
    let myLocalDateTimeZone = myLocalDate.getTimezoneOffset() * 60;

    let date = new Date((currentData.dt + currentData.timezone + myLocalDateTimeZone) * 1000);

    let dateSunrise = new Date((currentData.sunrise + currentData.timezone + myLocalDateTimeZone) * 1000);
    let dateSunset = new Date((currentData.sunset + currentData.timezone + myLocalDateTimeZone) * 1000);

    let clock = {
        hour: 'numeric',
        minute: 'numeric'
    };
    
    const weekday = new Intl.DateTimeFormat('pt-br', {weekday: 'short'}).format(date);
    const day = new Intl.DateTimeFormat('pt-br', {day: 'numeric'}).format(date);
    const month = new Intl.DateTimeFormat('pt-br', {month: 'short'}).format(date);
    const hour = new Intl.DateTimeFormat('pt-br', clock).format(date);
    
    const dateFormat = `${weekday} ${day} ${month} ${hour}`;

    const hourSunrise = new Intl.DateTimeFormat('pt-br', clock).format(dateSunrise);
    const hourSunset = new Intl.DateTimeFormat('pt-br', clock).format(dateSunset);

    if (parseInt(hour) >= 5 && parseInt(hour) < 9) {
        document.querySelector('body').style.backgroundImage = 'linear-gradient(120deg, #f6d365 0%, #fda085 100%)';
    } else if (parseInt(hour) >= 9 && parseInt(hour) < 16){
        document.querySelector('body').style.backgroundImage = 'linear-gradient(to top, #48c6ef 0%, #6f86d6 100%)';
    } else if (parseInt(hour) >= 16 && parseInt(hour) < 19) {
        document.querySelector('body').style.backgroundImage = 'linear-gradient(to right, #fa709a 0%, #fee140 100%)';
    } else if (parseInt(hour) >= 19 || parseInt(hour) < 5) {
        document.querySelector('body').style.backgroundImage = 'linear-gradient(-20deg, #2b5876 0%, #4e4376 100%)';
    }

    document.querySelector('.city').innerHTML = `${currentData.name}, ${currentData.country}`;
    document.querySelector('.date').innerHTML = dateFormat;
    document.querySelector('.icon').setAttribute('src', `https://openweathermap.org/img/wn/${currentData.todayIcon}@2x.png`);
    document.querySelector('.temp').innerHTML = `${currentData.todayTemp.toFixed(1)}ºC`;
    document.querySelector('.minMax strong').innerHTML = `${currentData.todayMaxTemp.toFixed(1)}º`;
    document.querySelector('.minMax span').innerHTML = `${currentData.todayMinTemp.toFixed(1)}º`;
    document.querySelector('.feels strong').innerHTML = `${currentData.todayFeels.toFixed(1)}º`;
    document.querySelector('.clime').innerHTML = currentData.todayClime.charAt(0).toUpperCase() + currentData.todayClime.slice(1);
    document.querySelector('.sunrise').innerHTML = hourSunrise;
    document.querySelector('.sunset').innerHTML = hourSunset;
    document.querySelector('.windSpeed').innerHTML = `${currentData.windSpeed} Km/h`;
    document.querySelector('.windPointer').style.transform = `rotate(${currentData.windDeg - 90}deg)`;
    document.querySelector('.humidity').innerHTML = `${currentData.humidity}%`;
    document.querySelector('.pressure').innerHTML = `${currentData.pressure} mb`;
    
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
            setTimeout(() => {
                nextDaysElements[i].style.transition = '';
            }, 1001)
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