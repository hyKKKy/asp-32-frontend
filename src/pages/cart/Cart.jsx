import { useContext } from "react";
import AppContext from "../../features/context/AppContext";
import './Cart.css';

export default function Cart() {

  const { cart, request, updateCart, user } = useContext(AppContext);

  const deleteClick = (cartItemId) => {
    console.log("Delete", cartItemId);
    request("/api/cart/" + cartItemId, {
      method: 'DELETE',
    }).then((data) => {
      if (data) {
        updateCart();
      } else {
        alert("Помилка видалення");
      }
    });
  };

  const changeQuantity = (cartItemId, cnt) => {
    request("/api/cart/" + cartItemId + "?cnt=" + cnt, {
      method: 'PATCH',
    }).then((data) => {
      if (data) {
        updateCart();
      } else {
        alert("Помилка оновлення");
      }
    });
  };

  const totalPrice = cart.cartItems ? cart.cartItems.reduce((sum, item) => sum + item.price, 0) : 0;

  return (
    <>
      <h1>Cart</h1>
      {!user ? 
        (
          <div className="alert alert-danger" role="alert">
            Кошик можна переглянути лише авторизованим користувачам
          </div>
        ) : (
          <div>
            <div className="row header-row">
              <div className="col col-1 offset-1">Товар</div>
              <div className="col col-4"></div>
              <div className="col col-1">Ціна</div>
              <div className="col col-2 text-center">Кількість</div>
              <div className="col col-1">Вартість</div>
              <div className="col col-1"></div>
            </div>
            {cart.cartItems && cart.cartItems.length > 0 ? (
              <>
                {cart.cartItems.map(ci => (
                  <CartItem 
                    cartItem={ci} 
                    key={ci.id} 
                    deleteClick={deleteClick} 
                    changeQuantity={changeQuantity} 
                  />
                ))}
                <div className="total-price"> 
                  <div className="total-panel left"> 
                    <p className="p-field">
                      <span>Знижка:</span>
                      <span> 000 </span>
                    </p> 
                    <p className="p-field">
                      <span>Доставка: </span>
                      <span> 000 </span>
                    </p> 
                  </div> 
                  <div className="total-panel right"> 
                    <p className="p-field">
                      <span>Ціна без доставки:</span>
                      <span> 000 </span>
                    </p> 
                    <p className="p-field">
                      <span>Усього до сплати: </span>
                      <span>{totalPrice}</span>
                    </p> 
                  </div> 
                </div>
                <div className="promo-panel">
                  <span className="promo-span">If you have a promotion code, please enter it here</span>
                  <div className="input-group mb-3 mt-1">
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="Please enter promo code here" 
                      aria-label="Promo code" 
                      aria-describedby="basic-addon2"
                    />
                    <button className="btn btn-primary promo-code-apply" id="basic-addon2">
                      Apply Discount
                    </button>
                  </div>
                </div>

                <div className="checkout-panel">
                  <button className="btn btn-success checkout-button back">Back to shop</button>
                  <button className="btn btn-primary checkout-button checkout">Proceed to Checkout</button>
                </div>
              </>
            ) : (
              <div>Кошик порожній</div>
            )}
          </div>
        )
      }
    </>
  );
}

function CartItem({ cartItem, deleteClick, changeQuantity }) {
  return (
    <div className="row item-row">
      <div className="col col-1 offset-1">
        <img className="w-100" src={cartItem.product.imageUrl} alt={cartItem.product.name} />
      </div>
      <div className="col col-4">{cartItem.product.name}</div>
      <div className="col col-1">{cartItem.product.price}</div>
      <div className="col col-2 text-center">
        <i 
          onClick={() => changeQuantity(cartItem.id, -1)} 
          className="bi bi-dash-square me-2" 
          role="button"
        ></i>
        {cartItem.quantity}
        <i 
          onClick={() => changeQuantity(cartItem.id, 1)} 
          className="bi bi-plus-square ms-2" 
          role="button"
        ></i>
      </div>
      <div className="col col-1">{cartItem.price}</div>
      <div className="col col-1">
        <i
          onClick={() => deleteClick(cartItem.id)}
          role="button"
          className="bi bi-x-square"
        ></i>
      </div>
    </div>
  );
}
