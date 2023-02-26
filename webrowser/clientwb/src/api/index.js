import axios from 'axios'

const server = "http://localhost:8000/"
export default {
    get_list: () =>{
        return axios.get(server+"get_list");
    }

}