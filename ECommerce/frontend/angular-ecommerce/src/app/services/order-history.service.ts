import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OrderHistory } from '../common/order-history';

@Injectable({
    providedIn: 'root'
})
export class OrderHistoryService {

    private orderUrl = "http://happy.us-east-2.elasticbeanstalk.com/api/orders";

    constructor(private http: HttpClient) { }

    getOrderHistory(theEmail: string): Observable<GetResponseOrderHistory> {
        
        const orderHistoryUrl = this.orderUrl + "/search/findByCustomerEmailOrderByDateCreatedDesc?email=" + theEmail;
        return this.http.get<GetResponseOrderHistory>(orderHistoryUrl);
    }
}

interface GetResponseOrderHistory {
    _embedded: {
        orders: OrderHistory[];
    }
}
