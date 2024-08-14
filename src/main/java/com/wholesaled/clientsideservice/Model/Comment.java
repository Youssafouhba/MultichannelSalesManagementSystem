package com.wholesaled.clientsideservice.Model;

import java.util.Date;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.wholesaled.authentification.model.User;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "Comments")
@AllArgsConstructor
@NoArgsConstructor
public class Comment {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String content;

    private boolean first;

    private Long rating;

    @Temporal(TemporalType.DATE)
    private Date createdDate;

    @ManyToOne
    @JoinColumn(name = "id_product", nullable = false)
    @JsonIgnore
    private Product product;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_id", nullable = false)
    private User user;

    @OneToMany(mappedBy = "parentComment", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Comment> replies;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_comment_id")
    private Comment parentComment;}
