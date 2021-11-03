export const locService = {
    getLocs,
    creatLoc
}
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
    console.log(locs);
}


function getLocs() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(locs);
        }, 2000)
    });
}


