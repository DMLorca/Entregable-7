const express = require('express');
const app = express();
const {engine} = require('express-handlebars');
const prodRouter = express.Router();
const carroRouter = express.Router();

let modulo = require('./clases/Contenedor.js');
let contenedor = new modulo.Contenedor('./filesystem/productos.txt');

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use('/api/productos', prodRouter);
app.use('/api/carrito', carroRouter);


app.set('view engine', 'hbs');
app.set('views', './views');

//Por defecto toma ext: handlebars y layouts/main.handlebars
app.engine(
    'hbs',
    engine({
        extname: '.hbs'
    })
);


prodRouter.get('/', (req, res) => {
    res.render('form');
});

//GET'/:id' = Lista todos los productos con id=0

prodRouter.get('/:id', (req, res) => {
    const prodId = parseInt(req.params.id);

    if(prodId == 0){
        contenedor.getAll().then((prod) => {
            res.render('vista', {prod});
        });
    } else {
        contenedor.getById(prodId).then((producto) => {
            if (producto) {
                let prod = [];
                prod.push(producto);
                res.render('vista', { prod });
            } else
                res.status(400).send({ error: 'Producto no encontrado' });
        });
    }
});

//POST '/' = Incorpora productos

prodRouter.post('/', (req, res) => {
    const {title, description, code, stock, price, thumbnail} = req.body;
    const date = new Date();
    const objFecha = {
        dia: date.getDate(),
        mes: date.getMonth() + 1,
        anio: date.getFullYear(),
        hs: date.getHours(),
        min: date.getMinutes()
    }
    const obj = {
        'title': title,
        "description": description,
        "code": code,
        "timestamp": `[${objFecha.dia}/${objFecha.mes}/${objFecha.anio} ${objFecha.hs}:${objFecha.min}]`,
        "stock": stock,
        'price': price,
        'thumbnail': thumbnail
    }

    async function ejecutarSave(argObj) {
        await contenedor.save(argObj);
        res.redirect('/api/productos');
    }
    ejecutarSave(obj); 
});

//PUT '/:id' = Actualiza producto

prodRouter.put('/:id', (req, res) => {
    const prodId = parseInt(req.params.id);
    const {title, description, code, stock, price, thumbnail} = req.body;

    const date = new Date();
    const objFecha = {
        dia: date.getDate(),
        mes: date.getMonth() + 1,
        anio: date.getFullYear(),
        hs: date.getHours(),
        min: date.getMinutes()
    }

    const timestamp = `[${objFecha.dia}/${objFecha.mes}/${objFecha.anio} ${objFecha.hs}:${objFecha.min}]`;
    
    const ejecutarFuncion = async () => {

        const state = await contenedor.updateById(prodId, title, description, code, timestamp, stock, price, thumbnail);
        if(state == null)
        res.status(400).send({ error: 'Producto no encontrado' });

        contenedor.getAll().then(result => {
            res.send(result);
        });
      };
      
      ejecutarFuncion();    
})


//DELETE '/:id' = Borra un producto

prodRouter.delete('/:id', (req, res) => {
    const prodId = parseInt(req.params.id);
    const ejecutarDelete = async (prodId) => {

        const resultado = await contenedor.deleteById(prodId);

        if (resultado == null) {
            res.status(400).send({ error: 'Producto no encontrado' });
            res.redirect('/api/productos/0');
        } else{
            res.send(`Eliminado id: ${prodId}`);
        }
    };
    ejecutarDelete(prodId);
});


carroRouter.get('/', (req, res) => {
    res.render('form');
});

carroRouter.get('/:id', (req, res) => {
    const prodId = parseInt(req.params.id);

    if(prodId == 0){
        contenedor.getAll().then((prod) => {
            res.render('vista', {prod});
        });
    } else {
        contenedor.getById(prodId).then((producto) => {
            if (producto) {
                let prod = [];
                prod.push(producto);
                res.render('vista', { prod });
            } else
                res.status(400).send({ error: 'Producto no encontrado' });
        });
    }
});

app.listen(8080, () => {
    console.log('Servidor levantado');
});