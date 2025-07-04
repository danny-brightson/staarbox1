package com.example.demo.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.entity.UserDetails;

@Repository
public interface UserRepository extends JpaRepository<UserDetails, Long> {

}
