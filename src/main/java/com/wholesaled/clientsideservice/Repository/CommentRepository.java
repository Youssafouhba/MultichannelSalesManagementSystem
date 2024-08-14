package com.wholesaled.clientsideservice.Repository;

import feign.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import com.wholesaled.clientsideservice.Model.Comment;

import java.util.List;

@Repository("CommentRepository")
public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findCommentsByUserId(Long clientId);
    Comment findCommentByIdIs(Long commentId);
    void deleteCommentsByUser_Id(Long userId);
    void deleteCommentsByProductId(Long productId);
    @Modifying
    @Query("DELETE FROM Comment c WHERE c.user.id = :userId")
    void deleteByUserId(@Param("userId") Long userId);
    void deleteCommentByUser_IdAndProductId(Long userId, Long productId);
    List<Comment> findCommentsByProduct_Id(Long productId);
}
