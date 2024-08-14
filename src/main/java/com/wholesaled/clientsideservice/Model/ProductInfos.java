package com.wholesaled.clientsideservice.Model;

import com.wholesaled.clientsideservice.Dto.CommentDto;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@AllArgsConstructor
@Getter
@Setter
public class ProductInfos {
    private Product product;
    private List<CommentDto> comments;
    private float raiting;
}
