package com.finance.tracker.service;

import com.finance.tracker.dto.IncomeRequest;
import com.finance.tracker.entity.IncomeEntity;
import org.springframework.data.domain.Page;

public interface IncomeService {
    IncomeEntity addIncome(String userId, IncomeRequest request);
    Page<IncomeEntity> getAllIncomes(String userId, int page, int size);
    void deleteIncome(String userId, Long id);
}
