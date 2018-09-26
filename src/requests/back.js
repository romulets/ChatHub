import Axios from "axios";

var baseURL

if (window.location.hostname === 'localhost') {
    baseURL = 'http://localhost:3100'
} else {
    baseURL = 'https://chathub-217311.appspot.com/'
}

export default Axios.create({ baseURL })