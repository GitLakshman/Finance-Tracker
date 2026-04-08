package com.finance.tracker.dto;

import com.finance.tracker.enums.Category;
import com.finance.tracker.enums.TransactionType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TransactionResponse {
    private Long id;
    private TransactionType type;
    private Double amount;
    private Category category;     // null for income
    private String source;         // null for expense
    private String description;
    private LocalDate date;
}
