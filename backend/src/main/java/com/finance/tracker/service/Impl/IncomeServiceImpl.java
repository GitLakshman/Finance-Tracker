package com.finance.tracker.service.Impl;

import com.finance.tracker.dto.IncomeRequest;
import com.finance.tracker.entity.IncomeEntity;
import com.finance.tracker.exception.ResourceNotFoundException;
import com.finance.tracker.repository.IncomeRepository;
import com.finance.tracker.service.IncomeService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class IncomeServiceImpl implements IncomeService {

    private final IncomeRepository incomeRepository;

    @Override
    public IncomeEntity addIncome(String userId, IncomeRequest request) {
        IncomeEntity income = IncomeEntity.builder().userId(userId).source(request.getSource()).amount(request.getAmount()).frequency(request.getFrequency()).isRecurring(request.getIsRecurring()).startDate(request.getStartDate()).description(request.getDescription()).build();
        return incomeRepository.save(income);
    }

    @Override
    public Page<IncomeEntity> getAllIncomes(String userId, int page, int size) {
        PageRequest pageable = PageRequest.of(page, size, Sort.by("startDate").descending());
        return incomeRepository.findAllByUserIdOrderByStartDateDesc(userId, pageable);
    }

    @Override
    public void deleteIncome(String userId, Long id) {
        IncomeEntity income = incomeRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Income", "id", id));

        if (!income.getUserId().equals(userId)) {
            throw new RuntimeException("Access denied: You can only delete your own income entries");
        }
        incomeRepository.delete(income);
    }
}
