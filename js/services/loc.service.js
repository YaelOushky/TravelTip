import { mapController } from '../app.controller.js'
import { storageService } from './storage-service.js'

export const locService = {
    getLocs,
    creatLoc,
    getFromStorage,
    deleteLoc,
}

const KEY = 'location'
let gId = 101
var locs = []


function creatLoc(placeName, pos) {

    let loc = {
        id: makeId(),
        placeName,
        pos,
        createdAt: Date.now(),
        updatedAt: Date.now(),
    }
    locs = getFromStorage() || []
    console.log(locs);
    locs.push(loc)

    // locs[[locs.length - 1].id] = loc
    storageService.save(KEY, locs)
    console.log(locs);
    mapController.renderTable(locs)
}

function deleteLoc(id) {
    locs = getFromStorage() || []
    var loc = locs.findIndex(loc => {
        console.log(loc.id);
        return loc.id === id
    })
    locs.splice(loc, 1)
    storageService.save(KEY, locs)
    // mapController.renderTable(locs)
    mapController.onInit()
}

function getLocs() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(locs);
        }, 2000)
    });
}

function getFromStorage() {
    return storageService.load(KEY)
}



function makeId(length = 3) {
    var txt = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return txt;
}
