package com.wholesaled.clientsideservice.Controller;

import com.wholesaled.clientsideservice.Dto.CommentDto;
import com.wholesaled.clientsideservice.Model.Comment;
import com.wholesaled.clientsideservice.Service.CommentService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("/Comments")
public class CommentController {

    private final CommentService commentService;

    @PostMapping("/{clientId}/{productId}/{parentId}")
    public Comment addComment(@RequestBody Comment comment, @PathVariable("clientId") Long clientId, @PathVariable("productId") Long productId, @PathVariable("parentId") Long parentId) throws IOException {
        Comment savedComment = commentService.addComment(comment, clientId, productId,parentId);
        return savedComment;
    }

    @GetMapping("/{productId}")
    public List<CommentDto> getComments(@PathVariable("productId") Long productId) {
        return commentService.getComments(productId);
    }
}
