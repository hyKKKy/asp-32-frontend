import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import { useState, useEffect } from 'react'
import './ui/App.css'
import Category from '../pages/category/Category';
import Layout from '../widgets/layout/Layout';
import Home from '../pages/home/Home';
import AppContext from '../features/context/AppContext';
import Base64 from '../shared/base64/Base64';
import Product from '../pages/product/Product';
import Cart from '../pages/cart/Cart';

const initCartState = {
    cartItems: []
};

function App() {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState({});

  const updateCart = () => {
    if(token){
            request("/api/cart")
        .then(setCart)
        }
        else{
            setCart(initCartState);
        }
  };

  useEffect(() => {
    if(token){
      setUser(Base64.jwtDecodePayload(token));
    }
    else{
      setUser(null);
    }
    updateCart();
  }, [token]);

  const backUrl = "https://localhost:7076";

  const request = (url, conf) => new Promise((resolve, reject) => {
    if(url.startsWith('/')){
      url = backUrl + url;

      if(token)
      {
        if(typeof conf == 'undefined')
        {
          conf = {};
        }
        if(typeof conf.headers == 'undefined')
        {
          conf.headers = {};
        }
        if(typeof conf.headers['Authorization'] == 'undefined'){
          conf.headers['Authorization'] = 'Bearer ' + token;
        }
      }
    }
    fetch(url, conf)
        .then(r => r.json())
        .then(j => {
            if(j.status.isOk){
                resolve(j.data);
            }
            else{
                reject(j);
            }  
        });
  });



  return <AppContext.Provider value = {{cart, updateCart, request, backUrl, user, setToken}}>
    <BrowserRouter>
      <Routes>
          <Route path="/" element={<Layout />} >
            <Route index element = {<Home />} />
            <Route path="cart" element={<Cart />}></Route>
            <Route path='category/:slug' element = {<Category />} />
            <Route path="product/:slug" element={<Product />}></Route>
          </Route>
      </Routes>
    </BrowserRouter>
    </AppContext.Provider>
}

export default App
