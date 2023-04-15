const express = require('express');
const fs = require('fs');


const PORT = 8080;
const server = express();
//server.use(express.json);
server.use(express.urlencoded({extended:true}));
const usuarios = [

    {id:1,nombre:'Pablo',apellido:'Ambrosio',edad:31,correo:'dirkans@hotmail.com'}

]


server.listen(PORT,()=>{
    
    console.log(`Running ok on port ${PORT}`)
})



class ProductManager{
    static lastId = 0;
    constructor(path){
        this.path = path;
        this.arr = [];        
    }

addProduct = async(title,description,price,thumbnail,code,stock)=>{
    if (this.arr.some(product => product.code === code)) {
        console.log("Ese código ya existe");} else {
    const newProduct = 
            {
        id: ++ProductManager.lastId,
        title:title,
        description:description,
        price:price,
        thumbnail:thumbnail,
        code:code,
        stock:stock
    }
    this.arr.push(newProduct)
    const cadenaProd = JSON.stringify(this.arr);
    await fs.promises.writeFile(this.path,cadenaProd)
}}

 getProducts = async () => {
    const datos = await fs.promises.readFile(this.path,'utf-8');
    const datosObj = JSON.parse(datos);
    return(datosObj)   
}

getProductById = async(id) => {
    const datos = await fs.promises.readFile(this.path,'utf-8');
    const datosObj = JSON.parse(datos);
    const product = datosObj.find(product => product.id === id);
    if (product) {
      return(product)
        //console.log("El producto es:", product);
    } else {
      return(`ID ${id} Not found`);
    }
  }

updateProduct = async(id,field,nuevo) => {
    const datos = await fs.promises.readFile(this.path,'utf-8');
    const datosObj = JSON.parse(datos);
    
    const product = datosObj.find(product => product.id === id);
    
    if (product) {
        const datoAnterior = product[field] //Se almacena el campo antes de modificarlo, para luego poder mostrar en consola cuál fue el cambio realizado.
        const indexBuscado = datosObj.indexOf(product) //Sabemos que index es el producto        
        product[field] = nuevo; //Se reemplaza el campo deseado por el nuevo pasado como parámetro
        datosObj.splice(indexBuscado,1,product) // Se reemplaza en el array original el objeto modificado
        const datosObjNewStringuiseado = JSON.stringify(datosObj); //Se convierte a string
        await fs.promises.writeFile(this.path,datosObjNewStringuiseado) // se escribe el nuevo JSON
        console.log(`Se ha cambiado el ${field} de ${datoAnterior} por ${nuevo}`) //Se informa el cambio realizado



    } else {
      console.log("ID Not found");
    }
}

deleteProduct = async(id) => {

    const datos = await fs.promises.readFile(this.path,'utf-8');
    const datosObj = JSON.parse(datos);
    const product = datosObj.find(product => product.id === id);

    if(product){
    const indexBuscado = datosObj.indexOf(product) //Sabemos que index es el producto
    datosObj.splice(indexBuscado,1) //Se elimina el producto del array original
    
    const datosObjNewStringuiseado = JSON.stringify(datosObj); //Se convierte a string
    await fs.promises.writeFile(this.path,datosObjNewStringuiseado) //Se escribe el nuevo JSON
    console.log('El producto fue eliminado correctamente') //Mensaje informativo
    }


    else
    {console.log('Cannot delete, ID not found')}
}

}
const manager = new ProductManager('./prods.json');



server.get('/products',async(req,res)=>{
    const prods = await manager.getProducts();
    if(!req.query.limit){
        res.send(prods)
    } else {
        const prodsLimitado = prods.slice(0,(req.query.limit))
        res.send(prodsLimitado)
    }
});
    

server.get('/product/:pid',async(req,res)=>{
    const idNum = parseInt(req.params.pid) 
    const prod = await manager.getProductById(idNum);
    res.send(prod)
});



    
server.get('/usuarios',(req,res)=>{
    
    res.send(usuarios)
})


server.get('/usuario/:id_usuario',(req,res)=>{
    res.send(usuarios[0])
})

server.post('/usuario',(req,res)=>{
    res.send('Endpoint alcanzado')
    console.log(req.body)
})