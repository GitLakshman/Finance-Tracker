package com.finance.tracker.service.Impl;

import com.finance.tracker.dto.TransactionResponse;
import com.finance.tracker.entity.ExpenseEntity;
import com.finance.tracker.entity.IncomeEntity;
import com.finance.tracker.enums.TransactionType;
import com.finance.tracker.repository.ExpenseRepository;
import com.finance.tracker.repository.IncomeRepository;
import com.finance.tracker.service.TransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TransactionServiceImpl implements TransactionService {

    private final ExpenseRepository expenseRepository;
    private final IncomeRepository incomeRepository;

    @Override
    public Page<TransactionResponse> getTransactionHistory(String userId, int page, int size, TransactionType type, String dateFrom, String dateTo, String keyword) {
        List<TransactionResponse> transactions = new ArrayList<>();

        LocalDate from = (dateFrom != null && !dateFrom.isEmpty()) ? LocalDate.parse(dateFrom) : LocalDate.of(2000, 1, 1);
        LocalDate to = (dateTo != null && !dateTo.isEmpty()) ? LocalDate.parse(dateTo) : LocalDate.now();

        // Include expenses if type is null or EXPENSE
        if (type == null || type == TransactionType.EXPENSE) {
            List<ExpenseEntity> expenses = expenseRepository.findByUserIdAndDateBetweenOrderByDateDesc(userId, from, to);
            expenses.stream().filter(e -> keyword == null || keyword.isEmpty() || e.getCategory().name().toLowerCase().contains(keyword.toLowerCase()) || (e.getDescription() != null && e.getDescription().toLowerCase().contains(keyword.toLowerCase()))).map(e -> TransactionResponse.builder().id(e.getId()).type(TransactionType.EXPENSE).amount(e.getAmount()).category(e.getCategory()).description(e.getDescription()).date(e.getDate()).build()).forEach(transactions::add);
        }

        // Include incomes if type is null or INCOME
        if (type == null || type == TransactionType.INCOME) {
            List<IncomeEntity> incomes = incomeRepository.findByUserIdOrderByStartDateDesc(userId);
            incomes.stream().filter(i -> !i.getStartDate().isBefore(from) && !i.getStartDate().isAfter(to)).filter(i -> keyword == null || keyword.isEmpty() || i.getSource().toLowerCase().contains(keyword.toLowerCase()) || (i.getDescription() != null && i.getDescription().toLowerCase().contains(keyword.toLowerCase()))).map(i -> TransactionResponse.builder().id(i.getId()).type(TransactionType.INCOME).amount(i.getAmount()).source(i.getSource()).description(i.getDescription()).date(i.getStartDate()).build()).forEach(transactions::add);
        }

        // Sort all by date descending
        transactions.sort(Comparator.comparing(TransactionResponse::getDate).reversed());

        // Manual pagination
        int total = transactions.size();
        int start = Math.min(page * size, total);
        int end = Math.min(start + size, total);
        List<TransactionResponse> pageContent = transactions.subList(start, end);

        return new PageImpl<>(pageContent, PageRequest.of(page, size), total);
    }
}
