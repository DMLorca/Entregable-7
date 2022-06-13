const fs = require('fs');

class Contenedor_carrito{

    constructor(nombreArchivo){
        this.nombreArchivo = nombreArchivo;
        this.idc = 1;
    }

    async addCarro() {
        try {
            
            const data = await fs.promises.readFile(this.nombreArchivo);
            const dataObj = JSON.parse(data);

            let i = 0;
            //Si esta vacio [] agrega un arreglo en la primer posicion con un objeto que tiene el id=1
            if (dataObj.length == 0) {
                dataObj[0] = [{ "idc": this.idc }];
                await fs.promises.writeFile(this.nombreArchivo, JSON.stringify(dataObj, null, 2));
                return (idcc);

            } else {

                for (; ;) {

                    if (i < dataObj.length) {         //Si se llega al final y no encuentra el id, pasa al else para agregar el id
                        if (dataObj[i][0].idc == this.idc) {
                            this.idc++;
                        }
                    } else {

                        dataObj[i] = [{ "idc": this.idc }];
                        await fs.promises.writeFile(this.nombreArchivo, JSON.stringify(dataObj, null, 2));
                        return (this.idc);
                    }
                    i++;
                }
            }

        } catch (error) {
            console.log(`Problema en save(): ${error}`);
        }
    }

    async addProd(prod, carro) {
        try {

            const data = await fs.promises.readFile(this.nombreArchivo);
            const dataObj = JSON.parse(data);
            carro = carro-1;
            if(carro < dataObj.length){
            dataObj[carro].push(prod);
            await fs.promises.writeFile(this.nombreArchivo, JSON.stringify(dataObj, null, 2));
            return (this.id);
            }else{
                return null;
            }

        } catch (error) {
            console.log(`Problema en add(): ${error}`);
        }
    }

    async getById(carro){
        try {
            const data = await fs.promises.readFile(this.nombreArchivo, 'utf-8');
            const dataObj = JSON.parse(data);
            let i=0;
            for (let index = 0; index < dataObj.length; index++) {
                if (dataObj[index][0].idc == carro) {
                    i = index;
                }   
            }
            if(i){
                return dataObj[i];
            }else{
                return `No se encuentra el carro ${carro}`;
            }
        } catch (error) {
            console.log(`Problema en getById(): ${error}`);
            
        }
    }

    async getAll(){
        try {
            const dataObj = JSON.parse(await fs.promises.readFile(this.nombreArchivo));
            return dataObj;
        } catch (error) {
            console.log(`Problema en getAll(): ${error}`);
            
        }
    }

    async deleteById(carro, pro){
        try {
            let dataObj = JSON.parse(await fs.promises.readFile(this.nombreArchivo));
 
            let i = 0, j = 0;
            //Busca el carrito
            for (let index = 0; index < dataObj.length; index++) {
                if (dataObj[index][0].idc == carro) {
                    i = index;
                }
            }
            if (i) {
                const carroObj = dataObj[i];
                //Busca el producto en el carrito encontrado
                for (let index = 0; index < carroObj.length; index++) {
                    if (carroObj[index].id == pro) {
                        j = index;
                    }
                }
                if (j) {
                    //Elimina el producto del carro
                    dataObj[i].splice(j, 1);
                    await fs.promises.writeFile(this.nombreArchivo, JSON.stringify(dataObj, null, 2));
                    return `Se elimino producto id=${j+1} de carro ${carro} correctamente`;
                } else {
                    return `No se encuentra el producto en el carro ${i+1}`;
                }
            } else {
                return `No se encuentra el carro ${carro}`;                
            }
        } catch (error) {
            console.log(`Problema en deleteById(): ${error}`);         
        }
    }

    async deleteCarro(carro){
        try {
            let dataObj = JSON.parse(await fs.promises.readFile(this.nombreArchivo));
 
            let i = 0;
            //Busca el carrito
            for (let index = 0; index < dataObj.length; index++) {
                if (dataObj[index][0].idc == carro) {
                    i = index;
                }
            }
            if (i) {
                const elim = dataObj.splice(i, 1);
                await fs.promises.writeFile(this.nombreArchivo, JSON.stringify(dataObj, null, 2));
                return 1;
            }else{
                return null;
            }
        } catch (error) {
            console.log(`Problema en deleteAll(): ${error}`);
            
        }
    }
}

module.exports.Contenedor_carrito = Contenedor_carrito;