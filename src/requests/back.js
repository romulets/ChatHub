import Axios from "axios";

console.log(window.location)

var baseURL

if (window.location.hostname === 'localhost') {
    baseURL = 'http://localhost:3100'
} else {
    baseURL = 'http://localhost:3100'
}

export default Axios.create({ baseURL })