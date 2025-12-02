package com.Farm360.exception;

import lombok.Getter;

@Getter
public class GlobalException extends RuntimeException {

        private final String message;
        private final String status;
        private final String title;

    public GlobalException(String message, String status, String title) {
            super(message);
            this.message = message;
            this.status = status;
            this.title = title;
        }

        // default constructor for simple validation errors
    public GlobalException() {
            super("Validation Error");
            this.message = "Validation Error";
            this.status = "Failure";
            this.title = "Error";
        }
    }

