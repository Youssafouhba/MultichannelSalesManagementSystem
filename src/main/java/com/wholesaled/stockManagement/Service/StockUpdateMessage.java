package com.wholesaled.stockManagement.Service;

import com.wholesaled.stockManagement.Model.StockAction;

import lombok.Getter;
import lombok.Setter;
@Setter
@Getter
public class StockUpdateMessage{
    private StockAction stockAction;
    private String action;

    public StockUpdateMessage(StockAction object, String action) {
        this.stockAction = object;
        this.action = action;
    }
}