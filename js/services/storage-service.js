export const storageService = {
    load: loadFromStorage,
    save: saveToStorage,
    remove: removeFromStorage,
}



function saveToStorage(key, val) {
    localStorage.setItem(key, JSON.stringify(val))
}

function loadFromStorage(key) {
    var val = localStorage.getItem(key)
    return JSON.parse(val)
}

function removeFromStorage(key) {
    localStorage.removeItem(key)
}