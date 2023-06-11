import axios from "axios";

const traerProductos = async ()=>{
    const {data}= await axios.get("https://pokeapi.co/api/v2/pokemon/ditto")
    return data
}