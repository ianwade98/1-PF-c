const {Router} = require('express');
const router = Router();
const contenedor = require('../clase');
const prodList = ('./database/productos.json');

const isAdmin = true

function auth(req,res,next){
    if(!isAdmin){
        res.status(404).json({"error": "Funcion Habilitada solo para Administradores"})
    } else {
        next()
    }
}

router.get('/',async(req,res)=>{
	const data = new contenedor(prodList);
    let result = await data.getAll();
    result
    ? res.status(200).json({"success" : "Listado de productos",result})
    : res.status(404).json({"error": "Falla de la base de datos"})
})

router.get('/:id',async(req,res)=>{
	const data = new contenedor(prodList);
    const numId = req.params.id;
    let result = await data.getById(numId);
    result 
    ? res.status(200).json({"success" : "Producto Encontrado",result})
    : res.status(404).json({"error": "ID Inexistente"})
})

router.post('/',auth,async(req,res)=>{
    const data = new contenedor(prodList);
    const newProd = req.body;
    newProd.timestamp = Date.now();
    const propiedades = ["nombre","descripcion","foto","precio","stock"];
    const all = propiedades.every(prop => newProd.hasOwnProperty(prop));
    if (all){
        let result = await data.save(newProd);
        let [res1,resultado] = [result[0],result[1]];
        console.log(res1)
        res.status(200).json({"success" : "Producto Creado con ID "+res1,resultado})
    } else {
        res.status(404).json({"error": "Debe llenar las propiedades nombre, descripcion, foto, precio y stock"})
    }
})

router.put('/:id',auth,async(req,res)=>{
    const data = new contenedor(prodList);
    const numId = req.params.id;
    const newProd = req.body;
    const propiedades = ["nombre","descripcion","foto","precio","stock"];
    const all = propiedades.every(prop => newProd.hasOwnProperty(prop));
    if (all){
        let result = await data.updateById(numId,newProd);
        result 
        ? res.status(200).json({"success" : "Producto Actualizado",result})
        : res.status(404).json({"error": "ID no encontrado"})
    } else {
        res.status(404).json({"error": "Debe actualizar todas las propiedades nombre, descripcion, foto, precio y stock"})
    }   
})

router.delete('/:id',auth,async(req,res)=>{
	const data = new contenedor(prodList);
    const numId = req.params.id;
    let result = await data.deleteById(numId);
    result 
    ? res.status(200).json({"success" : "Producto Borrado",result})
    : res.status(404).json({"error": "ID no encontrado"})
})

module.exports=router