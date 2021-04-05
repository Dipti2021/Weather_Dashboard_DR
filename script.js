//declaring all the query selectors 
var weather_now=document.querySelector("#now_weather");
var select_city=document.querySelector("#city-search-form");
var enter_city=document.querySelector("#citysearch"); 
var fiveday_forecast = document.querySelector("#fiveday-container");
var find_city = document.querySelector("#searched-city");
var forecastTitle = document.querySelector("#forecast");
var old_search = document.querySelector("#old_buttons");
var entered_city = [];  

//enering all the data and storing the name of the city entered in local storage
var storage_func = function(){
  localStorage.setItem("entered_city", JSON.stringify(entered_city));
};

// generating the api key and using it to tetch the data from the open weather map
var weather_fetch = function(city){
  var apiKey = "080275865c09c4113e944693377074bf"
  var apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`

  fetch(apiURL)
  .then(function(response){
      response.json().then(function(data){
          weather_show(data, city);
      });
  });
};  

// function to enter a city name

var submit_func = function(event){    
    event.preventDefault();
    var city = enter_city.value.trim();
    if(city){
        weather_fetch(city); display_five(city); entered_city.unshift({city}); enter_city.value = "";
    } else{
        alert("Enter a city's name");
    }
    storage_func(); old_data(city);
}



// display the present day details

var weather_show = function(weather, searchCity){
   //delete any past data 
   weather_now.textContent= "";  find_city.textContent=searchCity;


 //creating and displaying the weather icon 
   var show_image = document.createElement("img")
   show_image.setAttribute("src", `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`);
   find_city.appendChild(show_image);

  //displaying the present day and date
   var today = document.createElement("span"); today.textContent=" (" + moment(weather.dt.value).format("MMM D, YYYY") + ") ";
   find_city.appendChild(today);


  //create a span element to hold temperature, humidity and wind values
   var show_temp = document.createElement("span");
   var show_humid = document.createElement("span");
   var show_wind = document.createElement("span");

   // display the content with its respective units
   show_temp.textContent = "Temperature: " + weather.main.temp + " °F";
   show_temp.classList = "together-item"
   show_humid.textContent = "Humidity: " + weather.main.humidity + " %";
   show_humid.classList = "together-item"
   show_wind.textContent = "Wind Speed: " + weather.wind.speed + " MPH";
   show_wind.classList = "together-item"

   //append the container with the values
   weather_now.appendChild(show_temp);weather_now.appendChild(show_humid);weather_now.appendChild(show_wind);
   // declare the values for lat and longitude
   var lat = weather.coord.lat; var lon = weather.coord.lon;
   UV_value(lat,lon);
}
// function for the api to find the lat and long to finalise the uv value
var UV_value = function(lat,lon){
    var apiKey = "844421298d794574c100e3409cee0499";
    var apiURL = `https://api.openweathermap.org/data/2.5/uvi?appid=${apiKey}&lat=${lat}&lon=${lon}`;
    fetch(apiURL)
    .then(function(response){
        response.json().then(function(data){
            UV_show(data);
           
        });
    });
}
 //depending on the uv value, display if its condition
var UV_show = function(index){
    var UV_new = document.createElement("div");
    UV_new.textContent = "UV Index: ";
    UV_new.classList = "together-item";

    uvIndex = document.createElement("span")
    uvIndex.textContent = index.value;

    if(index.value <3){
        uvIndex.classList = "favorable"
    }else if(index.value >2 && index.value<=8){
        uvIndex.classList = "moderate ";
    }
    else if(index.value >8){
        uvIndex.classList = "severe";
    };

    UV_new.appendChild(uvIndex);

    //append index to current weather
    weather_now.appendChild(UV_new);
}
 // function to display the value of 5 days' data
 // fetch the data using the API key
var display_five = function(city){
    var apiKey = "844421298d794574c100e3409cee0499";
    var apiURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${apiKey}`;

    fetch(apiURL)
    .then(function(response){
        response.json().then(function(data){
           show_five(data);
        });
    });
};

// function to show all the values for the 5 days
var show_five = function(weather){
    fiveday_forecast.textContent = ""
    forecastTitle.textContent = "Upcoming 5-Day Forecast:";

    var forecast = weather.list;
        for(var i=5; i < forecast.length; i=i+8){
       var dailyForecast = forecast[i];
        
       
       var new_forecast=document.createElement("div");
       new_forecast.classList = "card bg-primary text-light m-2";

       //console.log(dailyForecast)

       //create date, image, forcate temp and humidity elements
       var forecast_date = document.createElement("h5");
       var weather_img = document.createElement("img");
       var new_temp=document.createElement("span");
       var new_humid=document.createElement("span");



       forecast_date.textContent= moment.unix(dailyForecast.dt).format("MMM D, YYYY");
       forecast_date.classList = "card-header text-center"
       
       
       weather_img.classList = "card-body text-center";
       new_temp.classList = "card-body text-center";
       new_humid.classList = "card-body text-center";
       weather_img.setAttribute("src", `https://openweathermap.org/img/wn/${dailyForecast.weather[0].icon}@2x.png`);  

       //append the values
       new_forecast.appendChild(forecast_date);
       new_forecast.appendChild(weather_img);
       new_temp.textContent = dailyForecast.main.temp + " °F";
       new_forecast.appendChild(new_temp);
       new_humid.textContent = dailyForecast.main.humidity + "  %";
       new_forecast.appendChild(new_humid);

   
      //append to five day container
        fiveday_forecast.appendChild(new_forecast);
    }


}
var previous_search = function(event){
  var city = event.target.getAttribute("data-city")
  if(city){
      weather_fetch(city);
      display_five(city);
  }
}

select_city.addEventListener("submit", submit_func);
old_search.addEventListener("click", previous_search);

var old_data= function(old_data){
 
  

    find_old = document.createElement("button");
    find_old.textContent = old_data;
    find_old.classList = "d-flex w-100 btn-light border p-2";
    find_old.setAttribute("data-city",old_data)
    find_old.setAttribute("type", "submit");

    old_search.prepend(find_old);
}


