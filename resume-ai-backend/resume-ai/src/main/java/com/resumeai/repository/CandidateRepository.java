
package com.resumeai.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import com.resumeai.entity.Candidate;

public interface CandidateRepository extends JpaRepository<Candidate, Long> {

    Optional<Candidate> findByEmail(String email);

    boolean existsByEmail(String email);
}
