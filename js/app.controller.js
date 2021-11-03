import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'

export const mapController = {
    openModal,
    renderTable,
    onInit
}


window.onload = onInit;
window.onAddMarker = onAddMarker;
window.onPanTo = onPanTo;
window.onGetLocs = onGetLocs;
window.onGetUserPos = onGetUserPos;
window.searchPlace = searchPlace;
window.onDeleteLoc = onDeleteLoc;

var gMap = mapService.getGmap;
var gLocs = locService.getLocs();



function onInit() {
    mapService.initMap()
        .then(() => {
            let locs = locService.getFromStorage() || []
            renderTable(locs)
        })
        .catch(() => console.log('Error: cannot init map'));
}

// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
}

function onAddMarker(pos) {
    mapService.addMarker(pos);
}


function onGetLocs() {
    locService.getLocs()
        .then(locs => {
            console.log('Locations:', locs)
            document.querySelector('.locs').innerText = JSON.stringify(locs.placeName)
        })
}

function onGetUserPos() {
    getPosition()
        .then(pos => {
            console.log('User position is:', pos.coords);
            // document.querySelector('.user-pos').innerText =
                // `Latitude: ${pos.coords.latitude} - Longitude: ${pos.coords.longitude}`
            onPanTo(  pos.coords.latitude,pos.coords.longitude )
        })
        .catch(err => {
            console.log('err!!!', err);
        })
}

function onPanTo(lat, lng) {
    console.log(lat, lng);
    console.log('Panning the Map');
    mapService.panTo(lat, lng);
    searchWether(lat, lng)
}

function searchPlace(place) {
    const prm = axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${place}&key=AIzaSyCFnIgowG2QtJGmDQEiZIFnIBO8WTGwiOQ`)
        .then(res => {
            console.log('Axios Res:', res);
            onPanTo(res.data.results[0].geometry.location.lat,res.data.results[0].geometry.location.lng )
        })
        .catch(err => {
            console.log('Had issues talking to server', err);
        })

}
// searchWether({ lat: 29.526009, lng: 34.937586 })
function searchWether(lat,lng) {
    console.log(lat,lng);
    const prm = axios.get(`http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&APPID=fe6f1ecc454aff357abf6825e48cf1f7`)
        .then(res => {
            console.log('Axios Res:', res);
            renderWether(res)
        })
        .catch(err => {
            console.log('Had issues talking to server', err);
        })
    console.log(prm);
}



function openModal(pos) {
    console.log(pos);
    const prmUserAns = Swal.fire({
        title: 'You want save this place?',
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: 'Save',
        denyButtonText: `Don't save`,
    })
    prmUserAns.then((userAns) => {
        if (userAns.isConfirmed) {
            saveLocation(pos)
        } else if (userAns.isDenied) {
            Swal.fire('Place not saved', '', 'info')
        }
    })
}

function saveLocation(pos) {
    Swal.fire({
        title: 'Place Name?',
        input: 'text',
        inputAttributes: {
            autocapitalize: 'off'
        },
        showCancelButton: true,
        confirmButtonText: 'Save',
        showLoaderOnConfirm: true,
        preConfirm: (placeName) => {
            console.log(placeName);
            locService.creatLoc(placeName, pos)
        }
    })
}

function renderTable(locs) {
    let strHtml = locs.map(loc => {
        onAddMarker(loc.pos)
        return `
        <div class="card-loc">
    <ul>
    <li>Place name: ${loc.placeName}</li>
    <li>Lat: ${loc.pos.lat}</li>
    <li>Lng: ${loc.pos.lng}</li>
    <li>Created At:  ${loc.createdAt}</li>
    </ul>
    <button onclick="onPanTo('${loc.pos.lat}', '${loc.pos.lng}')" class="go-loc">GO</button>
    <button onclick="onDeleteLoc('${loc.id}')" class="delete-card">Delete</button>    
        </div>`
    }).join('')
    document.querySelector('.table-locs').innerHTML = strHtml
}

function renderWether(res) {
    console.log(res);
    var strHtml = `
<ul>
    <h2>country: ${res.data.sys.country}</h2>
    <li>name place: ${res.data.name}</li>
    <li>description: ${res.data.weather[0].description}</li>
    <li>wind: ${res.data.wind.speed}</li>
</ul>`
    document.querySelector('.Wether').innerHTML = strHtml
}

function onDeleteLoc(id) {
    locService.deleteLoc(id)
}


  