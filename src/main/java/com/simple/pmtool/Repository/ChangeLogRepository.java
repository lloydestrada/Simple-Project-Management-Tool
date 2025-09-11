package com.simple.pmtool.Repository;

import com.simple.pmtool.Model.ChangeLog;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ChangeLogRepository extends JpaRepository<ChangeLog, Long> {
    List<ChangeLog> findByTaskId(Long taskId);
}
