package com.uade.tpo.demo.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(code = HttpStatus.BAD_REQUEST, reason = "La orden que se intenta modificar no existe")
public class OrderNotExistsException extends Exception{
    
}
