import { Product } from "./product";

export class CartItem {

    id: string;
    name: string;
    imageUrl: string;
    alterImageUrl: string;
    unitPrice: number;
    
    quantity: number;
    size: string;

    constructor(product: Product) {
        this.id = product.id;
        this.name = product.name;
        this.imageUrl = product.imageURL;
        this.alterImageUrl = product.alterImageURL;
        this.unitPrice = product.unitPrice;

        this.quantity = 1;
        this.size = "M";
    }
}
