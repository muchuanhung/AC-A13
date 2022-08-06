import React, { useCallback, memo, useMemo } from 'react';
import ProductItem from './ProductItem';
import { PRODUCTS } from './config';
import Cart from './Cart';
import Coupons from './Coupons';
import type { LineItem, Product } from './types';
import { CartContext } from './CartContext';

const ShoppingCart = () => {
  // TODO 2
  const [totalAmount, setTotalAmount] = React.useState(0);
  /**
   * @type {[LineItem[], Function]}
   */
  const [lineItems, setLineItems] = React.useState([]);
  /**
   * @type {[NewProducts[], Function]}
   */
  const [newProducts, setNewProducts] = React.useState(PRODUCTS);
  const [haveCoupon, setHaveCoupon] = React.useState('');

  // TODO 6
  React.useEffect(() => {
    let calcTotalAmount = lineItems.reduce((total, currentItem) => {
      return total + currentItem.price * currentItem.quantity;
    }, 0);
    if (haveCoupon !== '' && calcTotalAmount !== 0) {
      calcTotalAmount -= haveCoupon.discount / 1;
    }
    setTotalAmount(calcTotalAmount);
  }, [lineItems, haveCoupon]);

  const updateInventory = useCallback((id: String, add: Number) => {
    setNewProducts((prev) => {
      return prev.map((item: Product) => {
        if (item.id === id) {
          return {
            id: item.id,
            img: item.img,
            title: item.title,
            price: item.price,
            inventory: item.inventory - add,
          };
        }
        return item;
      });
    });
  }, []);

  // TODO 5
  const atUpdateQuantity = useCallback(
    (id: string, add: Number) => {
      // 增加數量
      setLineItems((prev) => {
        return prev.map((item: LineItem) => {
          if (item.id === id) {
            return {
              id: item.id,
              title: item.title,
              price: item.price,
              quantity: item.quantity + add,
            };
          }
          return item;
        });
      });
      updateInventory(id, add);
    },
    [updateInventory],
  );

  // TODO 5
  const atAddToCart = useCallback(
    (id: string) => {
      const foundItem = lineItems.find((data) => data.id === id);
      if (foundItem) {
        atUpdateQuantity(id, 1);
      } else {
        // 新增
        const foundProduct = PRODUCTS.find((data) => data.id === id);

        const lineItem = {
          id,
          price: foundProduct.price,
          title: foundProduct.title,
          quantity: 1,
        };
        setLineItems((prev) => prev.concat(lineItem));
        updateInventory(id, 1);
      }
    },
    [atUpdateQuantity, lineItems, updateInventory],
  );

  // TODO
  const onRemoveItem = useCallback(
    (id: string, quantity: Number) => {
      setLineItems((prev) => prev.filter((item) => item.id !== id));
      updateInventory(id, quantity * -1);
    },
    [updateInventory],
  );

  // TODO
  const onRemoveCart = useCallback(() => {
    setNewProducts(PRODUCTS);
    setLineItems([]);
    setHaveCoupon('');
  }, []);

  // FIXME 請實作 coupon

  const atApplyCoupon = useCallback((coupon) => {
    setHaveCoupon(coupon);
  }, []);

  const provideValue = useMemo(() => {
    return {
      newProducts,
    };
  }, [newProducts]);

  return (
    <CartContext.Provider value={provideValue}>
      <div className="container">
        <div className="row">
          {/* TODO 4 */}
          {newProducts.map((product) => {
            return (
              <div className="col-3" key={product.id}>
                <ProductItem
                  id={product.id}
                  img={product.img}
                  title={product.title}
                  price={product.price}
                  inventory={product.inventory}
                  // TODO 5
                  onAddToCart={atAddToCart}
                />
              </div>
            );
          })}
        </div>
        <Cart
          totalAmount={totalAmount}
          lineItems={lineItems}
          onRemoveCart={onRemoveCart}
          onUpdateQuantity={atUpdateQuantity}
          onRemoveItem={onRemoveItem}
          haveCoupon={haveCoupon}
        />
        {/* FIXME 請實作 coupon 功能 */}
        <Coupons onApplyCoupon={atApplyCoupon} />
      </div>
    </CartContext.Provider>
  );
};

export default memo(ShoppingCart);
