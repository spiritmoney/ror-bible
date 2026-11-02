export interface ITransactionsResponse {
    id?: number;
    status?: string;
    statusCode?: string;
    transactionDetails?: {
        transaction_date: string;
        amount: number;
        product_id: string;
        merchant_code: string;
        username: string;
    } | null;

}

