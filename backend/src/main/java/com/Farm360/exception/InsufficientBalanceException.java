package com.Farm360.exception;

public class InsufficientBalanceException extends RuntimeException {

    public InsufficientBalanceException(String message) {
        super(message);
    }

    // Optional: add default constructor if needed
    public InsufficientBalanceException() {
        super("Buyer wallet balance insufficient for agreement creation");
    }
}
