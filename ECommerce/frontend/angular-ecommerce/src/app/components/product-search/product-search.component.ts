import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from 'src/app/services/product.service';

@Component({
    selector: 'app-product-search',
    templateUrl: './product-search.component.html',
    styleUrls: ['./product-search.component.css']
})
export class ProductSearchComponent implements OnInit {

    constructor(private router: Router, private productService: ProductService) { }

    ngOnInit(): void {
    }

    doSearch(value: string) {
        console.log(value);
        this.router.navigateByUrl("/search/"+value);
    }
}
