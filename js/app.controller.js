import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'
export const mapController = {
    openModal
}


window.onload = onInit;
window.onAddMarker = onAddMarker;
window.onPanTo = onPanTo;
window.onGetLocs = onGetLocs;
window.onGetUserPos = onGetUserPos;
window.searchPlace = searchPlace;

var gMap = mapService.getGmap;


function onInit() {
    mapService.initMap()
        .then(() => {
            console.log('Map is ready');
        })
        .catch(() => console.log('Error: cannot init map'));
}

// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
    console.log('Getting Pos');
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
}

function onAddMarker() {
    console.log('Adding a marker');
    mapService.addMarker({ lat: 32.0749831, lng: 34.9120554 });
}

function onGetLocs() {
    locService.getLocs()
        .then(locs => {
            console.log('Locations:', locs)
            document.querySelector('.locs').innerText = JSON.stringify(locs)
        })
}

function onGetUserPos() {
    getPosition()
        .then(pos => {
            console.log('User position is:', pos.coords);
            document.querySelector('.user-pos').innerText =
                `Latitude: ${pos.coords.latitude} - Longitude: ${pos.coords.longitude}`
        })
        .catch(err => {
            console.log('err!!!', err);
        })
}
function onPanTo() {
    console.log('Panning the Map');
    mapService.panTo(35.6895, 139.6917);
}

function searchPlace(place) {
    console.log(place);
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
            // Swal.fire('Saved!', '', 'success')
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