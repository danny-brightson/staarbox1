package com.example.demo.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.entity.ChildPackDetails;

@Repository
public interface ChildPackDetailsRepo extends JpaRepository<ChildPackDetails, Long> {

}
