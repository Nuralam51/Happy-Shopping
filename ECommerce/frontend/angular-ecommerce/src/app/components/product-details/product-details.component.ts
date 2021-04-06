import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { Product } from 'src/app/common/product';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
    selector: 'app-product-details',
    templateUrl: './product-details.component.html',
    styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {

    product: Product = new Product();
    quantity: number = 1;
    productSize: string = "M";

    constructor(private router: ActivatedRoute,
        private productService: ProductService,
        private cartService: CartService) { }

    ngOnInit(): void {
        this.sizeOfProduct(this.productSize);
        this.router.paramMap.subscribe(() => {
            this.handleProductDetails();
        });
    }

    handleProductDetails() {
        const theProductId: number = +this.router.snapshot.paramMap.get('id');
        this.productService.getProduct(theProductId).subscribe(data => {
            this.product = data;
        });
    }

    addToCart(theProduct: Product) {
        const cartItems = new CartItem(theProduct);
        cartItems.quantity = this.quantity;
        cartItems.size = this.productSize;
        this.cartService.addToCart(cartItems);
    }

    increment(theQuantity: number) {
        this.quantity++;
    }

    decrement(theQuantity: number) {
        this.quantity--;
        if (this.quantity <= 0) {
            this.quantity = 1;
        }
    }

    sizeOfProduct(theSize: string) {
        this.productSize = theSize;
    };
}
