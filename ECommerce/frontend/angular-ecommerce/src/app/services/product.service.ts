import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ProductCategory } from '../common/product-category';
import { Product } from '../common/product';

@Injectable({
    providedIn: 'root'
})
export class ProductService {

    private baseUrl = 'http://happy.us-east-2.elasticbeanstalk.com/api/products';
    private categoryUrl = 'http://happy.us-east-2.elasticbeanstalk.com/api/productCategory';

    headers: HttpHeaders;

    constructor(private http: HttpClient) { }

    getProductCategory(): Observable<ProductCategory[]>{
        return this.http.get<GetReponse>(this.categoryUrl).pipe(
            map(response => response._embedded.productCategory)
        );
    }

    getProductList(theCategoryId: number): Observable<any>{
        const searchUrl = this.baseUrl + '/search/findByCategoryId?id='+theCategoryId;
        return this.getProducts(searchUrl); 
    }

    listProduct(): Observable<any>{
        return this.http.get<GetReponse>(this.baseUrl).pipe(
            map(response => response._embedded.products)
        );
    }

    searchProducts(searchKeyword: string): Observable<Product[]> {
        const searchUrl = this.baseUrl + '/search/findByNameContaining?name='+searchKeyword;
        return this.getProducts(searchUrl); 
    }

    getProduct(theProductId: number): Observable<Product> {
        const productDetailsUrl = this.baseUrl + "/" +theProductId;
        return this.http.get<Product>(productDetailsUrl);
    }

    private getProducts(searchUrl: string): Observable<Product[]> {
        return this.http.get<GetReponse>(searchUrl).pipe(
            map(response => response._embedded.products)
        );
    }
}

interface GetReponse{
    _embedded: {
        productCategory: ProductCategory[];
        products: Product[];
    }
}