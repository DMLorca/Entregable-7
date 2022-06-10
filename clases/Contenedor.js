const fs = require('fs');

class Contenedor{

    constructor(nombreArchivo){
        this.nombreArchivo = nombreArchivo;
        this.id = 1;
    }

    async save(objeto){
        try {
            objeto.id = this.id;
            const data = await fs.promises.readFile(this.nombreArchivo);
            const dataObj = JSON.parse(data); 
             
            //Validacion de id asignado
            for(;;){

                const dataObjId = dataObj.find(dataObj => dataObj.id === this.id);
                if (dataObjId) {
                    this.id++;
                } else {
                    objeto.id = this.id;

                    dataObj.push(objeto);
                    await fs.promises.writeFile(this.nombreArchivo, JSON.stringify(dataObj, null, 2));
                    return (this.id);
                }
            }                      
            
        } catch (error) {
            console.log(`Problema en save(): ${error}`);
        }
    }

    async getById(numberId){
        try {
            const data = await fs.promises.readFile(this.nombreArchivo, 'utf-8');
            const dataObj = JSON.parse(data);
            const dataObjId = dataObj.find(dataObj => dataObj.id === numberId);
            if(dataObjId){
                return {dataObjId};
            }else{
                return null;
            }
        } catch (error) {
            console.log(`Problema en con getById(): ${error}`);
            
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

    async deleteById(numberId){
        try {
            let dataObj = JSON.parse(await fs.promises.readFile(this.nombreArchivo));
            let tam = dataObj.length;
            let elimina = 0;
            const dataObjId = dataObj.find(dataObj => dataObj.id === numberId);
            if (dataObjId) {
                for (let i = 0; i < tam; i++) {
                    if (dataObj[i].id == numberId) {
                        elimina = i;
                        i = tam;
                    }
                }
                dataObj.splice(elimina, 1);
                await fs.promises.writeFile(this.nombreArchivo, JSON.stringify(dataObj, null, 2));
                return 1;
            }else{
                return null;
            }

        } catch (error) {
            console.log(`Problema en deleteById(): ${error}`);
            
        }
    }

    async deleteAll(){
        try {
            let dataObj = JSON.parse(await fs.promises.readFile(this.nombreArchivo));
            dataObj = [];
            await fs.promises.writeFile(this.nombreArchivo, JSON.stringify(dataObj, null, 2));
        } catch (error) {
            console.log(`Problema en deleteAll(): ${error}`);
            
        }
    }

    async updateById(numberId, tit, des, cod, timsta, sto, pri, thumb){
        try {
            const data = await fs.promises.readFile(this.nombreArchivo, 'utf-8');
            const dataObj = JSON.parse(data);
            const dataObjId = dataObj.find(dataObj => dataObj.id === numberId);
            if(dataObjId){
                
                for (let index = 0; index < dataObj.length; index++) {
                    
                    if(dataObj[index].id == numberId){
                        if(tit){
                            dataObj[index].title = tit;
                        }
                        if(des){
                            dataObj[index].description = des;
                        }
                        if(cod){
                            dataObj[index].code = cod;
                        }
                        if(timsta){
                            dataObj[index].timestamp = timsta;
                        }
                        if(sto){
                            dataObj[index].stock = sto;
                        }
                        if(pri){
                            dataObj[index].price = pri;
                        }
                        if(thumb){
                            dataObj[index].thumbnail = thumb;
                        }
                        
                    }
                    
                }
                await fs.promises.writeFile(this.nombreArchivo, JSON.stringify(dataObj, null, 2));
                return (numberId);

            }else{
                return null;
            }
        } catch (error) {
            console.log(`Problema en getById(): ${error}`);
            
        }
    }

}

module.exports.Contenedor = Contenedor;