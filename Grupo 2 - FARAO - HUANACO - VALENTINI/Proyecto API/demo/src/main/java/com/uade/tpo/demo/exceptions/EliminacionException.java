package com.uade.tpo.demo.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(code = HttpStatus.ACCEPTED, reason = "La eliminacion se realizo correctamente")
public class EliminacionException extends Exception{
    
}
