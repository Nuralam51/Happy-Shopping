import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Country } from 'src/app/common/country';
import { State } from 'src/app/common/state';
import { CartService } from 'src/app/services/cart.service';
import { ShopFormService } from '../../services/shop-form.service';
import { ShopValidators } from '../../validators/shop-validators';
import { CheckoutService } from '../../services/checkout.service';
import { Router } from '@angular/router';
import { Order } from 'src/app/common/order';
import { OrderItem } from 'src/app/common/order-item';
import { Purchase } from 'src/app/common/purchase';

@Component({
    selector: 'app-checkout',
    templateUrl: './checkout.component.html',
    styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

    checkoutFormGroup: FormGroup;
    totalQuantity: number = 0;
    totalPrice: number = 0;
    creditCardYears: number[] = [];
    creditCardMonths: number[] = [];
    countries: Country[] = [];
    shippingAddressStates: State[] = [];
    billingAddressStates: State[] = [];
    storage: Storage = sessionStorage;

    constructor(private formBuilder: FormBuilder,
        private shopFormService: ShopFormService,
        private cartService: CartService,
        private checkoutService: CheckoutService,
        private router: Router) { }

    ngOnInit(): void {

        const theEmail = JSON.parse(sessionStorage.getItem('userEmail'));

        this.checkoutFormGroup = this.formBuilder.group({
            customer: this.formBuilder.group({
                firstName: new FormControl('', [Validators.required, Validators.minLength(2), ShopValidators.notOnlyWhitespace]),
                lastName: new FormControl('', [Validators.required, Validators.minLength(2), ShopValidators.notOnlyWhitespace]),
                mobileNo: new FormControl('', [Validators.required, Validators.minLength(11), Validators.pattern('^[0-9]{11,14}$')]),
                email: new FormControl(theEmail, [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),
            }),
            shippingAddress: this.formBuilder.group({
                country: new FormControl('', [Validators.required]),
                state: new FormControl('', [Validators.required]),
                city: new FormControl('', [Validators.required, ShopValidators.notOnlyWhitespace]),
                zip: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{4}$')]),
                address: new FormControl('', [Validators.required, ShopValidators.notOnlyWhitespace]),
            }),
            billingAddress: this.formBuilder.group({
                country: new FormControl('', [Validators.required]),
                state: new FormControl('', [Validators.required]),
                city: new FormControl('', [Validators.required, ShopValidators.notOnlyWhitespace]),
                zip: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{4}$')]),
                address: new FormControl('', [Validators.required, ShopValidators.notOnlyWhitespace]),
            }),
            card: this.formBuilder.group({
                cardType: new FormControl('', [Validators.required]),
                cardName: new FormControl('', [Validators.required, ShopValidators.notOnlyWhitespace]),
                cardNumber: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{16}$')]),
                expirationMonth: new FormControl('', [Validators.required]),
                expirationYear: new FormControl('', [Validators.required]),
                cvv: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{3}$')]),
            })
        });

        const startMonth: number = new Date().getMonth() + 1;
        this.shopFormService.getCreditCardMonth(startMonth).subscribe(data => {
            this.creditCardMonths = data;
        });

        this.shopFormService.getCreditCardYear().subscribe(data => {
            this.creditCardYears = data;
        });

        this.getCountries();
        this.reviewCartDetails();
    }

    get firstName() { return this.checkoutFormGroup.get('customer.firstName'); }
    get lastName() { return this.checkoutFormGroup.get('customer.lastName'); }
    get mobileNo() { return this.checkoutFormGroup.get('customer.mobileNo'); }
    get email() { return this.checkoutFormGroup.get('customer.email'); }

    get shippingCountry() { return this.checkoutFormGroup.get('shippingAddress.country') }
    get shippingState() { return this.checkoutFormGroup.get('shippingAddress.state') }
    get shippingCity() { return this.checkoutFormGroup.get('shippingAddress.city') }
    get shippingZip() { return this.checkoutFormGroup.get('shippingAddress.zip') }
    get shippingAddress() { return this.checkoutFormGroup.get('shippingAddress.address') }

    get billingCountry() { return this.checkoutFormGroup.get('billingAddress.country') }
    get billingState() { return this.checkoutFormGroup.get('billingAddress.state') }
    get billingCity() { return this.checkoutFormGroup.get('billingAddress.city') }
    get billingZip() { return this.checkoutFormGroup.get('billingAddress.zip') }
    get billingAddress() { return this.checkoutFormGroup.get('billingAddress.address') }

    get cardType() { return this.checkoutFormGroup.get('card.cardType') }
    get cardName() { return this.checkoutFormGroup.get('card.cardName') }
    get cardNumber() { return this.checkoutFormGroup.get('card.cardNumber') }
    get expirationMonth() { return this.checkoutFormGroup.get('card.expirationMonth') }
    get expirationYear() { return this.checkoutFormGroup.get('card.expirationYear') }
    get cvv() { return this.checkoutFormGroup.get('card.cvv') }

    reviewCartDetails() {
        this.cartService.totalPrice.subscribe(data => {
            this.totalPrice = data;
        });
        this.cartService.totalQuantity.subscribe(data => {
            this.totalQuantity = data;
        });
        this.cartService.computeCartTotals();
    }

    copyShippingAddressToBillingAddress(event) {
        if (event.target.checked) {
            this.checkoutFormGroup.controls.billingAddress.setValue(this.checkoutFormGroup.controls.shippingAddress.value);
            this.billingAddressStates = this.shippingAddressStates;
        }
        else {
            this.checkoutFormGroup.controls.billingAddress.reset();
            this.billingAddressStates = [];
        }
    }

    handleMonthAndYear() {
        const creditCardFromGroup = this.checkoutFormGroup.get('card');
        const currentYear: number = new Date().getFullYear();
        const selectedYear: number = Number(creditCardFromGroup.value.expirationYear);

        let startMonth: number;
        if (currentYear === selectedYear) {
            startMonth = new Date().getMonth() + 1;
        }
        else {
            startMonth = 1;
        }

        this.shopFormService.getCreditCardMonth(startMonth).subscribe(data => {
            this.creditCardMonths = data;
        });

    }

    getCountries() {
        this.shopFormService.getCountries().subscribe(data => {
            this.countries = data;
        });
    }

    getStates(formGroupName: string) {
        const formGroup = this.checkoutFormGroup.get(formGroupName);

        const countryCode = formGroup.value.country.code;
        const countryName = formGroup.value.country.name;

        this.shopFormService.getStates(countryCode).subscribe(data => {
            if (formGroupName === 'shippingAddress') {
                this.shippingAddressStates = data;
            }
            else {
                this.billingAddressStates = data;
            }
            formGroup.get('state').setValue(data[0]);
        });
    }


    purchase() {
        console.log("Checkout submit button");
        if (this.checkoutFormGroup.invalid) {
            this.checkoutFormGroup.markAllAsTouched();
            return;
        }

        // set up order
        let order = new Order();
        order.totalPrice = this.totalPrice;
        order.totalQuantity = this.totalQuantity;

        // get cart items
        const cartItems = this.cartService.cartItems;

        // create orderItems from cartItems
        // let orderItems: OrderItem[] = [];
        // for (let i = 0; i < cartItems.length; i++) {
        //     orderItems[i] = new OrderItem(cartItems[i]);
        // }
        let orderItems: OrderItem[] =
            cartItems.map(tempCartItem => new OrderItem(tempCartItem));

        // set up purchase
        let purchase = new Purchase();

        // populate purchase - customer
        purchase.customer = this.checkoutFormGroup.controls['customer'].value;


        // populate purchase - shipping address
        purchase.shippingAddress = this.checkoutFormGroup.controls['shippingAddress'].value;
        const shippingState: State = JSON.parse(JSON.stringify(purchase.shippingAddress.state));
        const shippingCountry: Country = JSON.parse(JSON.stringify(purchase.shippingAddress.country));
        purchase.shippingAddress.state = shippingState.name;
        purchase.shippingAddress.country = shippingCountry.name;

        // populate purchase - billing address
        purchase.billingAddress = this.checkoutFormGroup.controls['billingAddress'].value;
        const billingState: State = JSON.parse(JSON.stringify(purchase.billingAddress.state));
        const billingCountry: Country = JSON.parse(JSON.stringify(purchase.billingAddress.country));
        purchase.billingAddress.state = billingState.name;
        purchase.billingAddress.country = billingCountry.name;

        // populate purchase - order and orderItems
        purchase.order = order;
        purchase.orderItems = orderItems;

        // call rest API via the checkoutService
        this.checkoutService.placeOrder(purchase).subscribe({
            next: response => {
                console.log(purchase);
                alert('Your order has been received. Order tracking number: ' + response.orderTrackingNumber);
                //reset cart
                this.resetCart();
            },
            error: err => {
                alert('There was an error: ' + err.message);
            }
        });
    }

    resetCart() {
        this.cartService.cartItems = [];
        this.cartService.totalPrice.next(0);
        this.cartService.totalQuantity.next(0);
        
        this.checkoutFormGroup.reset();
        this.router.navigateByUrl("/products");
    }

}
