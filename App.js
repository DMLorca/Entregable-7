const express = require('express');
const app = express();
const {engine} = require('express-handlebars');
const prodRouter = express.Router();
const carroRouter = express.Router();

let modulo = require('./clases/Contenedor.js');
let contenedor = new modulo.Contenedor('./filesystem/productos.txt');

app.use(express.urlencoded({extended: true}));
app.use('/api/productos', prodRouter);
app.use('/api/carrito', carroRouter);

let producto = [];

app.set('view engine', 'hbs');
app.set('views', './views');
0
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

    async function ejecutarSave(argObj){
        await contenedor.save(argObj);
        }
    ejecutarSave(obj); 

    res.redirect('/api/productos');
});

app.listen(8080, () => {
    console.log('Servidor levantado');
});