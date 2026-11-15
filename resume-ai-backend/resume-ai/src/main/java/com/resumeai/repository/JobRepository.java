
package com.resumeai.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.resumeai.entity.Job;

public interface JobRepository extends JpaRepository<Job, Long> {

}
