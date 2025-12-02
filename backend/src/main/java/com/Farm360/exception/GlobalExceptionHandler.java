package com.Farm360.exception;

import com.Farm360.dto.response.GlobalRS;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(GlobalException.class)
    public ResponseEntity<GlobalRS> handleGlobalException(GlobalException ex) {

        GlobalRS rs = new GlobalRS(
                ex.getMessage(),
                ex.getStatus(),
                ex.getTitle()
        );

        return new ResponseEntity<>(rs, HttpStatus.BAD_REQUEST);
    }

    // Handles all other unknown errors
    @ExceptionHandler(Exception.class)
    public ResponseEntity<GlobalRS> handleGeneralException(Exception ex) {

        ex.printStackTrace();  // optional logging

        GlobalRS rs = new GlobalRS(
                ex.getMessage(),
                "Failure",
                "Server Error"
        );

        return new ResponseEntity<>(rs, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
