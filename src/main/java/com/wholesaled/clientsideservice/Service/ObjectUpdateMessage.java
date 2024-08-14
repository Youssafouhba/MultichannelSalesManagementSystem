package com.wholesaled.clientsideservice.Service;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class ObjectUpdateMessage {
    private Object object;
    private String action;

    public ObjectUpdateMessage(Object object, String action) {
        this.object = object;
        this.action = action;
    }

}
