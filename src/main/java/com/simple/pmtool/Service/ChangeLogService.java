package com.simple.pmtool.Service;

import com.simple.pmtool.Model.ChangeLog;
import com.simple.pmtool.Repository.ChangeLogRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ChangeLogService {

    private final ChangeLogRepository changeLogRepository;

    public ChangeLogService(ChangeLogRepository changeLogRepository) {
        this.changeLogRepository = changeLogRepository;
    }

    public List<ChangeLog> getAllLogs() {
        return changeLogRepository.findAll();
    }

    public List<ChangeLog> getLogsByTask(Long taskId) {
        return changeLogRepository.findByTaskId(taskId);
    }

    public ChangeLog createLog(ChangeLog log) {
        return changeLogRepository.save(log);
    }

    public void deleteLog(Long id) {
        changeLogRepository.deleteById(id);
    }

}
