// types/api.ts
export interface BaseResponse {
  ec: number;
  em: string;
}

export interface OrderResponse {
    ec: number;
    em: string;
    data: {
      list: Array<{
        out_trade_no: string;
        user_id: string;
        plan_id: string;
        month: number;
        total_amount: string;
        show_amount: string;
        status: number;
        remark: string;
        redeem_id: string;
        product_type: number;
        discount: string;
        sku_detail: any[];
        create_time: number;
        plan_title: string;
        user_private_id: string;
        address_person: string;
        address_phone: string;
        address_address: string;
      }>;
    };
}

export interface UserResponse {
    ec: number;
    em: string;
    data: {
      total_count: number;
      total_page: number;
      list: Array<{
        sponsor_plans: any[]; // Replace 'any' with a more specific type if known
        current_plan: {
          name: string;
          // Other properties...
        };
        all_sum_amount: string;
        create_time: number;
        last_pay_time: number;
        user: {
          user_id: string;
          name: string;
          avatar: string;
          // Other properties...
        };
      }>;
    };
}

