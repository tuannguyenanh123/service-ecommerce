'use strict'

const { Schema, model, Types } = require("mongoose");

const DOCUMENT_NAME = "Discount";
const COLLECTION_NAME = "discounts";

var discountSchema = new Schema(
    {
        discount_name: {
            type: String,
            required: true,
        },
        discount_description: {
            type: String,
            required: true,
        },
        discount_type: {
            type: String,
            default: 'fix_amount', //percentage
        },
        discount_value: {
            type: Number,
            required: true,
        },
        discount_code: {
            type: String,
            required: true,
        },
        discount_start_date: {
            type: Date,
            required: true,
        },
        discount_end_date: {
            type: Date,
            required: true,
        },
        discount_max_uses: {
            type: Number,
            required: true,
        },
        discount_uses_count: {
            type: Number,
            required: true, // số discount đã sử dụng
        },
        discount_users_used: {
            type: Array,
            default: [], //ai sử dụng
        },
        discount_max_uses_per_user: {
            type: Number,
            required: true, //sl discount cho phép trên mỗi user
        },
        discount_min_order_value: {
            type: Number,
            default: 0, //giá trị đơn hàng tối thiểu
        },
        discount_shopId: {
            type: Types.ObjectId,
            ref: 'Shop',
        },
        discount_is_active: {
            type: Boolean,
            default: true,
        },
        discount_applies_to: {
            type: String,
            required: true,
            enum: ['all', 'specific']
        },
        discount_product_ids: {
            type: Array,
            default: [], //số sản phẩm được áp dụng
        }
    },
    {
        collection: COLLECTION_NAME,
        timestamps: true,
    }
);

module.exports = model(DOCUMENT_NAME, discountSchema);
