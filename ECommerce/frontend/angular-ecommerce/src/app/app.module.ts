import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http'

import { AppComponent } from './app.component';
import { TopNavbarComponent } from './components/top-navbar/top-navbar.component';
import { SideNavbarComponent } from './components/side-navbar/side-navbar.component';
import { ProductSearchComponent } from './components/product-search/product-search.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { Router, RouterModule, Routes } from '@angular/router';
import { ProductService } from '../app/services/product.service';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { CartStatusComponent } from './components/cart-status/cart-status.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CartDetailsComponent } from './components/cart-details/cart-details.component';
import { LoginComponent } from './components/login/login.component';
import { LoginStatusComponent } from './components/login-status/login-status.component';

import { OKTA_CONFIG, OktaAuthModule, OktaCallbackComponent, OktaAuthGuard } from '@okta/okta-angular';
import myAppConfig from './config/my-app-config';
import { OrderHistoryComponent } from './components/order-history/order-history.component';

const oktaConfig = Object.assign({
    onAuthRequired: (oktaAuth, injector) => {
        const router = injector.get(Router);
        router.navigate(['/login'])
    }
}, myAppConfig.oidc);

const routes: Routes = [
    { path: 'login/callback', component: OktaCallbackComponent },
    { path: 'login', component: LoginComponent, data: { title: 'Login | Happy Shopping' } },

    { path: 'order-history', component: OrderHistoryComponent, data: { title: 'Order History | Happy Shopping' }, canActivate: [OktaAuthGuard]},
    { path: 'checkout', component: CheckoutComponent, data: { title: 'Checkout | Happy Shopping' }, canActivate: [OktaAuthGuard] },
    { path: 'cart-details', component: CartDetailsComponent, data: { title: 'Cart details | Happy Shopping' } },
    { path: 'search/:keyword', component: ProductListComponent, data: { title: 'Search products | Happy Shopping' } },
    { path: 'products/:id', component: ProductDetailsComponent, data: { title: 'Products | Happy Shopping' } },
    { path: 'category/:id', component: ProductListComponent, data: { title: 'Category | Happy Shopping' } },
    { path: 'category', component: ProductListComponent, data: { title: 'Category | Happy Shopping' } },
    { path: 'products', component: ProductListComponent, data: { title: 'Products | Happy Shopping' } },
    { path: '', redirectTo: '/products', pathMatch: 'full' },
    { path: '**', redirectTo: '/products', pathMatch: 'full' }
];

@NgModule({
    declarations: [
        AppComponent,
        TopNavbarComponent,
        SideNavbarComponent,
        ProductSearchComponent,
        ProductListComponent,
        ProductDetailsComponent,
        CartStatusComponent,
        CartDetailsComponent,
        CheckoutComponent,
        LoginComponent,
        LoginStatusComponent,
        OrderHistoryComponent
    ],
    imports: [
        RouterModule.forRoot(routes),
        BrowserModule,
        HttpClientModule,
        ReactiveFormsModule,
        OktaAuthModule
    ],
    providers: [ProductService, Title, { provide: OKTA_CONFIG, useValue: oktaConfig }],
    bootstrap: [AppComponent]
})
export class AppModule { }
