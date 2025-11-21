package com.uade.tpo.demo.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(code = HttpStatus.BAD_REQUEST, reason = "La cantidad que se intenta iimponer supera al Stock del Producto")
public class CantidadExedenteException extends Exception{
    
}
