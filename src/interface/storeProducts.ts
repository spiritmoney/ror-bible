export interface IStoreProduct {
    ProductID: string;
    ProductSKU: string;
    Title: string;
    shortTitle: string;
    appleID?: string;
    Category: string;
    Description: string;
    Imageurl: string;
    Price: string;
    bookType: string;
    version: string;
    publisher: string;
    planDuration: string;
    copyright: string;
    PDFurl?: string;
    JSONurl: string;
    Author?: string;
}
export interface IBanners {

    ProductSKU: string;
    Title: string;
    Imageurl: string;
    Likes?: string;
    Shares?: string;

}
export interface IEventBanner {
    Title: string;
    Imageurl: string;
    Likes?: string;
    Shares?: string;

}