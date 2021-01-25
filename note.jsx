// <<<<<<<<<<<<<<<<================================================================================================>>>>>>>>>>>>>>>>
// <<<<<<<<<<<<<<<<================================================================================================>>>>>>>>>>>>>>>>
// <<<<<<<<<<<<<<<<=============================================video 50.3=========================================>>>>>>>>>>>>>>>>
// <<<<<<<<<<<<<<<<================================================================================================>>>>>>>>>>>>>>>>
// <<<<<<<<<<<<<<<<================================================================================================>>>>>>>>>>>>>>>>

// server index.js 
const MongoClient = require('mongodb').MongoClient;
const express =require('express');
const bodyParser=require('body-parser');
const cors=require('cors');
require('dotenv').config()
const app=express();
app.use(bodyParser.json());
app.use(cors());


app.get('/',(req,res)=>{
    res.status(200).send(`<h1>Hello world</h1>`);
})

// console.log(process.env.USER);



const uri = `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@cluster0.lqicv.mongodb.net/${process.env.NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true , useUnifiedTopology:true });



client.connect(err => {
  const collection = client.db(`${process.env.NAME}`).collection(`${process.env.COLLECTION}`);

  app.post('/addProducts',(req,res)=>{
    const products=req.body;
    collection.insertMany(products)
    .then(result => { 
      res.send('Documet update successfully')
    })
  })

 )

 

  //   console.log(err);
  // // client.close();
});






const PORT =process.env.PORT || 4001;

app.listen(PORT,()=>{
    console.log(`Server is running on PORT ${PORT}`);
})


// client inventory.jsx


import React from 'react';
import fakeData from '../../fakeData';

const Inventory = () => {

    const handleAddProducts=()=>{
        fetch('http://localhost:4001/addProducts',{
            method:'POST',
            headers:{'Content-Type' : 'application/json'},
            body:JSON.stringify(fakeData)
        })
        .then(res => res.json())
        .then(res => {
            console.log(res);
        })
    }


    return (
        <div style={{textAlign:'center',marginTop:'100px'}}>
            <button onClick={handleAddProducts}>ADD PRODUCT</button>
        </div>
    );
};

export default Inventory;


// <<<<<<<<<<<<<<<<================================================================================================>>>>>>>>>>>>>>>>
// <<<<<<<<<<<<<<<<================================================================================================>>>>>>>>>>>>>>>>
// <<<<<<<<<<<<<<<<=============================================video 50.4=========================================>>>>>>>>>>>>>>>>
// <<<<<<<<<<<<<<<<================================================================================================>>>>>>>>>>>>>>>>
// <<<<<<<<<<<<<<<<================================================================================================>>>>>>>>>>>>>>>>

// server index.jsx

const MongoClient = require('mongodb').MongoClient;
const express =require('express');
const bodyParser=require('body-parser');
const cors=require('cors');
require('dotenv').config()
const app=express();
app.use(bodyParser.json());
app.use(cors());


app.get('/',(req,res)=>{
    res.status(200).send(`<h1>Hello world</h1>`);
})

// console.log(process.env.USER);



const uri = `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@cluster0.lqicv.mongodb.net/${process.env.NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true , useUnifiedTopology:true });



client.connect(err => {
  const collection = client.db(`${process.env.NAME}`).collection(`${process.env.COLLECTION}`);

  app.post('/addProducts',(req,res)=>{
    const products=req.body;
    collection.insertMany(products)
    .then(result => { 
      res.send('Documet update successfully')
    })
  })

  app.get('/products',(req,res)=>{
    collection.find({}).limit(20)
    .toArray((err,docs)=>{
      res.send(docs)
    })
  })

  app.get('/product/:key',(req,res)=>{
    collection.find({key:req.params.key})
    .toArray((err,docs)=>{
      res.send(docs[0])
    })
  })


  //   console.log(err);
  // // client.close();
});






const PORT =process.env.PORT || 4001;

app.listen(PORT,()=>{
    console.log(`Server is running on PORT ${PORT}`);
})



// client shop.jsx

import React, { useEffect } from 'react'; 
import { useState } from 'react';
import './Shop.css';
import Product from '../Product/Product';
import Cart from '../Cart/Cart';
import { addToDatabaseCart, getDatabaseCart } from '../../utilities/databaseManager';
import { Link } from 'react-router-dom';

const Shop = () => { 
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    
    useEffect(() => {
        fetch('http://localhost:4001/products')
        .then(res => res.json())
        .then(res => setProducts(res))
        .catch(err => console.log(err.message))
    }, [])


    useEffect(()=>{
        const savedCart = getDatabaseCart();
        const productKeys = Object.keys(savedCart);
        console.log(products,productKeys);
            if(products.length){
                const previousCart = productKeys.map( existingKey => {
                    const product = products.find( pd => pd.key === existingKey);
                    product.quantity = savedCart[existingKey];
                    return product;
                } )
                setCart(previousCart);
            }
    }, [products])

    const handleAddProduct = (product) =>{
        const toBeAddedKey = product.key;
        const sameProduct = cart.find(pd => pd.key === toBeAddedKey);
        let count = 1;
        let newCart;
        if(sameProduct){
            count = sameProduct.quantity + 1;
            sameProduct.quantity = count;
            const others = cart.filter(pd => pd.key !== toBeAddedKey);
            newCart = [...others, sameProduct];
        }
        else{
            product.quantity = 1;
            newCart = [...cart, product];
        }
        setCart(newCart);
        addToDatabaseCart(product.key, count);
    }

    return (
        <div className="twin-container">
            <div className="product-container">
                {
                    products.map(pd => <Product 
                        key={pd.key}
                        showAddToCart={true}
                        handleAddProduct = {handleAddProduct}
                        product={pd}
                        ></Product>)
                }
            </div>
            <div className="cart-container">
               <Cart cart={cart}>
                    <Link to="/review">
                        <button className="main-button">Review Order</button>
                    </Link>
               </Cart>
            </div>
            
        </div>
    );
};

export default Shop;



// client productDetails.jsx

import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useParams } from 'react-router-dom'; 
import Product from '../Product/Product';

const ProductDetail = () => {
    const {productKey} = useParams();
    const [product,setProduct]=useState({})

    useEffect(() => {
        fetch(`http://localhost:4001/product/${productKey}`)
        .then(res => res.json())
        .then(data => setProduct(data))
    }, [])
    
    console.log(product);

    return (
        <div>
            <h1>Your Product Details.</h1>
            <Product showAddToCart={false} product={product}></Product>
        </div>
    );
};

export default ProductDetail;

// <<<<<<<<<<<<<<<<================================================================================================>>>>>>>>>>>>>>>>
// <<<<<<<<<<<<<<<<================================================================================================>>>>>>>>>>>>>>>>
// <<<<<<<<<<<<<<<<=============================================video 50.5=========================================>>>>>>>>>>>>>>>>
// <<<<<<<<<<<<<<<<================================================================================================>>>>>>>>>>>>>>>>
// <<<<<<<<<<<<<<<<================================================================================================>>>>>>>>>>>>>>>>
// server index.js

const MongoClient = require('mongodb').MongoClient;
const express =require('express');
const bodyParser=require('body-parser');
const cors=require('cors');
require('dotenv').config()
const app=express();
app.use(bodyParser.json());
app.use(cors());


app.get('/',(req,res)=>{
    res.status(200).send(`<h1>Hello world</h1>`);
})

// console.log(process.env.USER);



const uri = `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@cluster0.lqicv.mongodb.net/${process.env.NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true , useUnifiedTopology:true });



client.connect(err => {
  const collection = client.db(`${process.env.NAME}`).collection(`${process.env.COLLECTION}`);

  app.post('/addProducts',(req,res)=>{
    const products=req.body;
    collection.insertMany(products)
    .then(result => { 
      res.send('Documet update successfully')
    })
  })

  app.get('/products',(req,res)=>{
    collection.find({}).limit(20)
    .toArray((err,docs)=>{
      res.send(docs)
    })
  })

  app.get('/product/:key',(req,res)=>{
    collection.find({key:req.params.key})
    .toArray((err,docs)=>{
      res.send(docs[0])
    })
  })

  app.post('/productByKeys',(req,res)=>{
        const productKeys=req.body;
        collection.find({key:{ $in : productKeys}})
        .toArray((err,docs)=>{
          res.send(docs)
        })
  })

  //   console.log(err);
  // // client.close();
});






const PORT =process.env.PORT || 4001;

app.listen(PORT,()=>{
    console.log(`Server is running on PORT ${PORT}`);
})




// client review.jsx


import React, { useEffect, useState } from 'react';
import { getDatabaseCart, removeFromDatabaseCart, processOrder } from '../../utilities/databaseManager'; 
import ReviewItem from '../ReviewItem/ReviewItem';
import Cart from '../Cart/Cart';
import happyImage from '../../images/giphy.gif';
import { useHistory } from 'react-router-dom';

const Review = () => {
    const [cart, setCart] = useState([]);
    const [orderPlaced, setOrderPlaced] = useState(false);
    const history = useHistory()

    const handleProceedCheckout = () => {
        history.push('/shipment');
    }

    const removeProduct = (productKey) => {
        const newCart = cart.filter(pd => pd.key !== productKey);
        setCart(newCart);
        removeFromDatabaseCart(productKey);
    }

    useEffect(()=>{
        //cart
        const savedCart = getDatabaseCart();
        const productKeys = Object.keys(savedCart);

        // const cartProducts =  productKeys.map( key => {
        //     const product = fakeData.find( pd => pd.key === key);
        //     product.quantity = savedCart[key];
        //     return product;
        // });
        // setCart(cartProducts);
        fetch('http://localhost:4001/productByKeys',{
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify(productKeys)
        })
        .then(res => res.json())
        .then(data => setCart(data))

    }, []);

    let thankyou;
    if(orderPlaced){
        thankyou = <img src={happyImage} alt=""/>
    } 
    return (
        <div className="twin-container">
            <div className="product-container">
                {
                    cart.map(pd => <ReviewItem 
                        key={pd.key}
                        removeProduct = {removeProduct}
                        product={pd}></ReviewItem>)
                }
                { thankyou }
            </div>
            <div className="cart-container">
                <Cart cart={cart}>
                    <button onClick={handleProceedCheckout} className="main-button">Proceed Checkout</button>
                </Cart>
            </div>
        </div>
    );
};

export default Review;


// shop.jsx

import React, { useEffect } from 'react'; 
import { useState } from 'react';
import './Shop.css';
import Product from '../Product/Product';
import Cart from '../Cart/Cart';
import { addToDatabaseCart, getDatabaseCart } from '../../utilities/databaseManager';
import { Link } from 'react-router-dom';

const Shop = () => { 
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    
    useEffect(() => {
        fetch('http://localhost:4001/products')
        .then(res => res.json())
        .then(res => setProducts(res))
        .catch(err => console.log(err.message))
    }, [])


    useEffect(()=>{
        const savedCart = getDatabaseCart();
        const productKeys = Object.keys(savedCart);
        // console.log(products,productKeys);
        //     if(products.length){
        //         const previousCart = productKeys.map( existingKey => {
        //             const product = products.find( pd => pd.key === existingKey);
        //             product.quantity = savedCart[existingKey];
        //             return product;
        //         } )
        //         setCart(previousCart);
        //     }
        fetch('http://localhost:4001/productByKeys',{
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify(productKeys)
        })
        .then(res => res.json())
        .then(data => setCart(data))
    }, [])

    const handleAddProduct = (product) =>{
        const toBeAddedKey = product.key;
        const sameProduct = cart.find(pd => pd.key === toBeAddedKey);
        let count = 1;
        let newCart;
        if(sameProduct){
            count = sameProduct.quantity + 1;
            sameProduct.quantity = count;
            const others = cart.filter(pd => pd.key !== toBeAddedKey);
            newCart = [...others, sameProduct];
        }
        else{
            product.quantity = 1;
            newCart = [...cart, product];
        }
        setCart(newCart);
        addToDatabaseCart(product.key, count);
    }

    return (
        <div className="twin-container">
            <div className="product-container">
                {
                    products.map(pd => <Product 
                        key={pd.key}
                        showAddToCart={true}
                        handleAddProduct = {handleAddProduct}
                        product={pd}
                        ></Product>)
                }
            </div>
            <div className="cart-container">
               <Cart cart={cart}>
                    <Link to="/review">
                        <button className="main-button">Review Order</button>
                    </Link>
               </Cart>
            </div>
            
        </div>
    );
};

export default Shop;


// <<<<<<<<<<<<<<<<================================================================================================>>>>>>>>>>>>>>>>
// <<<<<<<<<<<<<<<<================================================================================================>>>>>>>>>>>>>>>>
// <<<<<<<<<<<<<<<<=============================================video 50.6=========================================>>>>>>>>>>>>>>>>
// <<<<<<<<<<<<<<<<================================================================================================>>>>>>>>>>>>>>>>
// <<<<<<<<<<<<<<<<================================================================================================>>>>>>>>>>>>>>>>

// server index.js

const MongoClient = require('mongodb').MongoClient;
const express =require('express');
const bodyParser=require('body-parser');
const cors=require('cors');
require('dotenv').config()
const app=express();
app.use(bodyParser.json());
app.use(cors());


app.get('/',(req,res)=>{
    res.status(200).send(`<h1>Hello world</h1>`);
})

// console.log(process.env.USER);



const uri = `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@cluster0.lqicv.mongodb.net/${process.env.NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true , useUnifiedTopology:true });



client.connect(err => {
  const collection = client.db(`${process.env.NAME}`).collection(`${process.env.COLLECTION}`);

  app.post('/addProducts',(req,res)=>{
    const products=req.body;
    collection.insertOne(products)
    .then(result => { 
      res.send('Documet update successfully')
    })
  })

  app.get('/products',(req,res)=>{
    collection.find({}).limit(20)
    .toArray((err,docs)=>{
      res.send(docs)
    })
  })

  app.get('/product/:key',(req,res)=>{
    collection.find({key:req.params.key})
    .toArray((err,docs)=>{
      res.send(docs[0])
    })
  })

  app.post('/productByKeys',(req,res)=>{
        const productKeys=req.body;
        collection.find({key:{ $in : productKeys}})
        .toArray((err,docs)=>{
          res.send(docs)
        })
  })

  //   console.log(err);
  // // client.close();
});






const PORT =process.env.PORT || 4001;

app.listen(PORT,()=>{
    console.log(`Server is running on PORT ${PORT}`);
})


// client inventory.jsx

import React from 'react';


const Inventory = () => {

    const product={}

    const handleAddProducts=()=>{
        fetch('http://localhost:4001/addProducts',{
            method:'POST',
            headers:{'Content-Type' : 'application/json'},
            body:JSON.stringify(product)
        })
        .then(res => res.json())
        .then(res => {
            console.log(res);
        })
    }


    return (
        <div style={{textAlign:'center',marginTop:'100px'}}>
            <form action="">
                <p><span>Name</span><input type="text"/></p>
                <p><span>Price</span><input type="text"/></p>
                <p><span>Stock</span><input type="text"/></p>
                <p><span>Upload your image</span><input type="file"/></p>
            </form>
            <button onClick={handleAddProducts}>ADD PRODUCT</button>
        </div>
    );
};

export default Inventory;

// 