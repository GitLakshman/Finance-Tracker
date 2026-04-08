package com.finance.tracker.service;

import com.finance.tracker.dto.TransactionResponse;
import com.finance.tracker.enums.TransactionType;
import org.springframework.data.domain.Page;

public interface TransactionService {
    Page<TransactionResponse> getTransactionHistory(String userId, int page, int size,
                                                    TransactionType type,
                                                    String dateFrom, String dateTo,
                                                    String keyword);
}
