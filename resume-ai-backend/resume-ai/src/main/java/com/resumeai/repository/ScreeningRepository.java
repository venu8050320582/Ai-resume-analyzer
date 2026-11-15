
package com.resumeai.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.resumeai.entity.ScreeningResult;

public interface ScreeningRepository
        extends JpaRepository<ScreeningResult, Long> {

    List<ScreeningResult> findByJob_IdOrderByMatchScoreDesc(Long jobId);

    List<ScreeningResult> findByResume_Id(Long resumeId);
}
