const {Router} = require('express');
const router = Router();
const contenedor = require('../clase');
const cartList = ('./database/carrito.json');
const prodList = ('./database/productos.json');

router.post('/',async(req,res)=>{
    const data = new contenedor(cartList);
    const {body} = req;
    body.timestamp = Date.now();
    let result = await data.createCart(body);
    res.status(200).json({"success" : "Carrito creado con ID "+ result})
})

router.delete('/:id',async(req,res)=>{
	const dataCart = new contenedor(cartList);
    const numId = req.params.id;
    let result = await dataCart.deleteById(numId);
    result 
    ? res.status(200).json({"success" : "Carrito Borrado"})
    : res.status(404).json({"error": "ID Inexistente"})
})

router.get('/:id/productos',async(req,res)=>{
	const dataCart = new contenedor(cartList);
    const numId = parseInt(req.params.id);
    let result = await dataCart.getById(numId);
    result 
    ? res.status(200).json({"success" : "Carrito Encontrado",result})
    : res.status(404).json({"error": "ID Inexistente"})
})

router.post('/:id/productos',async(req,res)=>{
    const dataProd = new contenedor(prodList);
    const dataCart = new contenedor(cartList);
    const numId = req.params.id;
    const {body} = req;
    const prod = await dataProd.getById(body['id']);
    if (prod){
        const result = await dataCart.addCart(numId,prod);
        result !== null
        ? res.status(200).json({"success" : "Producto Agregado",result})
        : res.status(404).json({"error": "Carrito no encontrado ID Inexistente"})
    }else {
        res.status(404).json({"error": "ID Ingresado Inexistente"})
    }
})

router.delete('/:id/productos/:id_prod',async(req,res)=>{
    const dataProd = new contenedor(prodList);
    const dataCart = new contenedor(cartList);
    const numId = req.params.id;
    const prodId = req.params.id_prod;
    const prod = await dataProd.getById(prodId);
    if (prod){
        let result = await dataCart.delProdById(numId,prodId);
        switch (result){
            case 1:
                res.status(404).json({"error": "Carrito no encontrado ID Inexistente"});
                break;
            case 2:
                res.status(404).json({"error": "El carrito no tiene este producto"});
                break;
            case 3:
                res.status(404).json({"error": "El carrito no tiene este producto"});
                break;
            default:
                res.status(200).json({"success" : "Producto Borrado",result});
                break;
            }
    }else {
        res.status(404).json({"error": "ID Ingresado Inexistente"})
    }
})

module.exports=router