package com.wholesaled.clientsideservice.Dto;

import lombok.Data;

import java.util.Date;
import java.util.List;

@Data
public class CommentDto {
        private Long id;
        private boolean first;
        private String content;
        public String author;
        public Long rating;
        private Date createdDate;
        private List<CommentDto> replies;
}
