const express = require('express');
const app = express();
const routesProducts = require('./routes/routesProducts');
const routesCart = require('./routes/routesCart');

app.use(express.json());
app.use('/api/productos', routesProducts);
app.use('/api/carrito', routesCart);
app.get('*',async(req, res)=>{
    res.status(404).json({"error": "Ruta no habilitada"})
})

const PORT=8080;
app.listen(PORT,()=>{
    console.log(`Servidor escuchando puerto ${PORT}`);
});