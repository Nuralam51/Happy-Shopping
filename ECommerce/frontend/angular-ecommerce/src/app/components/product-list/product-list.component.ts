import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { Product } from 'src/app/common/product';
import { ProductService } from 'src/app/services/product.service';
import { CartService } from '../../services/cart.service';

@Component({
    selector: 'app-product-list',
    templateUrl: './product-list.component.html',
    styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

    productList: Product[];
    currentCategoryId: number;
    searchMode: boolean;

    constructor(private router: ActivatedRoute, 
                private productService: ProductService,
                private cartService: CartService) { }

    ngOnInit(): void {
        this.router.paramMap.subscribe(() => {
            this.getProductList();
        });
    }

    getProductList() {
        this.searchMode = this.router.snapshot.paramMap.has('keyword');
        if (this.searchMode) {
            this.handleSearchProduct();
        }
        else {
            this.handleListProduct();
        }
    }

    handleListProduct() {
        const hasCategoryId: boolean = this.router.snapshot.paramMap.has('id');
        if (hasCategoryId) {
            this.currentCategoryId = +this.router.snapshot.paramMap.get('id');
            this.productService.getProductList(this.currentCategoryId).subscribe(data => {
                this.productList = data;
            });
        }
        else {
            this.productService.listProduct().subscribe(data => {
                this.productList = data;
            });
        }
    }

    handleSearchProduct() {
        const searchKeyword: string = this.router.snapshot.paramMap.get('keyword');
        this.productService.searchProducts(searchKeyword).subscribe(data => {
            this.productList = data;
        });
    }

    addToCart(theProduct: Product) {
        console.log("Add to cart: " + theProduct.name, theProduct.unitPrice);
        const cartItems = new CartItem(theProduct);
        this.cartService.addToCart(cartItems);
    }

}
