package com.wholesaled.authentification.repository;


import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.wholesaled.authentification.model.User;

@Repository
public interface UserRepository extends JpaRepository<User,Long> {
    @Query("SELECT u FROM User u WHERE u.email = ?1")
    public Optional<User> findByEmail(String email);
    @Query("select u from User u where u.email=?1 and u.password=?2")
    public Optional<User> findByEmailAndPassword(String email, String password);

    Boolean existsByEmail(String email);

}