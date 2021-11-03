import { mapController } from '../app.controller.js'
import { storageService } from './storage-service.js'

export const locService = {
    getLocs,
    creatLoc,
    getFromStorage,
}

const KEY = 'location'
let gId = 101
const locs = []


function creatLoc(placeName, pos) {
    let loc = {
        id: gId++,
        placeName,
        pos,
        createdAt: Date.now(),
        updatedAt: Date.now(),
    }
    locs.push(loc)

    locs[[locs.length - 1].id] = loc
    // console.log();
    storageService.save(KEY, locs)
    mapController.renderTable(locs)
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