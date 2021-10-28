require('dotenv').config();
key = process.env.API_KEY;


const container = document.querySelector(".container"),
inputPart = container.querySelector(".input-part"),
infoTxt = inputPart.querySelector(".info-txt"),
inputField = inputPart.querySelector("input"),
locationBtn = inputPart.querySelector("button"),
img = document.querySelector(".pollution-part img");

inputField.addEventListener("keyup", e => {
    //if user pressed enter btn and input value is not empty
    if(e.key == "Enter" && inputField.value != ""){
        requestApi(inputField.value);
    }
});

locationBtn.addEventListener("click", ()=>{
    if(navigator.geolocation){  //if support geolocation api
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    } else{
        alert("Your browser not support geolocation api");
    }
});
let api;

function onSuccess(position){
    infoTxt.innerText = "Getting pollution details...";
    infoTxt.classList.add("pending");
    const {latitude, longitude} = position.coords;
    api = `https://api.waqi.info/feed/geo:${latitude};${longitude}/?token=${key}`;
    fetchData();
}

function onError(error){
    infoTxt.innerText = error.message;
    infoTxt.classList.add("error");
}



function requestApi(city){
    api=`https://api.waqi.info/feed/${city}/?token=${key}`;
    fetchData();
    
}

function fetchData(){
    infoTxt.innerText = "Getting pollution details...";
    infoTxt.classList.add("pending");
    fetch(api).then(response=>response.json()).then(result => pollutionDetails(result));
}

function pollutionDetails(info){
    if(info.status == "error"){
        infoTxt.innerText = `${inputField.value} isn't a valid city name`;
        infoTxt.classList.replace("pending","error");
    }else{
        const city = info.data.city.name;
        const aqi = info.data.aqi;

        if(aqi < 50){
            document.querySelector(".grade-name").innerText = "Good";
            document.querySelector(".grade-name").style.color = "green";
            img.src = "/assets/img/good.svg";
            
        } else if( aqi < 100){
            document.querySelector(".grade-name").innerText = "Moderate";
            document.querySelector(".grade-name").style.color = "#D8CB0D";
            img.src = "/assets/img/moderate.svg";
        } else if(aqi < 150){
            document.querySelector(".grade-name").innerText = "Unhealty for sensitive person";
            document.querySelector(".grade-name").style.color = "orange";
            img.src = "/assets/img/sensitive.svg";
        } else if(aqi < 200){
            document.querySelector(".grade-name").innerText = "Unhealty";
            document.querySelector(".grade-name").style.color = "red";
            img.src = "/assets/img/unhealty.svg";
        } else if(aqi < 300){
            document.querySelector(".grade-name").innerText = "Very Unhealty";
            document.querySelector(".grade-name").style.color = "purple";
            img.src = "/assets/img/veryhunealty.svg";
        } else if(aqi >=300){
            document.querySelector(".grade-name").innerText = "Hazardous";
            document.querySelector(".grade-name").style.color = "white";
            document.querySelector(".grade-name").style.backgroundColor = "black";
            img.src = "/assets/img/hazardous.svg";
        } 

        container.querySelector(".grade .num").innerText = aqi;
        container.querySelector(".location span").innerText = city;

        infoTxt.classList.remove("pending", "error");
        container.classList.add("active");
        
    }
    
}

document.querySelector(".container header i").addEventListener("click",()=> {
    container.classList.remove("active");
    inputField.value ="";
})