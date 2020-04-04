const url1 = "http://api.open-notify.org/iss-now.json"; //coordinates
const url2 = "http://api.open-notify.org/astros.json"; //people

let DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
let MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

let location_iss_is_now = document.getElementById("location_iss_is_now");
let curr_uts_time = document.getElementById("curr_uts_time");
let list_astronauts = document.getElementById("list_astronauts");
let total_amount = document.getElementById("total_amount");

async function initMap() {
  let myLatLng = (await getResponse(url1)).iss_position;
      myLatLng.lat = parseFloat(myLatLng.latitude);
      myLatLng.lng = parseFloat(myLatLng.longitude);

  let map = new google.maps.Map(document.getElementById('map'), {
    zoom: 5,
    center: myLatLng,
    mapTypeId: 'terrain',
    disableDefaultUI: true
  });

  let marker = new google.maps.Marker({
    position: myLatLng,
    map: map,
    title: 'is ISS',
    animation: google.maps.Animation.BOUNCE,
    icon: "images/iss1.png"
  });

  update(marker, map);
};


async function getResponse (url) {
  let response = await fetch(url);

  if (response.ok) { 
    let json = response.json();
    return json;
  } else {
    console.log(response.status);
    return {};
  };
};

function update(marker, map){

  getResponse(url2).then((data) => {

    let div_arr = data.people.reduce(function(result, item, index, array) {
      if(item.craft == "ISS"){
        let div = document.createElement("div");
        let p = document.createElement("p");
        div.className = "name";
        p.innerHTML = item.name;
        div.append(p);
        result.push(div);
      };
      return result;
    }, []);

    for(let div of div_arr){
      list_astronauts.append(div);
    };

    total_amount.innerHTML = `Total amount: ${div_arr.length} people on ISS`;
  });
  getResponse(url1).then((data) => {

  curr_uts_time.innerHTML = getFormatedDate(data.timestamp);
      location_iss_is_now.innerHTML = getFormatedLatLng(data.iss_position);
  });

  let interval = setInterval(() => {

    getResponse(url1).then((data) => {

      location_iss_is_now.innerHTML = getFormatedLatLng(data.iss_position);
      curr_uts_time.innerHTML = getFormatedDate(data.timestamp);
      data.iss_position.lat = parseFloat(data.iss_position.latitude);
      data.iss_position.lng = parseFloat(data.iss_position.longitude);
      map.setCenter(data.iss_position);
      marker.setPosition(data.iss_position); 
    });

  }, 5000);
};

function getFormatedDate(timestamp){

      let date = new Date(timestamp * 1000);
      console.log(date);

      let getTwoSymb = (str) => {
        str += "";
        str = str.length < 2 ? `0${str}`: str;
        return str;
      };

      let hrs_mnt_sec = [
        getTwoSymb( date.getHours() ), 
        getTwoSymb( date.getMinutes() ), 
        getTwoSymb( date.getSeconds() )
      ].join(":");

      return `<div>Current UTS time: ${hrs_mnt_sec}<br><i>${DAYS[date.getDay()]}, ${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}</i></div>`;
}

function getFormatedLatLng (position){

  return `<div>ISS is now located at:<br><i>latitude: ${position.latitude}, longitude:  ${position.longitude}</i></div>`; 
}
