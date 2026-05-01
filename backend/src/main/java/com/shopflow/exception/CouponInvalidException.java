package com.shopflow.exception;

public class CouponInvalidException extends RuntimeException {
    public CouponInvalidException(String message) {
        super(message);
    }
}

