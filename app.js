//My api KEy: 69ca63bb29b1fe374c8b2d8bf46143f0

/* Part ! : Select Elements  */
const iconElement = document.querySelector('.weather-icon');
const temperatureElement = document.querySelector('.temperature-value p');
const descElement = document.querySelector('.temperature-description p');
const locationElement = document.querySelector('.location p');
const notificationElement = document.querySelector('.notification');
const conditionElement = document.querySelector('.condition');

/* Part " : App data" */
//We need to store the data in somewhere as an object 

/*  
Example for weather data object :
const weather = {
    temperature:{
        value:18,
        unit:"celsius"
    },
    description:"few clouds",
    iconID:"01d",
    city:"Düsseldorf",
    country:"Germany"
} */

const weather={};

//API is sharing data unit as Fahrenehit. That's why just for unit set default opition 
weather.temperature = {unit:"Celsius"};

/* Part 3 : App consts and vars */
//Converting to kelvin to Celsius 
const KELVIN = 273;
//API key
const key = "e3266d35830ccaa4856a7d4e25609536";

/*  Part 4 : check the browser if it's supports geolocation */
if ('geolocation'in navigator){//if the user geolocation is available in navigator browser
    //getCurrentPosition method has call back functions
    //1st one is "setPosition" : important, 2nd is showErro if there is any error we want to see what is the problem : optional
    navigator.geolocation.getCurrentPosition(setPosition, showError);
}else{
    //Notification is not visible to user unless the user get the error
    //notification is set in the css file as display none. so we need to change it display block if we get an error
    notificationElement.style.display = "block";
    //if geolocation is not available in browser, a below message will be shown
    notificationElement.innerHTML = "<p>Browser doesn't Support geolocation</p>";
}
/* Part 5 : set user'S position */
function setPosition (position){
    //setPosition is a call back function which has only one argument (posiiton)
    //Position: is an object which has below properties 

    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;
    //Above two arguments will be a function code for getWeather
    getWeather(latitude, longitude);
}

/* Part 6 : show error when there is an issue with the geolocation service */
function showError(error){//error is an object as well and it has two arguments (ID, Message)
    //notification is set in the css file as display none. so we need to change it display block if we get an error
    notificationElement.style.display = "block";
    //Show error message
    notificationElement.innerHTML = `<p>${error.message}</p>`;

}

/*  Part 7 : get weather datas from API provider */
//We use getWeather function to set the position
function getWeather (latitude, longitude){
    //Create API link
    let api = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}`;
    //Let's fetch the api
    //fetch uses promise infrastructure
    //So Fetch api returns to promise to us (then and catch)
    //If the result is positive, it is "then", if it is wrong, we use "Catch"

    fetch(api)
    //after finishing fetch, we will get response
    .then (function(response){
        //so we must first parse, what we get from the api
        let data = response.json();
        return data;
    })
    //after json parse is completed, then we can use data object 
    .then (function(data){
        //Because data is an object, we define path as an object
        //data.main.temp : get it and set to weather.temperature.value object
        //Before that, convert it to Celsius like (Number _ KeLVIN
        //we need to be sure it is an integer. So use math.floor
        
        //Temperature
        weather.temperature.value = Math.floor(data.main.temp - KELVIN);
        //descrption
        weather.description = data.weather[0].description;
        //icon
        weather.iconNumber = data.weather[0].icon;
        
        //name of the city
        weather.city = data.name;
        //name of the country
        weather.country =  data.sys.country;
        //
        weather.condition = data.weather[0].main;
    })
    //after we set the properties of weather  object, then we can display it by calling the function
    .then (function(){
        //we are changing the html
        displayWeather();
    })
}

/* Part 8 : Display weather to ui */

//Whenever I call this function, it will be updated in innerHTML 
    function displayWeather(){
        //change the icon depends on day/night and weather in html
        iconElement.innerHTML = `<img src="icons/${weather.iconNumber}.png"/>`;
        //change the value and unit in html
        temperatureElement.innerHTML = `${weather.temperature.value} °<span>C </span>`;
        //change the description in html
        descElement.innerHTML = weather.description;
        //Change the location in html
        locationElement.innerHTML = `${weather.city}, ${weather.country}`;

        conditionElement.innerHTML = weather.condition;
        document.querySelector("video").src = "./videos/" + weather.condition + ".mp4";
    }
/*  Part 9 : convert c to F / f to C */

function celsiusToFahrenheit(temperature){
    return (temperature * 9/5)+32;
}

//When the user clicks on the temperature element
temperatureElement.addEventListener("click",function(){
    if (weather.temperature.value=== undefined){return;}

    //if the unit is celsius, we need to convert to fahrenheit
    if(weather.temperature.unit == "Celsius"){
        let fahrenheit = celsiusToFahrenheit(weather.temperature.value);
        //to convert float to integer
        fahrenheit = Math.floor(fahrenheit);
        //Write the fahrenheit in html
        temperatureElement.innerHTML = `${fahrenheit} ° <span>F </span>`;
        //Do not forget to change the weather temp unit
        weather.temperature.unit  = "fahrenheit";
    }else{
        temperatureElement.innerHTML = `${weather.temperature.value}° <span>C </span>`;
        weather.temperature.unit = "Celsius";
    }
})