package com.wholesaled.clientsideservice.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.wholesaled.clientsideservice.Model.Images;

@Repository
public interface ImagesRepository extends JpaRepository<Images, Long> {
}
