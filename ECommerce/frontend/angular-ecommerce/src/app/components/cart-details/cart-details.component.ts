import { Component, OnInit } from '@angular/core';
import { CartItem } from 'src/app/common/cart-item';
import { CartService } from 'src/app/services/cart.service';

@Component({
    selector: 'app-cart-details',
    templateUrl: './cart-details.component.html',
    styleUrls: ['./cart-details.component.css']
})
export class CartDetailsComponent implements OnInit {

    cartItems: CartItem[] = [];
    totalPrice: number;
    totalQuantity: number;
    productSize: string;
    quantity: number = 1;

    constructor(private cartService: CartService) { }

    ngOnInit(): void {
        this.listCartDetails();
    }

    listCartDetails() {
        this.cartItems = this.cartService.cartItems;
        this.productSize = this.cartService.productSize;
        this.cartService.totalPrice.subscribe(data => {
            this.totalPrice = data;
        });
        this.cartService.totalQuantity.subscribe(data => {
            this.totalQuantity = data;
        });
        this.cartService.computeCartTotals();
    }

    incrementQuantity(theCartItem: CartItem) {
        this.cartService.addToCart(theCartItem);
    }

    decrementQuantity(theCartItem: CartItem) {
        this.cartService.decrementQuantity(theCartItem);
    }

    removeProduct(theCartItem: CartItem){
        this.cartService.remove(theCartItem);
    }

    sizeOfProduct(theSize: string) {
        this.productSize = theSize;
    };

}
