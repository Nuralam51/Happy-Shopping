import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductCategory } from 'src/app/common/product-category';
import { ProductService } from 'src/app/services/product.service';

@Component({
    selector: 'app-side-navbar',
    templateUrl: './side-navbar.component.html',
    styleUrls: ['./side-navbar.component.css']
})
export class SideNavbarComponent implements OnInit {

    constructor(private productService: ProductService) { }

    categoryList: ProductCategory[];

    ngOnInit(): void {
        this.getProductCategory();
    }

    getProductCategory() {
        this.productService.getProductCategory().subscribe(data => {
            this.categoryList = data;
        });
    }

}
