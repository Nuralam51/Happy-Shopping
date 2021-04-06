import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { CartItem } from '../common/cart-item';

@Injectable({
    providedIn: 'root'
})
export class CartService {

    storage: Storage = sessionStorage;

    cartItems: CartItem[] = [];
    totalPrice: Subject<number> = new BehaviorSubject<number>(0);
    totalQuantity: Subject<number> = new BehaviorSubject<number>(0);
    productSize: string;

    constructor() {
        let data = JSON.parse(this.storage.getItem('cartItems'));
        if (data != null) {
            this.cartItems = data;
            this.computeCartTotals();
        }
    }

    addToCart(theCartItem: CartItem) {
        let alreadyExistsInCart: boolean = false;
        let existingCartItem: CartItem = undefined;

        if (this.cartItems.length > 0) {
            existingCartItem = this.cartItems.find(tempCartItem => tempCartItem.id === theCartItem.id);
            alreadyExistsInCart = (existingCartItem != undefined);
        }
        if (alreadyExistsInCart) {
            existingCartItem.quantity++;
        }
        else {
            this.cartItems.push(theCartItem);
        }
        this.computeCartTotals();
    }

    decrementQuantity(theCartItem: CartItem) {
        theCartItem.quantity--;
        if (theCartItem.quantity === 0) {
            theCartItem.quantity = 1;
        }
        else {
            this.computeCartTotals();
        }
    }

    remove(theCartItem: CartItem) {
        const itemIndex = this.cartItems.findIndex(tempCartItem => tempCartItem.id == theCartItem.id);
        if (itemIndex > -1) {
            this.cartItems.splice(itemIndex, 1);
            this.computeCartTotals();
        }
    }

    computeCartTotals() {
        let totalPriceValue: number = 0;
        let totalQuantityValue: number = 0;
        for (let currentCartItem of this.cartItems) {
            totalPriceValue += currentCartItem.quantity * currentCartItem.unitPrice;
            totalQuantityValue += currentCartItem.quantity;
        }
        this.totalPrice.next(totalPriceValue);
        this.totalQuantity.next(totalQuantityValue);

        this.presistCartItems();
    }

    presistCartItems(){
        this.storage.setItem('cartItems', JSON.stringify(this.cartItems));
    }

    logCartData(totalPriceValue: number, totalQuantityValue: number) {
        console.log('Contents of the cart');
        for (let tempCartItem of this.cartItems) {
            const subTotalPrice = tempCartItem.quantity * tempCartItem.unitPrice;
            console.log('name: ' + tempCartItem.name, ', quantity: ' + tempCartItem.quantity, ', UnitPrice: ' + tempCartItem.unitPrice,
                ', SubtotalPrice: ' + subTotalPrice, ', Size: ' + tempCartItem.size);
            console.log('Image: ' + tempCartItem.imageUrl, 'AlterImage: ' + tempCartItem.alterImageUrl);
        }
        console.log('-------------------------')
        console.log('total price: ' + totalPriceValue.toFixed(2), ', totalQuantity: ' + totalQuantityValue);
    }
}
