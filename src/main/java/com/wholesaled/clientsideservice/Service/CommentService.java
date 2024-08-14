package com.wholesaled.clientsideservice.Service;

import com.wholesaled.authentification.Service.UserService;
import com.wholesaled.clientsideservice.Dto.CommentDto;
import com.wholesaled.clientsideservice.Model.Comment;
import com.wholesaled.clientsideservice.Repository.CommentRepository;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
@AllArgsConstructor
@Getter
@Setter
public class CommentService {
    private final CommentRepository commentRepository;

    private final UserService clientService;

    private final ProductService productService;

    private final ModelMapper modelMapper;

    public Comment addComment(Comment comment,Long clientId,Long productId,Long prentId) {
        comment.setUser(clientService.getClientById(clientId));
        comment.setProduct(productService.getProductById(productId));
        comment.setFirst(true);
        if (prentId != 0) {
            comment.setFirst(false);
            comment.setParentComment(commentRepository.findCommentByIdIs(prentId));
        }
        comment.setCreatedDate(new Date());
        return commentRepository.save(comment);
    }

    public List<CommentDto> getComments(Long productId) {
        return commentRepository.findCommentsByProduct_Id(productId).stream().map(
                comment -> CommentToDto(comment)).toList();
    }

    public CommentDto CommentToDto(Comment comment) {
        CommentDto commentDto = modelMapper.map(comment, CommentDto.class);
        commentDto.setAuthor(comment.getUser().getFullName());
        return commentDto;
    }

    @Transactional
    public void deleteCommentsByID(Long clientId){
        commentRepository.deleteCommentsByUser_Id(clientId);
    }
}
