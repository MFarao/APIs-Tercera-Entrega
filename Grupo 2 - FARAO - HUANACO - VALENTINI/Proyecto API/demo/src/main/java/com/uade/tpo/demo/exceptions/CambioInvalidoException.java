package com.uade.tpo.demo.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(code = HttpStatus.BAD_REQUEST, reason = "El cambio que se intento no es posible")
public class CambioInvalidoException extends Exception{
    
}
