export type Tokens = {
    accessToken: string;
    refreshToken: string;
}

export type Proof = {
    user_id: string;
    proof_mp_id: string;
    proof_date: string;
    data_approved_mp: string;
    operation_type_mp: string;
    status_mp: string;
    amount_mp: number;
}

export type PaginatedProofs = {
    items: Proof[]
    page: number;
    pageSize: number;
    total: number;
    hasMore: boolean;
}