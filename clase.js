const fs=require('fs');

class contenedor{
    constructor(fileName){
        this.fileName = fileName;
    }
    async codigo(){
        let codigo = Math.random().toString(36).slice(-8);
        return codigo
    }
    async save(newDato){
        try{
            const codigo = await this.codigo();
            const data = await this.getAll();
            let id;
            data.length === 0
            ? id = 1
            : id = data[data.length-1].id+1
            data.push({...newDato,codigo:codigo,id})
            let newData = data.find(x => x.id == id);
            await fs.promises.writeFile(this.fileName,JSON.stringify(data))
            let res =[id,newData]
            return res;
        }catch(error){
            console.log('Hubo un error al guardar el articulo',error);
        }
    }
    async getById(numId){ 
        try{
            const data = await this.getAll();
            return data.find(x => x.id == numId);
        }catch(error){
            console.log('Hubo un error al obtener el producto seleccionado',error);
        }
    }
    async getAll(){
        try {
            const data = await fs.promises.readFile(this.fileName);
            return JSON.parse(data);
        } catch (error) {
            console.log('Hubo un error al mostrar la base de datos',error);
        }
    }
    async updateById(numId,newProd){
        try{
            const data = await this.getAll();
            const prod = data.find((x) => x.id == numId);
            const index = data.indexOf(prod);
            if (prod){
                let [id,timestamp,codigo] = [parseInt(numId),data[index].timestamp,data[index].codigo]
                data[index] = {...newProd,timestamp:timestamp,codigo:codigo,id:id}
                await fs.promises.writeFile(this.fileName,JSON.stringify(data))
                return data[index]
            }else{
                return null
            }
        } catch (error){
            console.log('Hubo un error al actualizar el producto seleccionado',error);
        }
    }
    async deleteById(numId){
        try {
            const data = await this.getAll();
            let res = data.find(x => x.id == numId);
            if(res === undefined){
                return null
            }else{
                let newData = data.filter((item) => item.id != numId);
                const dataJsonFinal=JSON.stringify(newData);
                await fs.promises.writeFile(this.fileName,dataJsonFinal)
                return newData
            }
        } catch (error) {
            console.log('Hubo un error al borrar el articulo seleccionado',error);
        }
    }
    async createCart(newCart){
        try{
            const data = await this.getAll();
            let id;
            data.length === 0
            ? id = 1
            : id = data[data.length-1].id+1
            data.push({...newCart,id,productos:[]})
            await fs.promises.writeFile(this.fileName,JSON.stringify(data))
            return id
        }catch(error){
            console.log('Hubo un error al crear el carrito',error);
        }
    }
    async deleteCart(numId){
        try {
            const data = await this.getAll();
            let res = data.find(x => x.id == numId);
            if(res === undefined){
                return null
            }else{
                let newData = data.filter((item) => item.id != numId);
                const dataJsonFinal=JSON.stringify(newData);
                await fs.promises.writeFile(this.fileName,dataJsonFinal)
                return newData
            }
        } catch (error) {
            console.log('Hubo un error al borrar el carrito seleccionado',error);
        }
    }
    async addCart(numId,prod){
        try {
            let idt = parseInt(numId);
            const data = await this.getAll();
            let cart = data.find((x) => x.id == idt);
            let index = data.indexOf(cart);
            if (cart !== undefined){
                let locate = data[index].productos.find(i => i.id == prod.id);
                let idx = data[index].productos.indexOf(locate);
                if (locate){
                    data[index].productos[idx].qty++;
                    await fs.promises.writeFile(this.fileName,JSON.stringify(data));
                    return data
                }else{
                    prod.qty = 1;
                    data[index].productos.push(prod)
                    await fs.promises.writeFile(this.fileName,JSON.stringify(data));
                    return data
                }
            }else{
                return null
            }
        } catch (error) {
            console.log('Hubo un error al añadir el articulo al carrito',error);
        }
    }
    async delProdById(numId,prodId){
        try {
            let idt = parseInt(numId);
            let idp = parseInt(prodId);
            const data = await this.getAll();
            let cart = data.find((x) => x.id == idt);
            let index = data.indexOf(cart);
            if (cart !== undefined){
                let locate = data[index].productos.find(i => i.id == idp);
                let idx = data[index].productos.indexOf(locate);
                if (locate){
                    if (data[index].productos[idx].qty > 1){
                            data[index].productos[idx].qty--;
                            await fs.promises.writeFile(this.fileName,JSON.stringify(data));
                            return data
                } else if(data[index].productos[idx].qty == 1){
                            let newData = data.map(i => (i.productos = i.productos.filter(({ id }) => id != idp), i))
                            await fs.promises.writeFile(this.fileName,JSON.stringify(newData));
                            return newData
                } else if(data[index].productos[idx].qty){
                            return 3
                }
                } else {
                    return 2
                }
            }else{
                return 1
            }
        } catch (error) {
            console.log('Hubo un error al borrar el articulo del carrito',error);
        }
    }
}

module.exports = contenedor;